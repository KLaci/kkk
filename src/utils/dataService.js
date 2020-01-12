import CsvAdapter from "./CsvAdapter";
const adapter = new CsvAdapter("db.csv");

const columns = ["name", "checkinTime", "checkoutTime", "comment"];
const employeeColumns = ["name", "pin"];

const employees = new CsvAdapter("employees.csv").read(employeeColumns);

export let cachedEntries = [];

export function loadData() {
  const entries = adapter.read(columns);
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
