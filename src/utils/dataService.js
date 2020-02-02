import CsvAdapter from "./CsvAdapter";

const adapter = new CsvAdapter("db.csv");

const columns = ["name", "checkinTime", "checkoutTime", "comment"];
const outputColumns = ["name", "sum"];
const employeeColumns = ["name", "pin"];

const employees = new CsvAdapter("employees.csv").read(employeeColumns);

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
