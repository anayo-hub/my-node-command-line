const fs = require("fs/promises");
const fetch = require("node-fetch");
const express = require("express");
const EventEmitter = require("events");

const app = express();
const port = 3000;

const CREATE_FILE = "create a file";

const createFile = async (path) => {
  try {
    let existingFileHandle = await fs.open(path, "r");
    existingFileHandle.close();
    return console.log(`${path} already exists`);
  } catch (error) {
    const newFileHandle = await fs.open(path, "w");
    console.log("New file was created");
    newFileHandle.close();
  }
};

const handleCommand = async (command) => {
  if (command.includes(CREATE_FILE)) {
    const filePath = command.substring(CREATE_FILE.length + 1);
    createFile(filePath);
  } else if (command.includes("weather in")) {
    const location = command.substring("weather in".length + 1);
    await fetchWeather(location);
  } else {
    console.log("Unknown command:", command);
  }
};

const fetchWeather = async (location) => {
  const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === 200) {
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      console.log(
        `Weather in ${location}: ${weatherDescription}, Temperature: ${temperature}°C`
      );
    } else {
      console.log("Weather data not available for this location.");
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

const CFH = await fs.open("./command.txt", "r");
const commandEmitter = new EventEmitter();

CFH.on("change", async () => {
  const size = (await CFH.stat()).size;
  const buff = Buffer.alloc(size);

  const offset = 0;
  const length = buff.byteLength;
  const position = 0;

  await CFH.read(buff, offset, length, position);
  const command = buff.toString("utf-8");
  await handleCommand(command);
});

const watcher = fs.watch("./command.txt");
for await (const event of watcher) {
  if (event === "change") {
    commandEmitter.emit("commandChange");
  }
}

app.get("/", (req, res) => {
  res.send("Welcome to the Bot Server!");
});

app.listen(port, () => {
  console.log(`Bot Server is running on port ${port}`);
});
