class Connect4 {
  constructor(rows, cols) {
    const discs = [];
    for (let i = 0; i < rows; i++) {
      discs.push([]);
      for (let j = 0; j < cols; j++) {
        discs[i].push(null);
      }
    }
    this.discs = discs;
    this.rows = rows;
    this.cols = cols;
    this.players = [1, 2];
    this.currPlayer = 0;
    this.isEnd = false;
    this.winner = null;
    this.connection = null;
    this.steps = [];
  }

  getDiscs() {
    return this.discs;
  }

  getPlayers() {
    return this.players;
  }

  getCurrPlayer() {
    return this.players[this.currPlayer];
  }

  isGameEnd() {
    return this.isEnd;
  }

  getWinner() {
    return this.winner;
  }

  getConnection() {
    return this.connection;
  }

  switchPlayer() {
    this.currPlayer = Math.abs(this.currPlayer - 1);
  }

  goBack(steps) {
    if (steps <= this.steps.length) {
      const removedSteps = this.steps.splice(-steps, steps);
      removedSteps.forEach(step => (this.discs[step[0]][step[1]] = null));
      this.switchPlayer();
    }
  }

  checkConnection(curRow, curCol, direction) {
    const [dirV, dirH] = direction;
    let [x, y] = [curRow, curCol];
    let current = this.discs[x][y].player;
    let count = 0;
    let head;

    while (this.discs[x] && this.discs[x][y] && this.discs[x][y].player === current) {
      head = [x, y];
      count++;
      x -= dirV;
      y -= dirH;
    }

    [x, y] = [curRow + dirV, curCol + dirH];
    while (this.discs[x] && this.discs[x][y] && this.discs[x][y].player === current) {
      count++;
      x += dirV;
      y += dirH;
    }

    if (count >= 4) {
      console.log({ head, direction });
      return { head, direction };
    }
  }

  setConnection(connection) {
    this.connection = connection;
    connection.forEach(item => this.discs[item[0]][item[1]].connected = true);
  }

  checkGameState(rowIndex, colIndex) {
    const directions = [[1, 0], [0, 1], [1, 1], [-1, 1]];

    for (const direction of directions) {
      const result = this.checkConnection(rowIndex, colIndex, direction);
      if (result) {
        const { head, direction } = result;
        let connection = [];
        for (let i = 0; i < 4; i++) {
          connection.push([
            head[0] + direction[0] * i,
            head[1] + direction[1] * i
          ]);
        }
        this.setConnection(connection);
        return;
      }
    }
  }

  placeDisc(colIndex) {
    for (let i = this.discs.length - 1; i >= 0; i--) {
      if (!this.discs[i][colIndex]) {
        this.discs[i][colIndex] = {
          player: this.players[this.currPlayer],
          connected: false
        };
        this.steps.push([i, colIndex]);
        this.checkGameState(i, colIndex);
        if (this.connection) {
          this.winner = this.players[this.currPlayer];
          this.isEnd = true;
          return;
        }

        if (this.steps.length === this.rows * this.cols) {
          this.isEnd = true;
          return;
        }

        this.switchPlayer();
        return;
      }
    }
  }
}

export default Connect4;
