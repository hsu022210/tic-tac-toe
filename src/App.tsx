import './App.scss';
import { useEffect, useState } from 'react';

type nextSquares = (string | null)[];
type square = string | null;
type squares = (square)[];
type history = (squares)[];

function Square({ value, onSquareClick }: { value: square, onSquareClick: () => void }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

function calculateWinner(squares: squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean, squares: squares, onPlay: (nextSquares: nextSquares) => void }) {

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  function displayStatus(): string {
    const winner = calculateWinner(squares);
    return winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{displayStatus()}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};

export default function Game() {
  const [history, setHistory] = useState<history>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = (nextSquares: nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_squares, index) => {
    let description;

    if (index > 0) {
      if(currentMove === index) {
        description = 'You are at move #' + index;
      } else {
        description = 'Go to move #' + index;
      }
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  });

  useEffect(() => {
    fetch('https://dummyjson.com/comments')
    .then(res => res.json())
    .then(res => console.log(res));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://dummyjson.com/comments');
      const jsonData = await response.json();
      console.log(jsonData);
    }
    fetchData();
  }, []);

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
