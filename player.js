const block = require("./block.json");

class player {
  constructor(map) {
    this.y = Math.floor(Math.random() * 10);
    this.x = Math.floor(Math.random() * 10);
    this.level = 1;
    this.energy = 200;
    this.maxEnergy = 200 * this.level;
    this.coin = 0;
    this.map = map;
    this.bomb = 1;
    this.caracter = "💀";
  }
  canGo(x, y) {
    return this.map[y] && this.map[y][x] && this.map[y][x].break;
  }

  toRight() {
    if (!this.canGo(this.x + 1, this.y) || this.canDown()) return;
    this.move(this.x + 1, this.y);
    this.energy -= 10;
  }
  toLeft() {
    if (!this.canGo(this.x - 1, this.y) || this.canDown()) return;

    this.move(this.x - 1, this.y);
    this.energy -= 10;
  }
  toUp() {
    if (!this.canGo(this.x, this.y - 1) || this.canDown()) return;
    let y = this.y;
    this.move(this.x, this.y - 1);
    if (y !== this.y) this.map[this.y + 1][this.x] = block[5];
    this.energy -= 10;
  }
  toDown() {
    if (!this.canGo(this.x, this.y + 1) || this.canDown()) return;
    this.move(this.x, this.y + 1);
    this.energy -= 10;
  }
  toDrop() {
    if (!this.canGo(this.x, this.y + 1)) return;
    this.move(this.x, this.y + 1);
  }
  getSepecialBlock() {
    if (this.map[this.y][this.x].coin) this.coin += this.map[this.y][this.x].coin;
    else if (this.map[this.y][this.x].fuel) {
      this.energy += this.map[this.y][this.x].fuel;
      if (this.energy >= this.maxEnergy) this.energy = this.maxEnergy;
    } else if (this.map[this.y][this.x].id === 9) this.bomb++;
    // this.map[this.y][this.x] = block[0];
  }
  move(x, y) {
    if (!this.canGo(x, y)) return;
    if (this.map[this.y][this.x].id !== 5) this.map[this.y][this.x] = block[0];
    if (y == this.y + y && this.map[this.y + 1][this.x].id == 0) this.map[this.y + 1][this.x] = block[6];
    this.y = y;
    this.x = x;
    this.getSepecialBlock();
    this.map[y][x] = { symbols: this.caracter };
  }
  canDown() {
    return this.map[this.y + 1] && this.map[this.y + 1][this.x] && this.map[this.y + 1][this.x].id === 0;
  }

  energyOut() {
    return this.energy <= 0;
  }
  bombDuar() {
    if (this.bomb <= 0) return;
    this.bomb--;
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (this.map[this.y + y] && this.map[this.y + y][this.x + x]) this.map[this.y + y][this.x + x] = block[0];
      }
    }
  }

  restart(map) {
    this.y = 0; // Math.floor(Math.random() * (map.length / 2));
    this.x = Math.floor(Math.random() * map[0].length);
    this.map = map;
    this.maxEnergy = 100 * this.level;
    this.energy = this.maxEnergy;
    this.map[this.y][this.x] = { symbols: this.caracter };
  }
}
module.exports = player;
