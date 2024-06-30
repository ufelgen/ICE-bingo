import styled from "styled-components";

export default function SearchBar() {
  function searchTrain() {
    //repurpose find train
  }
  return (
    <StyledSearchBar onSubmit={searchTrain}>
      <input></input>
      <button type="submit">suchen</button>
    </StyledSearchBar>
  );
}

const StyledSearchBar = styled.form`
  display: grid;
  grid-template-columns: 4fr 1fr;
  height: 10 vh;
  background-color: red;
  margin: 2vw;
  padding: 0.5rem;
  margin: 0.5rem;
  border: 1px solid red;
  border-radius: 5px;
  gap: 0.5rem;
  width: 100%;

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
