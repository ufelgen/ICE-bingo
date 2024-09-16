import { shuffledTrains } from "../lib/shuffledTrains";
import { Fragment, useState, useRef } from "react";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";
import dynamic from "next/dynamic";
import { toggleSeen, splitUpInChunks } from "../helpers/bingoFunctions";
import SearchBar from "../components/SearchBar";

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
    //console.log(window.scrollY);
  }

  function handleConfettiStop() {
    setCelebration(false);
  }

  const sectionRefs = useRef([]);

  function scrollToSection(index) {
    sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Main>
      <SearchBar
        trainsArrayFor3by3={trainsArrayFor3by3}
        trainsArrayFor4by4={trainsArrayFor4by4}
        scrollToSection={scrollToSection}
      />
      {celebration && (
        <>
          <Confetti
            height={10000}
            width={width}
            confettiSource={{
              x: 0,
              y: window.scrollY,
              w: window.innerWidth,
              h: 0,
            }}
            recycle={false}
            numberOfPieces={7000}
            initialVelocityY={window.innerHeight}
          />
        </>
      )}
      <GridContainer>
        {finalArrayForThreeGrid.map((arrayOf3x3Trains, index) => (
          <ThreeGrid
            key={arrayOf3x3Trains[0][0].name}
            ref={(el) => (sectionRefs.current[index] = el)}
          >
            {arrayOf3x3Trains.map((array) => (
              <Fragment key={array[0].name}>
                {array.map((train) => (
                  <button
                    key={train.id}
                    type="button"
                    className={train.isSeen ? "isSeen" : ""}
                    id={train.id}
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
        {finalArrayForFourGrid.map((arrayOf4x4Trains, index) => (
          <FourGrid
            key={arrayOf4x4Trains[0][0].name}
            ref={(el) =>
              (sectionRefs.current[index + finalArrayForThreeGrid.length] = el)
            }
          >
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
                        4,
                        handleCelebration
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
      </GridContainer>
    </Main>
  );
}

const Main = styled.main`
  position: relative;
  background-color: purple;
  width: 100vw;
`;

const GridContainer = styled.section`
  position: fixed;
  top: 10vh;
  bottom: 2vh;
  overflow-y: scroll;
  width: 100%;
`;

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
  width: 90vw;
  height: 90vw;
  button {
    border: none;
    border-radius: 5px;
    background-color: white;
    color: red;
    width: 25vw;
    height: 25vw;
    hyphens: auto;
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
