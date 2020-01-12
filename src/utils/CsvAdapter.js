import parse from "csv-parse/lib/sync";
import stringify from "csv-stringify/lib/sync";
const fs = window.require("fs");

export default class WorkingFileSync {
  constructor(path) {
    this.path = path;
  }

  read(columns) {
    if (fs.existsSync(this.path)) {
      const content = fs.readFileSync(this.path, "utf8");
      const data = parse(content, {
        header: true,
        columns
      });
      return data ?? [];
    }
    return [];
  }

  write(data, columns) {
    const dataStr = stringify(data, {
      header: true,
      columns
    });
    fs.writeFileSync(this.path, dataStr);
  }

  append(record, columns) {
    const dataStr = stringify([record], {
      columns
    });
    fs.appendFileSync(this.path, dataStr);
  }
}
