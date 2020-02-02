import CsvAdapter from "./CsvAdapter";

const adapter = new CsvAdapter("db.csv");

const columns = ["name", "checkinTime", "checkoutTime", "comment"];
const outputColumns = ["name", "sum"];
const employeeColumns = ["name", "pin"];

const employees = new CsvAdapter("employees.csv").read(employeeColumns);

export let cachedEntries = [];

export function loadData() {
    const entries = adapter.read(columns);
    console.log("TCL: loadData -> entries", entries);
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

export function exportData(date, fileName) {
    const entries = adapter.read(columns);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const monthEntries = entries.filter(e => e.checkinTime > date && e.checkinTime < nextMonth);

    const latestEntries = employees.map(e => ({ ...e, sum: 0 }));

    for (let entry of monthEntries) {
        const le = latestEntries.find(e => e.name === entry.name);
        if (!le) continue;
        le.sum += entry.checkoutTime - entry.checkinTime;
    }

    new CsvAdapter(fileName).write(
        latestEntries.map(c => ({
            ...c,
            sum: c.sum / (1000 * 60 * 60)
        })),
        outputColumns
    );
}

// Currently not in use
export function exportDataPerRow(date, fileName) {
    const entries = adapter.read(columns);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const monthEntries = entries.filter(e => e.checkinTime > date && e.checkinTime < nextMonth);

    new CsvAdapter(fileName).write(
        monthEntries.map(c => ({
            ...c,
            day: new Date(Number(c.checkinTime)).toLocaleDateString("hu-HU"),
            checkinTime: new Date(Number(c.checkinTime)).toLocaleString([], { hour: "2-digit", minute: "2-digit" }),
            checkoutTime: new Date(Number(c.checkoutTime)).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
        })),
        outputColumns
    );
}

export function loadAdminData(date) {
    const entries = adapter.read(columns);
    console.log("TCL: loadAdminData -> entries", entries);
    const currentDate = date ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    console.log("TCL: loadAdminData -> currentDate", currentDate);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    console.log("TCL: loadAdminData -> nextMonth", nextMonth);

    return entries
        .filter(e => e.checkinTime > currentDate && e.checkinTime < nextMonth)
        .map(e => ({ ...e, checkinTime: new Date(Number(e.checkinTime)), checkoutTime: new Date(Number(e.checkoutTime)) }));
}

export function addEntry(record) {
    cachedEntries.push(record);
    adapter.append(record, columns);
}

export function calculateSum(name, entries) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    let sum = 0;
    for (let entry of entries.filter(e => e.name === name && e.checkinTime > startOfMonth)) {
        sum += entry.checkoutTime.getTime() - entry.checkinTime.getTime();
    }

    return sum;
}
