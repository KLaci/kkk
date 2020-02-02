import knex from "knex";
import CsvAdapter from "./CsvAdapter";

const db = knex({
    client: "sqlite3",
    connection: {
        filename: "./db.sqlite"
    }
});
const employeeColumns = ["name", "pin"];

const employees = new CsvAdapter("employees.csv").read(employeeColumns);

export let cachedEntries = [];

export async function loadData() {
    const entries = await db.from("workRecords").select("*");

    const latestEntries = employees;
    for (let entry of entries) {
        entry.checkinTime = new Date(Number(entry.checkinTime));
        entry.checkoutTime = new Date(Number(entry.checkoutTime));

        const employee = latestEntries.find(e => e.name === entry.name);
        if (!employee) continue;

        employee.checkinTime = entry.checkinTime;
        employee.checkoutTime = entry.checkoutTime;
    }

    cachedEntries = entries;

    latestEntries.forEach(e => (e.sumTime = calculateSum(e.name, entries)));

    return latestEntries;
}

export async function loadAdminData(date) {
    const entries = await db.from("workRecords").select("*");

    console.log("TCL: loadAdminData -> entries", entries);
    const currentDate = date ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    console.log("TCL: loadAdminData -> currentDate", currentDate);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    console.log("TCL: loadAdminData -> nextMonth", nextMonth);

    return entries
        .filter(e => e.checkinTime > currentDate && e.checkinTime < nextMonth)
        .map(e => ({ ...e, checkinTime: new Date(Number(e.checkinTime)), checkoutTime: new Date(Number(e.checkoutTime)) }));
}

export async function addEntry({ name, checkinTime, checkoutTime, comment }) {
    await db("workRecords").insert({ name, checkinTime, checkoutTime, comment });
}

export async function changeComment(id, comment) {
    await db("workRecords")
        .where({ id })
        .update({ comment });
}

export function calculateSum(name, entries) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    let sum = 0;
    for (let entry of entries.filter(e => e.name === name && e.checkinTime > startOfMonth)) {
        sum += entry.checkoutTime.getTime() - entry.checkinTime.getTime();
    }

    return sum;
}
