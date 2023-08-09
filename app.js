const fs = require("fs/promises");

(async () => {
  try {
    // commands
    const create = "create a file";

    const createFile = async (path) => {
      let existingFileHandle;
      try {
        existingFileHandle = await fs.open(path, "r");
        return console.log(`this ile ${path} already exists, use another name`);
        fs.writeFile("text.txt", path);
      } catch (error) {
        console.log(error);
      }
      existingFileHandle.close();
    };

    // oepn mmethod return another method calleed filehandler
    const CFH = await fs.open("./command.txt", "r");

    CFH.on("change", async () => {
      //check size to allocate buff
      const size = (await CFH.stat()).size;
      const buff = Buffer.alloc(size);

      const offfset = 0;
      const length = buff.byteLength;
      const position = 0;

      await CFH.read(buff, offfset, length, position);
      const command = buff.toString("utf-8");

      //create a flie
      if (command.includes(create)) {
        const filePath = command.substring(create + 1);
        createFile(filePath);
      }
    });

    //main watcher over file
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
