const fs = window.require("fs");

export default class WorkingFileSync {
  constructor(path) {
    this.path = path;
  }

  read() {
    if (fs.existsSync(this.path)) {
      const content = fs.readFileSync(this.path, "utf8");
      return content ? JSON.parse(content) : {};
    }
    return {};
  }

  write(data) {
    fs.writeFileSync(this.path, JSON.stringify(data));
  }
}
