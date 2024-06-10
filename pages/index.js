import { shuffledTrains } from "../lib/shuffledTrains";
import { Fragment } from "react";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";
import { nanoid } from "nanoid";

export default function Home() {
  //total 227 trains
  //use 3x3 and 4x4 layouts for bingo
  //divide array into 11x9 = 99 for 3x3
  //and 8x16 = 128 for 4x4
  const trainsArrayFor3by3PRE = shuffledTrains.slice(0, 99);
  const trainsArrayFor4by4PRE = shuffledTrains.slice(99, 227);

  const [trainsArrayFor3by3, setTrainsArrayFor3by3] = useLocalStorageState(
    "trainsArrayFor3by3",
    { defaultValue: trainsArrayFor3by3PRE }
  );

  const [trainsArrayFor4by4, setTrainsArrayFor4by4] = useLocalStorageState(
    "trainsArrayFor4by4",
    { defaultValue: trainsArrayFor4by4PRE }
  );

  function splitUpInChunks(longArray, size) {
    let chunks = [];

    longArray.forEach((item) => {
      if (!chunks.length || chunks[chunks.length - 1].length == size)
        chunks.push([]);

      chunks[chunks.length - 1].push(item);
    });

    return chunks;
  }

  const arrayOfArraysForThreeGrid = splitUpInChunks(trainsArrayFor3by3, 3);
  const finalArrayForThreeGrid = splitUpInChunks(arrayOfArraysForThreeGrid, 3);
  const arrayOfArraysForFourGrid = splitUpInChunks(trainsArrayFor4by4, 4);
  const finalArrayForFourGrid = splitUpInChunks(arrayOfArraysForFourGrid, 4);

  //bingo code
  const ROWS = 5;
  const COLS = 5;
  const MAX_NUM = 25;

  //let currentPlayer = 1;
  //let player1Card, player2Card;

  /*   function createBingoCard() {
    const card = [];
    const usedNumbers = new Set();

    while (usedNumbers.size < ROWS * COLS) {
      const num = Math.floor(Math.random() * MAX_NUM) + 1;
      if (!usedNumbers.has(num)) {
        usedNumbers.add(num);
      }
    }

    const numbersArray = Array.from(usedNumbers);
    for (let i = 0; i < ROWS; i++) {
      card.push(numbersArray.slice(i * COLS, (i + 1) * COLS));
    }

    return card;
  }

  const card = createBingoCard();
  console.log("card", card);

  function displayBingoCard(card, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cell = document.createElement("div");
        cell.textContent = card[i][j];
        if (card[i][j] === "X") {
          cell.classList.add("marked");
        }
        container.appendChild(cell);
      }
    }
  } */

  /*   function markNumber(card, number) {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (card[i][j] === number) {
          card[i][j] = "X";
          return true;
        }
      }
    }
    return false;
  } */

  function checkWin(card) {
    // Check rows and columns for a Bingo pattern
    for (let i = 0; i < ROWS; i++) {
      let rowFilled = true;
      let colFilled = true;
      for (let j = 0; j < COLS; j++) {
        if (card[i][j] !== "X") {
          rowFilled = false;
        }
        if (card[j][i] !== "X") {
          colFilled = false;
        }
      }
      if (rowFilled || colFilled) {
        return true;
      }
    }

    // Check diagonals for a Bingo pattern
    let diagonal1Filled = true;
    let diagonal2Filled = true;
    for (let i = 0; i < ROWS; i++) {
      if (card[i][i] !== "X") {
        diagonal1Filled = false;
      }
      if (card[i][COLS - 1 - i] !== "X") {
        diagonal2Filled = false;
      }
    }
    if (diagonal1Filled || diagonal2Filled) {
      return true;
    }

    return false;
  }

  function toggleSeenInThree(id) {
    /*     const currentTrain = finalArrayForThreeGrid.find(
      (train) => train.id === id
    ); */

    //const updatedTrain = {...currentTrain, isSeen: !currentTrain.isSeen}
    const updatedTrainArray = trainsArrayFor3by3.map(
      (train) => train.id === id && { ...train, isSeen: !train.isSeen }
    );

    setTrainsArrayFor3by3(updatedTrainArray);
  }

  return (
    <>
      {finalArrayForThreeGrid.map((arrayOf3x3Trains) => (
        <ThreeGrid key={arrayOf3x3Trains[0][0].name}>
          {arrayOf3x3Trains.map((array) => (
            <Fragment key={array[0].name}>
              {array.map((train) => (
                <button
                  key={train.id}
                  type="button"
                  className={train.isSeen ? "isSeen" : ""}
                  onClick={toggleSeenInThree(train.id)}
                >
                  {train.name}
                </button>
              ))}
            </Fragment>
          ))}
        </ThreeGrid>
      ))}

      {finalArrayForFourGrid.map((arrayOf4x4Trains) => (
        <FourGrid key={arrayOf4x4Trains[0][0].name}>
          {arrayOf4x4Trains.map((array) => (
            <Fragment key={array[0].name}>
              {array.map((train) => (
                <button key={train.id} type="button">
                  {train.name}
                </button>
              ))}
            </Fragment>
          ))}
        </FourGrid>
      ))}
    </>
  );
}

const ThreeGrid = styled.section`
  display: grid;
  gap: 0.5rem;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  place-items: center;
  padding: 0.5rem;
  margin: 0.5rem;
  border: 1px solid red;
  border-radius: 5px;
  background-color: lightgrey;
  width: 100%;

  button {
    border: none;
    border-radius: 5px;
    background-color: red;
    color: white;
    height: 30vw;
    width: 30vw;
    &:hover {
      color: black;
    }

    &.isSeen {
      border: 1px solid darkmagenta;
      background-color: darkmagenta;
      color: white;
    }
  }
`;

const FourGrid = styled(ThreeGrid)`
  grid-template: repeat(4, 1fr) / repeat(4, 1fr);

  button {
    height: 22vw;
    width: 22vw;
  }
`;
