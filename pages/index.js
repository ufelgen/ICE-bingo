import { shuffledTrains } from "../lib/shuffledTrains";
import { Fragment } from "react";
import styled from "styled-components";

export default function Home() {
  //total 227 trains
  //use 3x3 and 4x4 layouts for bingo
  //divide array into 11x9 = 99 for 3x3
  //and 8x16 = 128 for 4x4
  const trainsArrayFor3by3 = shuffledTrains.slice(0, 99);
  const trainsArrayFor4by4 = shuffledTrains.slice(99, 227);

  function splitUpInChunks(longArray, size) {
    let chunks = [];

    longArray.forEach((item) => {
      if (!chunks.length || chunks[chunks.length - 1].length == size)
        chunks.push([]);

      chunks[chunks.length - 1].push(item);
    });

    return chunks;
  }

  const arrayOfArraysForThreeGrid = splitUpInChunks(trainsArrayFor3by3, 9);
  const arrayOfArraysForFourGrid = splitUpInChunks(trainsArrayFor4by4, 16);

  return (
    <>
      {arrayOfArraysForThreeGrid.map((arrayOfNineTrains) => (
        <ThreeGrid key={arrayOfNineTrains[0].id}>
          {arrayOfNineTrains.map((train) => (
            <button key="train.id" type="button">
              {train.name}
            </button>
          ))}
        </ThreeGrid>
      ))}
      {arrayOfArraysForFourGrid.map((arrayOfSixteenTrains) => (
        <FourGrid key={arrayOfSixteenTrains[0].id}>
          {arrayOfSixteenTrains.map((train) => (
            <button key="train.id" type="button">
              {train.name}
            </button>
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

  button {
    border: none;
    border-radius: 5px;
    background-color: red;
    color: white;
    height: 30vw;
    width: 30vw;
  }
`;

const FourGrid = styled(ThreeGrid)`
  grid-template: repeat(4, 1fr) / repeat(4, 1fr);

  button {
    height: 25vw;
    width: 25vw;
  }
`;
