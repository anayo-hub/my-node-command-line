const fs = require("fs/promises");

(async () => {
  try {
    // oepn mmethod return another method calleed filehandler
    const CFH = await fs.open("./command.txt", "r");

    CFH.on("change", async () => {
      //check size to allocate buff
      const size = (await CFH.stat()).size;
      const buff = Buffer.alloc(size);

      const offfset = 0;
      const length = buff.byteLength;
      const position = 0;

      const content = await CFH.read(buff, offfset, length, position);
      console.log(content);
    });

    //watcher over ffile
    const watcher = fs.watch("./command.txt");
    //loop ovr file  to get event
    for await (const event of watcher) {
      // fs.watch returns only change evt
      if (event.eventType === "change") {
        CFH.emit("change");
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
