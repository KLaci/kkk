import low from "lowdb";
import CustomAdapter from "./CustomAdapter";

const adapter = new CustomAdapter("db.json");
const db = low(adapter);

db.defaults({ entries: [] }).write();

export default {
  loadData: () => {
    const entries = db.get("entries");
    const latestEntries = {};
    const date = new Date();
    for (let entry of entries) {
      entry.checkinTime = new Date(entry.checkinTime);
      entry.checkoutTime = new Date(entry.checkoutTime);

      if (
        entry.checkinTime > new Date(date.getFullYear(), date.getMonth(), 1)
      ) {
        entry.sumTime =
          (entry.sumTime ?? 0) +
          (entry.checkoutTime.getTime() - entry.checkinTime.getTime());
      }
      latestEntries[entry.name] = entry;
    }
    return latestEntries;
  },
  addEntry: record => {
    db.get("entries")
      .push(record)
      .write();
  }
};
