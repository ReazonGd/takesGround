const Player = require("./player");
const Tetrain = require("./createMap");
const player = new Player();
const cfont = require("cfonts");
const term = require("terminal-kit").terminal;
let section = "menu",
  mapHeight = 10;
const sleep = (ms = 100) => new Promise((ex) => setTimeout(ex, ms));
console.clear();

const menu = () => {
  console.clear();
  cfont.say("Take$Ground", {
    font: "block",
    align: "left",
    colors: ["cyan"],
  });
  term(`this is a weird game made by me. 
the rules are simpple. dig down until you get "🏁".
 🔋 => to increase energy by 10 
 💶 => coin 
 🟦 => coins, but a little bit. 
 💀 => player. 
 
How to play: use the ← ↑ ↓ → arrow keys to move the player. 
Press the "TAB" key to pause the game. 
${player.level == 1 ? "" : `play to continue level ${player.level}`}`);
  term.singleRowMenu(["play", "exit"], { style: term.cyan }, (err, res) => {
    if (res.selectedText == "exit") exit(0);
    else if (res.selectedText == "play") {
      player.restart(new Tetrain().create(1000, mapHeight * player.level * 1.2));
      play();
      section = "play";
    }
  });
};
const shop = () => {
  console.clear();
  term("WELCOME TO SHOP\n You have: " + player.coin);
  const shopData = [
    {
      name: "Energy 🔌",
      description: "Add + 50 energy",
      cost: 30,
    },
    {
      name: "Battery 🔋",
      description: "Add + 100 maximal energy",
      cost: 80,
    },
    {
      name: "Bomb 💣",
      description: "give 1 bom.",
      cost: 50,
    },
  ];
  let list = shopData.map((val, i) => `${i + 1}. ${val.name}\t${val.description}\tCost : ${val.cost} coin`);
  list.push("back");
  term.singleColumnMenu(list, { style: term.cyan }, (err, res) => {
    if (res.selectedText == "back") {
      section = "pause";
      return pause();
    } else {
      if (player.coin < shopData[res.selectedIndex].cost) return shop();
      let selected = res.selectedIndex;
      if (selected == 0) {
        player.energy += 50;
        if (player.energy > player.maxEnergy) player.energy = player.maxEnergy;
      } else if (selected == 1) player.maxEnergy += 100;
      else if (selected == 2) player.bomb += 1;
      player.coin -= shopData[res.selectedIndex].cost;
      return shop();
    }
  });
};
const pause = () => {
  term.clear();
  cfont.say("Paused", {
    font: "block",
    align: "left",
    colors: ["cyan"],
  });
  term("game has poused!");
  term.singleRowMenu(["resume", "menu", "shop", "exit"], { style: term.cyan }, (err, res) => {
    if (res.selectedText == "exit") process.exit(0);
    else if (res.selectedText == "resume") {
      play();
      section = "play";
    } else if (res.selectedText == "menu") {
      menu();
      section = "menu";
    } else if (res.selectedText == "shop") {
      shop();
      section = "shop";
    }
  });
};
const play = async () => {
  let mapRes = ``;
  for (let y = -5; y <= 5; y++) {
    for (let x = -10; x <= 10; x++) {
      if (player.map[player.y + y] && player.map[player.y + y][player.x + x]) mapRes += player.map[player.y + y][player.x + x].symbols;
    }
    mapRes += "\n";
  }

  console.clear();
  // 0000
  let percent = Math.floor((player.energy / player.maxEnergy) * 100);
  mapRes += `\n Energy :${new Array(10)
    .fill(0)
    .map((val, i) => (i >= percent / 10 ? "⬛" : "⬜"))
    .join("")} ${percent}%\ncoin : ${player.coin}\nPress Arrow to move and "TAB" to pause the game\nBom : ${player.bomb} (Press a)\nLevel ${player.level}`;
  console.log(mapRes);

  if (player.canDown()) {
    await sleep();
    player.toDrop();
    return play();
  } else if (player.y == player.map.length - 1) {
    section = "win";
    return win();
  } else if (player.energyOut()) {
    section = "game over";
    gameOver();
  }
};
const gameOver = () => {
  console.clear();
  cfont.say("GAMEOVER!", {
    font: "block",
    align: "left",
    colors: ["red"],
  });
  term.singleRowMenu(["menu", "exit"], { style: term.cyan }, (err, res) => {
    if (res.selectedText == "exit") exit();
    else if (res.selectedText == "menu") {
      menu();
      section = "menu";
    }
  });
};
const exit = () => {
  console.clear();
  cfont.say("Thanks for playing!", {
    font: "block",
    align: "left",
    colors: ["red"],
  });
  cfont.say("made by ReazonGd", {
    font: "console",
    align: "left",
    colors: ["red"],
  });
  process.exit();
};
const win = () => {
  console.clear();
  cfont.say("level " + player.level + " compleate", {
    font: "block",
    align: "left",
    colors: ["blue"],
  });
  term.singleRowMenu(["Next level"], { style: term.cyan }, (err, res) => {
    if (res.selectedText == "Next level") {
      player.level++;
      player.restart(new Tetrain().create(1000, mapHeight * player.level * 1.2));
      play();
      section = "play";
    }
  });
};

term.on("key", (name) => {
  if (name == "CTRL_C") exit(0);
  else if (section == "play") {
    if (name === "UP") player.toUp();
    else if (name === "DOWN") player.toDown();
    else if (name === "RIGHT") player.toRight();
    else if (name === "LEFT") player.toLeft();
    else if (name === "a") player.bombDuar();
    else if (name === "TAB") {
      section = "pause";
      return pause();
    }
    return play();
  }
});

menu();
