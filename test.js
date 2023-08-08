// first
fs.watch("./", { recursive: true }, (eventType, filename) => {
  try {
    if (filename) {
      console.log(`Event type: ${eventType} - File: ${filename}`);
    }
  } catch (error) {
    console.log(error);
  }
});

// second
const fs = require("fs/promises");

(async () => {
  fs.watch("./", { recursive: true }, (eventType, filename) => {
    try {
      if (filename) {
        console.log(`Event type: ${eventType} - File: ${filename}`);
      }
    } catch (error) {
      console.log(error);
    }
  });
})();

// third
const fs = require("fs");

fs.watch("./", { recursive: true }, (eventType, filename) => {
  try {
    if (filename) {
      console.log(`Event type: ${eventType} - File: ${filename}`);
    }
  } catch (error) {
    console.log(error);
  }
});

const fs = require("fs/promises");

(async () => {
  const watcher = fs.watch("./command.txt");

  for await (const { eventType, filename } of watcher) {
    if (eventType === "change") {
      //   how do we read the content to determine the next action with using the file as our command line
    }
  }
})();
