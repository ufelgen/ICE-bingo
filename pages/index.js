import { shuffledTrains } from "../lib/shuffledTrains";
import { Fragment, useState, useEffect } from "react";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";
import dynamic from "next/dynamic";

export default function Home() {
  //total 227 trains
  //use 3x3 and 4x4 layouts for bingo
  //divide array into 11x9 = 99 for 3x3
  //and 8x16 = 128 for 4x4
  const trainsArrayFor3by3PRE = shuffledTrains.slice(0, 99);
  const trainsArrayFor4by4PRE = shuffledTrains.slice(99, 227);

  const [celebration, setCelebration] = useState(false);
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
  //end bingo code

  function toggleSeenInThree(id) {
    const currentTrain = trainsArrayFor3by3.find((train) => train.id === id);
    const currentTrainIndex = trainsArrayFor3by3.indexOf(currentTrain);

    // console.log("currentTrainIndex", currentTrainIndex);
    const updatedTrain = { ...currentTrain, isSeen: !currentTrain.isSeen };
    const updatedTrainArray = trainsArrayFor3by3.map((train) => {
      if (train.id === id) {
        return updatedTrain;
      } else {
        return train;
      }
    });

    setTrainsArrayFor3by3(updatedTrainArray);
    checkForBingoIn3x3(currentTrainIndex, updatedTrainArray);
  }

  function toggleSeenInFour(id) {
    const currentTrain = trainsArrayFor4by4.find((train) => train.id === id);
    const updatedTrain = { ...currentTrain, isSeen: !currentTrain.isSeen };
    const updatedTrainArray = trainsArrayFor4by4.map((train) => {
      if (train.id === id) {
        return updatedTrain;
      } else {
        return train;
      }
    });

    setTrainsArrayFor4by4(updatedTrainArray);
  }

  function checkForBingoIn3x3(currentIndex, updatedTrainArray) {
    const position = currentIndex + 1;
    function determineCurrentSetNumber() {
      for (let i = 1; i <= 11; i++) {
        let currentSetInFor = 0;
        if (position <= i * 9) {
          currentSetInFor = i;
          return currentSetInFor;
        }
      }
    }

    const currentSetNumber = determineCurrentSetNumber();
    //console.log("currentSetNumber", currentSetNumber);

    const currentSet = updatedTrainArray.slice(
      9 * currentSetNumber - 9,
      9 * currentSetNumber
    );

    const currentSetArray = splitUpInChunks(currentSet, 3);
    console.log("currentSetArray", currentSetArray);

    function determinePositionInCurrentSet() {
      for (let i = 1; i <= 9; i++) {
        let positionInCurrentSetInFor = 0;
        if (position === currentSetNumber * 9 - 9 + i) {
          positionInCurrentSetInFor = i;
          return positionInCurrentSetInFor;
        }
      }
    }

    const positionInCurrentSet = determinePositionInCurrentSet();

    function determineWhichRow() {
      for (let i = 1; i <= 3; i++) {
        let rowNumber = 0;
        if (positionInCurrentSet <= i * 3) {
          rowNumber = i;
          return rowNumber;
        }
      }
    }
    const rowNumber = determineWhichRow();

    function determineWhichColumn() {
      for (let i = 1; i <= 3; i++) {
        let columnNumber = 0;
        if ((positionInCurrentSet - i) % 3 === 0) {
          columnNumber = i;
          return columnNumber;
        }
      }
    }
    const columnNumber = determineWhichColumn();

    const rows = 3;
    const columns = 3;
    //huhu testi
    // Check rows and columns for a Bingo pattern
    for (let i = 0; i < rows; i++) {
      let rowFilled = true;
      let columnFilled = true;
      for (let j = 0; j < columns; j++) {
        if (currentSetArray[rowNumber - 1][j].isSeen === false) {
          rowFilled = false;
        }
        if (currentSetArray[j][columnNumber - 1].isSeen === false) {
          columnFilled = false;
        }
      }
      if (rowFilled || columnFilled) {
        handleCelebration();
      }
    }

    // Check diagonals for a Bingo pattern
    if (
      rowNumber == columnNumber ||
      rowNumber == columns ||
      columnNumber == rows
    ) {
      for (let i = 0; i < rows; i++) {
        let diagonal1Filled = true;
        let diagonal2Filled = true;
        for (let j = 0; j < columns; j++) {
          if (currentSetArray[j][j].isSeen === false) {
            diagonal1Filled = false;
          }
          if (currentSetArray[j][columns - 1 - j].isSeen === false) {
            diagonal2Filled = false;
          }
        }
        if (diagonal1Filled || diagonal2Filled) {
          handleCelebration();
        }
      }
    }
  }

  const { height, width } = dynamic(() => import("../helpers/useWindowSize"), {
    ssr: false,
  });

  const Confetti = dynamic(() => import("react-confetti"), {
    ssr: false,
  });

  function handleCelebration() {
    setCelebration(true);
    setTimeout(handleConfettiStop, 5000);
  }

  function handleConfettiStop() {
    setCelebration(false);
  }

  return (
    <>
      {celebration && (
        <>
          <Confetti height={height} width={width} />
        </>
      )}
      {finalArrayForThreeGrid.map((arrayOf3x3Trains) => (
        <ThreeGrid key={arrayOf3x3Trains[0][0].name}>
          {arrayOf3x3Trains.map((array) => (
            <Fragment key={array[0].name}>
              {array.map((train) => (
                <button
                  key={train.id}
                  type="button"
                  className={train.isSeen ? "isSeen" : ""}
                  onClick={() => toggleSeenInThree(train.id)}
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
                <button
                  key={train.id}
                  type="button"
                  onClick={() => toggleSeenInFour(train.id)}
                  className={train.isSeen ? "isSeen" : ""}
                >
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
    background-color: white;
    color: red;
    height: 30vw;
    width: 30vw;
    &:hover {
      color: black;
    }

    &.isSeen {
      border: 1px solid white;
      background-color: red;
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
