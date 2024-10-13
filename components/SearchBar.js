import styled from "styled-components";

export default function SearchBar({
  trainsArrayFor3by3,
  trainsArrayFor4by4,
  scrollToSection,
  notFound,
  setNotFound,
}) {
  function searchTrain(event) {
    event.preventDefault();
    const searchedTrain =
      event.target.elements.searchedTrain.value.toLowerCase();
    let currentTrain = {};
    let currentTrainIndex = 0;

    const currentTrainIn3 = trainsArrayFor3by3.find((train) =>
      train.name.toLowerCase().includes(searchedTrain)
    );
    const currentTrainIn4 = trainsArrayFor4by4.find((train) =>
      train.name.toLowerCase().includes(searchedTrain)
    );

    if (currentTrainIn3) {
      currentTrain = currentTrainIn3;
      currentTrainIndex = trainsArrayFor3by3.indexOf(currentTrain);
      console.log("currentTrainIndex", currentTrainIndex);
      //check which grid the currentTrain belongs to
      const arrayIndex = Math.floor(currentTrainIndex / 9);
      console.log("arrayIndex", arrayIndex);
      scrollToSection(arrayIndex);
    } else if (currentTrainIn4) {
      currentTrain = currentTrainIn4;
      currentTrainIndex = trainsArrayFor4by4.indexOf(currentTrain);
      console.log("currentTrainIndex", currentTrainIndex);
      //check which grid the currentTrain belongs to
      //add the value 10 for 11 3x3 grids (indices 0-10)
      const arrayIndex = Math.ceil(currentTrainIndex / 16) + 10;
      console.log("arrayIndex", arrayIndex);
      scrollToSection(arrayIndex);
    } else if (!currentTrainIn3 && !currentTrainIn4) {
      setNotFound(true);
      setTimeout(handleStop, 3000);
      console.log("not found");
    } else {
      return;
    }
    event.target.reset();
  }

  function handleStop() {
    setNotFound(false);
  }

  return notFound ? (
    <>
      <NotFoundBox>Zugname nicht gefunden</NotFoundBox>
    </>
  ) : (
    <StyledSearchBar onSubmit={() => searchTrain(event)}>
      <input name="searchedTrain"></input>
      <button type="submit">suchen</button>
    </StyledSearchBar>
  );
}

const StyledSearchBar = styled.form`
  position: fixed;
  top: 0;
  display: grid;
  grid-template-columns: 4fr 1fr;
  height: 7vh;
  width: 90%;
  background-color: red;
  margin: 0.5rem 2vw 0.5rem 2vw;
  padding: 0.5rem;
  border: 1px solid red;
  border-radius: 5px;
  gap: 0.5rem;

  input {
    border-radius: 5px;
  }

  button {
    color: red;
    background-color: lightgrey;
    border: 1px solid black;
    border-radius: 5px;
  }
`;

const NotFoundBox = styled.p`
  margin: 0.5rem 2vw 0.5rem 2vw;
  padding: 0.5rem;
  color: red;
  background-color: lightgrey;
  border: 1px solid black;
  border-radius: 5px;
`;
