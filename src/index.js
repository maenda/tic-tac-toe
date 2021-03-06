// https://stackoverflow.com/questions/36415904/is-there-a-way-to-use-map-on-an-array-in-reverse-order-with-javascript
// https://jrsinclair.com/articles/2016/gentle-introduction-to-javascript-tdd-intro/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.classes}
      onClick={props.onClick}
      >
        {props.value}
      </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winningSquares = this.props.winningSquares;

    let classes = 'square';

    if (winningSquares && winningSquares.includes(i)) {
      classes += ' won';
    }

    return (
      <Square
        classes={classes}
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
      movesAsc: 'Show descending',
      winningSquares: null,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    let winningSquares = this.state.winningSquares;

    if (winningSquares || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    if (calculateWinner(squares)) {
      winningSquares = calculateWinner(squares);
    }

    this.setState({
      history: history.concat([{
        squares: squares,
        gridLocation: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winningSquares: winningSquares,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseMoveList() {
    const directionText = this.state.movesAsc;

    return this.setState({
      movesAsc: directionText === 'Show ascending' ? 'Show descending' : 'Show ascending',
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const currentLocation = current.gridLocation;
    const directionText = this.state.movesAsc;
    const descendingOrder = directionText !== 'Show descending';
    const historyList = !descendingOrder ? history : history.slice(0).reverse();
    const winningSquares = this.state.winningSquares;

    let classes = '';

    const moves = historyList.map((step, move) => {
      const numMoves = historyList.length - 1;
      const moveStepper = descendingOrder ? (numMoves - move) : move;

      classes = (currentLocation === step.gridLocation) ? 'bold' : '';
      const gridLocation =
        (step.gridLocation !== null)
          ? `(${findCurrentSquare(step.gridLocation)})`
          : '';

      const desc = moveStepper
        ? `Go to move #${moveStepper}`
        : 'Go to game start';

      return (
        <li
          className={classes}
          key={moveStepper}
        >
          <button
            onClick={() => this.jumpTo(moveStepper)}
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
            winningSquares={winningSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button
            onClick={() => this.reverseMoveList()}
          >
            {directionText}
          </button>
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
      return lines[i];
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
