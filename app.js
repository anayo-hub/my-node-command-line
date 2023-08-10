const fs = require("fs/promises");

(async () => {
  try {
    // commands
    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete the file";
    const RENAME_FILE = "rename the file";
    const ADD_TO_FILE = "add to the file";

    const createFile = async (path) => {
      try {
        // Check if file name already exists
        await fs.access(path, fs.constants.F_OK);
        console.log(`${path} already exists`);
      } catch (error) {
        if (error.code === "ENOENT") {
          try {
            // Create a new file
            const newFileHandle = await fs.open(path, "w");
            console.log(`New file ${path} was created`);
            await newFileHandle.close();
          } catch (writeError) {
            console.error(`Error creating file: ${writeError.message}`);
          }
        } else {
          console.error(`Error checking file existence: ${error.message}`);
        }
      }
    };

    //delete function
    const deleteFile = async (filePath) => {
      try {
        await fs.unlink(filePath);
        console.log("File deleted successfully");
      } catch (error) {
        if (error.code === "ENOENT") {
          console.error(`File not found: ${filePath}`);
        } else {
          console.error(`Error deleting file: ${error.message}`);
        }
      }
    };

    // rename function
    const renameFile = async (oldFilePath, newFilePath) => {
      try {
        await fs.rename(oldFilePath, newFilePath);
        console.log(`${oldFilePath} renamed to ${newFilePath}`);
      } catch (error) {
        if (error.code === "ENOENT") {
          console.error(
            `Error renaming file: The file "${oldFilePath}" does not exist.`
          );
        } else if (error.code === "EEXIST") {
          console.error(
            `Error renaming file: The file "${newFilePath}" already exists.`
          );
        } else {
          console.error(`Error renaming file: ${error.message}`);
        }
      }
    };

    let addedContent;

    const addContent = async (filePath, content) => {
      if (addedContent === content) return; // Use 'addedContent' here
      try {
        const fileHandle = await fs.open(filePath, "a");
        await fileHandle.write(content);
        addedContent = content;
        await fileHandle.close();
        console.log(`Added content to ${filePath}: ${content}`);
      } catch (error) {
        if (error.code === "ENOENT") {
          console.error(
            `Error adding content: The file "${filePath}" does not exist.`
          );
        } else if (error.code === "EACCES") {
          console.error(
            `Error adding content: Permission denied for file "${filePath}".`
          );
        } else {
          console.error(`Error adding content: ${error.message}`);
        }
      }
    };
    // const addContent = async (filePath, content) => {
    //   try {
    //     await fs.appendFile(filePath, content);
    //     console.log(`Added content to ${filePath}: ${content}`);
    //   } catch (error) {
    //     if (error.code === "ENOENT") {
    //       console.error(
    //         `Error adding content: The file "${filePath}" does not exist.`
    //       );
    //     } else {
    //       console.error(`Error adding content: ${error.message}`);
    //     }
    //   }
    // };

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

      //crete a flie
      //create a file <path>
      if (command.includes(CREATE_FILE)) {
        const filePath = command.substring(CREATE_FILE.length + 1);
        createFile(filePath);
      }

      //delete a flie
      //delete a file <path>
      if (command.includes(DELETE_FILE)) {
        const filePath = command.substring(DELETE_FILE.length + 1);
        deleteFile(filePath);
      }

      //rename the flie
      //rename the file <path>
      if (command.includes(RENAME_FILE)) {
        const _idx = command.indexOf(" to ");
        const oldFilePath = command.substring(RENAME_FILE + 1, _idx);
        const newFilePath = command.substring(_idx + 4);
        renameFile(oldFilePath, newFilePath);
      }

      //add to the flie
      //add to the file <path> this content: <content>
      if (command.includes(ADD_TO_FILE)) {
        const _idx = command.indexOf(" this content: ");
        const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
        const content = command.substring(_idx + 15);

        addContent(filePath, content);
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
