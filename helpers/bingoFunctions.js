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
  checkForBingo(
    currentTrainIndex,
    updatedTrainArray,
    celebrationFunction,
    gridNumber
  );
}

export function determineCurrentSetNumber(gridNumber, position) {
  // i is 11 because there are 11 3-grids and 8 4-grids
  for (let i = 1; i <= 11; i++) {
    let currentSetInFor = 0;
    if (position <= i * gridNumber ** 2) {
      currentSetInFor = i;
      return currentSetInFor;
    }
  }
}

export function checkForBingo(
  currentIndex,
  updatedTrainArray,
  celebrationFunction,
  gridNumber
) {
  const position = currentIndex + 1;

  const currentSetNumber = determineCurrentSetNumber(gridNumber, position);

  const currentSet = updatedTrainArray.slice(
    gridNumber ** 2 * currentSetNumber - gridNumber ** 2,
    gridNumber ** 2 * currentSetNumber
  );

  const currentSetArray = splitUpInChunks(currentSet, gridNumber);

  function determinePositionInCurrentSet() {
    for (let i = 1; i <= gridNumber ** 2; i++) {
      let positionInCurrentSetInFor = 0;
      if (
        position ===
        currentSetNumber * gridNumber ** 2 - gridNumber ** 2 + i
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
