import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
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
        key={i}
      />
    );
  }

  renderRow(startingSquare) {
    let squares = [];
    const endingSquare = startingSquare + 3;

    for (let i = startingSquare; i < endingSquare; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div className="board-row" key={startingSquare}>
        {squares}
      </div>
    );
  }

  renderRows() {
    let rows = [];
    let startingSquare = 0;

    for (let i = this.props.squares.length; i > 0; i--) {
      if(i % 3 === 0) {
        rows.push(this.renderRow(startingSquare));
      }
      startingSquare++;
    }

    return rows;
  }

  render() {
    const rows = this.renderRows();

    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        gridLocation: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        gridLocation: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const currentLocation = current.gridLocation;
    let classes = '';

    const moves = history.map((step, move) => {
      classes = (currentLocation === step.gridLocation) ? 'bold' : '';
      const gridLocation =
        (step.gridLocation !== null)
          ? `(${findCurrentSquare(step.gridLocation)})`
          : '';

      const desc = move
        ? `Go to move #${move}`
        : 'Go to game start';

        return (
          <li
            className={classes}
            key={move}
          >
            <button
              onClick={() => this.jumpTo(move)}
              className={classes}
            >
              {desc} {gridLocation}
            </button>
          </li>
        )
    });

    let status = winner
      ? `Winner: ${winner}`
      : `Next player: ${this.state.xIsNext ? 'X' : 'O' }`;

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
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
  return null;
}

function findCurrentSquare(gridLocation) {
  const squares = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
  ];

  return squares[gridLocation];
}
