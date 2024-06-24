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
  if (gridNumber === 3) {
    checkForBingoIn3x3(
      currentTrainIndex,
      updatedTrainArray,
      celebrationFunction
    );
  } else if (gridNumber === 4) {
    //checkForBingoIn4x4();
    console.log("huhu testi");
  }
}

export function checkForBingoIn3x3(
  currentIndex,
  updatedTrainArray,
  celebrationFunction
) {
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

  //anpassen für 4er Grid
  const currentSet = updatedTrainArray.slice(
    9 * currentSetNumber - 9,
    9 * currentSetNumber
  );

  //anpassen für 4er Grid
  const currentSetArray = splitUpInChunks(currentSet, 3);
  console.log("currentSetArray", currentSetArray);

  //anpassen für 4er Grid
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

  //anpassen für 4er Grid
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

  //anpassen für 4er Grid
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

  //anpassen für 4er Grid
  const rows = 3;
  const columns = 3;

  // Check rows and columns for a Bingo pattern
  // dieser Teil ist unabhängig von der Anzahl an Reihen und Spalten, wenn rows
  // und columns angepasst ist.
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
      }
    }
  }
}
