const fs = window.require("fs");

export function loadConfig() {
    const content = fs.readFileSync("config.json", "utf8");
    return content ? JSON.parse(content) : {};
}
