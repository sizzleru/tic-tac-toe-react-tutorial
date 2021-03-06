import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      style={{ backgroundColor: props.winningSquare ? "blue" : null }}
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquare={isWinningSquare(this.props.squares, i)}
      />
    );
  }

  renderBoard(i) {
    return (
      <div className="board-row">
        {[...Array(i).keys()].map((row) => this.renderSquare(row))}
      </div>
    );
  }

  render() {
    const rowLength = 3;
    const colLength = 3;
    return (
      <div>
        <div className="status"></div>
        {[...Array(rowLength).keys()].map((row) => (
          <div className="board-row">
            {[...Array(colLength).keys()].map((col) =>
              this.renderSquare(row * rowLength + col)
            )}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), change: null }],
      stepNumber: 0,
      xIsNext: true,
      sortAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, change: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  toggleSort() {
    this.setState({ sortAsc: !this.state.sortAsc });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = (
      this.state.sortAsc ? history : history.slice().reverse()
    ).map((step, move) => {
      move = this.state.sortAsc ? move : history.length - move - 1;
      const desc = move
        ? "Go to move#" + move + ", " + mapToColAndRow(step.change)
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={{
              fontWeight: isCurrentMove(move, this.state.stepNumber),
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = winner === "draw" ? "Result: draw" : "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>
            sort {this.state.sortAsc ? "Descending" : "Ascending"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return squares.indexOf(null) == -1 ? "draw" : null;
}

function mapToColAndRow(index) {
  return "(" + ((index % 3) + 1) + ", " + (Math.floor(index / 3) + 1) + ")";
}

function isCurrentMove(move, stepNumber) {
  return move === stepNumber ? "bold" : "normal";
}

function isWinningSquare(squares, square) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      [a, b, c].indexOf(square) != -1
    ) {
      return true;
    }
  }
  return false;
}
