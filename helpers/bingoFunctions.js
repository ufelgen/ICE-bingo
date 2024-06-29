export function splitUpInChunks(longArray, size) {
  let chunks = [];

  longArray.forEach((item) => {
    if (!chunks.length || chunks[chunks.length - 1].length == size)
      chunks.push([]);

    chunks[chunks.length - 1].push(item);
  });

  return chunks;
}

export function toggleSeen(
  id,
  setterFunction,
  trainsArray,
  gridNumber,
  celebrationFunction
) {
  const currentTrain = trainsArray.find((train) => train.id === id);
  const currentTrainIndex = trainsArray.indexOf(currentTrain);
  const updatedTrain = { ...currentTrain, isSeen: !currentTrain.isSeen };
  const updatedTrainArray = trainsArray.map((train) => {
    if (train.id === id) {
      return updatedTrain;
    } else {
      return train;
    }
  });

  setterFunction(updatedTrainArray);
  /*   if (gridNumber === 3) {
    checkForBingo(
      currentTrainIndex,
      updatedTrainArray,
      celebrationFunction,
      gridNumber
    );
  } else if (gridNumber === 4) {
    //checkForBingoIn4x4();
    console.log("huhu testi");
  } */
  checkForBingo(
    currentTrainIndex,
    updatedTrainArray,
    celebrationFunction,
    gridNumber
  );
}

export function checkForBingo(
  currentIndex,
  updatedTrainArray,
  celebrationFunction,
  gridNumber
) {
  const position = currentIndex + 1;

  function determineCurrentSetNumber() {
    for (let i = 1; i <= 11; i++) {
      let currentSetInFor = 0;
      if (position <= i * gridNumber * gridNumber) {
        currentSetInFor = i;
        return currentSetInFor;
      }
    }
  }

  const currentSetNumber = determineCurrentSetNumber();

  const currentSet = updatedTrainArray.slice(
    gridNumber * gridNumber * currentSetNumber - gridNumber * gridNumber,
    gridNumber * gridNumber * currentSetNumber
  );

  const currentSetArray = splitUpInChunks(currentSet, gridNumber);
  console.log("currentSetArray", currentSetArray);

  function determinePositionInCurrentSet() {
    for (let i = 1; i <= gridNumber * gridNumber; i++) {
      let positionInCurrentSetInFor = 0;
      if (
        position ===
        currentSetNumber * gridNumber * gridNumber - gridNumber * gridNumber + i
      ) {
        positionInCurrentSetInFor = i;
        return positionInCurrentSetInFor;
      }
    }
  }

  const positionInCurrentSet = determinePositionInCurrentSet();

  function determineWhichRow() {
    for (let i = 1; i <= gridNumber; i++) {
      let rowNumber = 0;
      if (positionInCurrentSet <= i * gridNumber) {
        rowNumber = i;
        return rowNumber;
      }
    }
  }
  const rowNumber = determineWhichRow();

  function determineWhichColumn() {
    for (let i = 1; i <= gridNumber; i++) {
      let columnNumber = 0;
      if ((positionInCurrentSet - i) % gridNumber === 0) {
        columnNumber = i;
        return columnNumber;
      }
    }
  }
  const columnNumber = determineWhichColumn();

  const rows = gridNumber;
  const columns = gridNumber;

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
      celebrationFunction();
      console.log("row or column bingo!");
    }
  }

  // Check diagonals for a Bingo pattern
  // dieser Teil müsste unabhängig von der Anzahl an Reihen und Spalten sein,
  // wenn rows und columns angepasst ist.

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
        celebrationFunction();
        console.log("diagonal bingo!");
      }
    }
  }
}
