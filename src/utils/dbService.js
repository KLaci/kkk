import knex from "knex";
import CsvAdapter from "./CsvAdapter";

export const db = knex({
    client: "sqlite3",
    connection: {
        filename: "./db.sqlite"
    }
});
const employeeColumns = ["name", "pin"];

const employees = new CsvAdapter("employees.csv").read(employeeColumns);

export let cachedEntries = [];

async function loadTest() {
    for (let i = 0; i < 499; i++) {
        await db.from("workRecords").insert({ name: "Kiss Laszlo2", checkinTime: 1580755125000, checkoutTime: 1580955125000, comment: "" });
    }
}

export async function loadData() {
    await loadTest();
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

    latestEntries.forEach(e => {
        e.sumTime = calculateSum(e.name, entries);
        e.dailySumTime = calculateDailySum(e.name, entries);
    });

    return latestEntries;
}

export async function loadAdminData(date) {
    const entries = await db.from("workRecords").select("*");

    const currentDate = date ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    return entries
        .filter(e => e.checkinTime > currentDate && e.checkinTime < nextMonth)
        .map(e => ({ ...e, checkinTime: new Date(Number(e.checkinTime)), checkoutTime: new Date(Number(e.checkoutTime)) }));
}

export async function addEntry(record) {
    cachedEntries.push(record);

    const { name, checkinTime, checkoutTime, comment } = record;
    await db("workRecords").insert({ name, checkinTime, checkoutTime, comment });
}

export async function changeComment(id, comment) {
    await db("workRecords")
        .where({ id })
        .update({ comment });
}

function calculateSumInternal(name, entries, startDate) {
    let sum = 0;
    for (let entry of entries.filter(e => e.name === name && e.checkinTime > startDate)) {
        sum += entry.checkoutTime.getTime() - entry.checkinTime.getTime();
    }

    return sum;
}

export function calculateSum(name, entries) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    return calculateSumInternal(name, entries, startOfMonth);
}

export function calculateDailySum(name, entries) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    console.log("TCL: calculateDailySum -> start", start);

    return calculateSumInternal(name, entries, start);
}
