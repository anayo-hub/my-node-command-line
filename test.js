// // first
// fs.watch("./", { recursive: true }, (eventType, filename) => {
//   try {
//     if (filename) {
//       console.log(`Event type: ${eventType} - File: ${filename}`);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// // second
// const fs = require("fs/promises");

// (async () => {
//   fs.watch("./", { recursive: true }, (eventType, filename) => {
//     try {
//       if (filename) {
//         console.log(`Event type: ${eventType} - File: ${filename}`);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
// })();

// // third
// const fs = require("fs");

// fs.watch("./", { recursive: true }, (eventType, filename) => {
//   try {
//     if (filename) {
//       console.log(`Event type: ${eventType} - File: ${filename}`);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// const fs = require("fs/promises");

// (async () => {
//   const watcher = fs.watch("./command.txt");

//   for await (const { eventType, filename } of watcher) {
//     if (eventType === "change") {
//       //   how do we read the content to determine the next action with using the file as our command line
//     }
//   }
// })();

const fs = require("fs/promises");

(async () => {
  try {
    // oepn mmethod return another method calleed filehandler
    const CFH = await fs.open("./command.txt", "r");
    //watcher over ffile
    const watcher = fs.watch("./command.txt");
    //loop ovr file  to get event
    for await (const event of watcher) {
      // fs.watch returns only change evt
      if (event.eventType === "change") {
        //check size to allocate buffer
        console.log(await CFH.stat());
      }
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("file does not exist, please check your file name");
    } else {
      console.log(error);
    }
  }
})();
