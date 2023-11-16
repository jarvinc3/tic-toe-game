import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square";
import { TURNS } from "./components/constantes";
import { checkWinner } from "./logic/board";
import WinnerModal from "./components/WinnerModal";

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [gameOver, setGameOver] = useState(false);


  const resetGame = () => {
    clearInterval(timer);
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    setTimeRemaining(20);
    setGameOver(false);
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  };


  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    clearInterval(timer);
    setTimeRemaining(20);
    startTimer();

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
      setGameOver(true);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
      setGameOver(true);
    }
  };

  const startTimer = () => {
    const newTimer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearInterval(newTimer);
          setTurn((prevTurn) => (prevTurn === TURNS.X ? TURNS.O : TURNS.X));
          setTimeRemaining(20); // Reiniciar el temporizador con el valor inicial
          return 20;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimer(newTimer);
  };


  return (
    <main className="board">
      <h1 className="text-3xl font-bold">
        Tic Tac Toe app
      </h1>
      <button onClick={resetGame} disabled={gameOver}>Resetear el juego</button>
      <section className="game">
        {
          board.map((_, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard} >
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <div className="mt-3 p-2 bg-blue-600 rounded-md text-md font-semibold">
        Tiempo Restante: {timeRemaining} segundos
      </div>
      <section className="turn">
        <Square isSelected={turn == TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn == TURNS.O}>{TURNS.O}</Square>

      </section>

      <WinnerModal resetGame={resetGame} winner={winner} gameOver={gameOver} />
    </main>
  )
}

