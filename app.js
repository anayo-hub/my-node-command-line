const fs = require("fs/promises");

(async () => {
  try {
    // commands
    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete a file";
    const RENAME_FILE = "rename the file";
    const ADD_TO_FFILE = "add to the file";

    const createFile = async (path) => {
      try {
        // check if file name already exist
        let existingFileHandle = await fs.open(path, "r");
        existingFileHandle.close();
        return console.log(`${path} already exists`);
      } catch (error) {
        // if it is not creat one with "w" flags
        const newFileHandle = await fs.open(path, "w");
        console.log("new file was cretated");
        newFileHandle.close();
      }
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

      //CREATE_FILE a flie
      if (command.includes(CREATE_FILE)) {
        const filePath = command.substring(CREATE_FILE.length + 1);
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
