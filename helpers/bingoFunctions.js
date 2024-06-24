export function toggleSeen(id, setterFunction, trainsArray, gridNumber) {
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
    //checkForBingoIn3x3(currentTrainIndex, updatedTrainArray);
  }
}
