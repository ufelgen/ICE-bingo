import { shuffledTrains } from "../lib/shuffledTrains";
import { Fragment, useState, useEffect } from "react";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";
import dynamic from "next/dynamic";
import { toggleSeen, splitUpInChunks } from "../helpers/bingoFunctions";

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

  const arrayOfArraysForThreeGrid = splitUpInChunks(trainsArrayFor3by3, 3);
  const finalArrayForThreeGrid = splitUpInChunks(arrayOfArraysForThreeGrid, 3);
  const arrayOfArraysForFourGrid = splitUpInChunks(trainsArrayFor4by4, 4);
  const finalArrayForFourGrid = splitUpInChunks(arrayOfArraysForFourGrid, 4);

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
                  onClick={() =>
                    toggleSeen(
                      train.id,
                      setTrainsArrayFor3by3,
                      trainsArrayFor3by3,
                      3,
                      handleCelebration
                    )
                  }
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
                  onClick={() =>
                    toggleSeen(
                      train.id,
                      setTrainsArrayFor4by4,
                      trainsArrayFor4by4,
                      4
                    )
                  }
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
