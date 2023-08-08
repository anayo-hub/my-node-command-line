const fs = require("fs/promises");

(async () => {
  const CLI = fs.open("./command.txt", "r");
  const watcher = fs.watch("./command.txt");

  for await (const { eventType } of watcher) {
    if (eventType) {
      console.log(eventType);
    }
  }
})();
