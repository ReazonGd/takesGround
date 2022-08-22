const block = require("./block.json");

class tetrain {
  constructor(width) {
    this.map = [];
    this.current = [];
    this.last = [];
  }
  create(width, height) {
    this.map = new Array(height).fill(0).map(() => this.generateNoise(width));

    while (this.checkDiffernt(this.map, this.last)) {
      this.last = this.map;
      this.map = this.cellularAutomaton(this.last);
    }

    this.map.forEach((valY, y) => {
      valY.forEach((valX, x) => {
        this.map[y][x] = this.replaceToBlock(this.map, y, x);
      });
    });
    return this.map;
  }
  cellularAutomaton(Map) {
    const tmpMap = this.copyObj(Map);
    tmpMap.forEach((valY, y) => {
      valY.forEach((valX, x) => {
        tmpMap[y][x] = this.makeCave(tmpMap, y, x);
        // this.map[y][x] = this.replaceToBlock(map, y, x);
      });
    });
    return tmpMap;
  }
  generateNoise(width) {
    return new Array(width).fill(0).map(() => (Math.random() >= 0.56 ? 0 : 1));
  }
  makeCave(map, yMap, xMap) {
    let sum = 0;
    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (!map[yMap + y] || map[yMap + y][xMap + x]) sum--;
        else sum++;
      }
    }
    return sum > 0 ? 0 : 1;
  }
  replaceToBlock(map = this.map, y, x) {
    if (y <= 1) return block[0];
    else if (y == map.length - 1) return block[7];
    else if (map[y][x] == 0) return block[map[y][x]];
    let random = Math.random() * 20;
    if (y == 2) return block[6];
    else if (random >= 0 && random <= 1) return block[4];
    else if (random >= 2 && random <= 4) return block[3];
    else if (random >= 5 && random <= 5.5) return block[8];
    else if (random >= 6 && random <= 6.2) return block[9];
    else if (random >= 14 && random <= 18 && (y >= 5 || x >= 5)) return block[2];
    else return block[1];
  }
  copyObj(obj) {
    return [...obj];
  }
  checkDiffernt(ob1, ob2) {
    return JSON.stringify(ob1) != JSON.stringify(ob2);
  }
}
module.exports = tetrain;
