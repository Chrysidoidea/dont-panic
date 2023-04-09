import logo from "./logo.svg";
import styled from "styled-components";
import {useState, useEffect, HTMLAttributes} from "react";

import GameOver from "./components/GameOver.component";
import Welcome from "./components/Welcome.component";
import Victory from "./components/Victory.component";

const AtomSize: number = 50;
const WorldHeight: number = 600;
const WorldWidth: number = 800;
const interceptionWidth: number = 40;
const jumpPower: number = 150;
const interceptionGap: number = 200;


const App = () => {
    const [victory, setVictory] = useState("none");
    const [welcomeDisplay, setWelcomeDisplay] = useState("flex");
    const [gameOverDisplay, setGameOverDisplay] = useState("none");
    const [attempts, setAttempts] = useState(0);
    const [gravitation, setGravitation] = useState(13);
    const [interceptionSpeed, setInterceptionSpeed] = useState(15);
    const [atomPosition, setAtomPosition] = useState(WorldHeight / 2 - AtomSize);
    const [gameStarted, setGameStarted] = useState(false);
    const [interceptionLeft, setInterceptionLeft] = useState(WorldWidth - interceptionWidth);
    const [interceptionHeight, setInterceptionHeight] = useState(150);
    const [score, setScore] = useState(0);

    const clickHandler = (): void => {
        if (!gameStarted) {
            setGameStarted(true);
            setGameOverDisplay("none");
            setScore(0)
            setVictory("none");
        }
        if (atomPosition < jumpPower) {
            setAtomPosition(0);
        } else {
            setAtomPosition((atomPosition) => atomPosition - jumpPower);
        }
    }

    const bottomInterceptionHeight = WorldHeight - interceptionGap - interceptionHeight;

    useEffect(() => {
        if (!gameStarted) return;

        const gameLoop = setInterval(() => {
            updateAtomPosition();
            updateInterceptionLeft();
            checkGameOver();
            checkVictory();
        }, 24);

        return () => {
            clearInterval(gameLoop);
        }

    }, [gameStarted, atomPosition, interceptionLeft, score])

    const updateAtomPosition = (): void => {
        if (atomPosition < WorldHeight - AtomSize) {
            setAtomPosition((atomPosition) => atomPosition + gravitation);
        }
    };
    const updateInterceptionLeft = (): void => {
        if (interceptionLeft >= -interceptionWidth) {
            setInterceptionLeft((interceptionLeft) => interceptionLeft - interceptionSpeed);
        } else {
            if (gameStarted) {
                setInterceptionLeft(WorldWidth - interceptionWidth);
                setInterceptionHeight(Math.floor(Math.random() * (WorldHeight - interceptionGap)));
                setScore((score) => score + 1);

                switch (score) {
                    case 6:
                        setInterceptionSpeed(17);
                        break;
                    case 10:
                        setInterceptionSpeed(25);
                        break;
                    case 13:
                        setGravitation(17);
                        setInterceptionSpeed(30);
                        break;
                    case 20:
                        setInterceptionSpeed(35);
                }
            }
        }
    }
    const checkGameOver = (): void => {
        const crashIntoTopInterception =
            atomPosition >= 0 && atomPosition < interceptionHeight;
        const crashIntoBottomInterception =
            atomPosition <= 500 && atomPosition >= 500 - bottomInterceptionHeight + AtomSize * 2;
        const crash =
            atomPosition >= 540

        if (
            interceptionLeft >= 0 &&
            interceptionLeft <= interceptionWidth &&
            (crashIntoTopInterception || crashIntoBottomInterception || crash)
        ) {
            setGameStarted(false);
            setAtomPosition(WorldHeight / 2 - AtomSize);
            setInterceptionLeft(WorldWidth - interceptionWidth);
            setInterceptionHeight(150);
            setInterceptionSpeed(15);
            setGravitation(13);
            setAttempts((attempts) => attempts + 1);
            setScore(0);
            setGameOverDisplay("flex");

        }
    };
    const checkVictory = (): void => {
        if (score === 42) {
            setVictory("flex");
            setGameStarted(false);
        }
    }

    const welcomeClickHandler = (): void => {
        setWelcomeDisplay("none");
        setVictory("none");
    }

    return (
        <Container>
            <Header>don't panic</Header>
            <ClockFace>
                <span>score: <span>{score}</span></span>
                <span>attempts: <span>{attempts}</span></span>
            </ClockFace>
            <Wrapper onClick={clickHandler}>

                <GameWorld width={WorldWidth} height={WorldHeight}>
                    <Interception
                        top={0}
                        width={interceptionWidth}
                        height={interceptionHeight}
                        left={interceptionLeft}
                    />
                    <Interception
                        top={WorldHeight - (interceptionHeight + bottomInterceptionHeight)}
                        width={interceptionWidth}
                        height={bottomInterceptionHeight}
                        left={interceptionLeft}
                    />
                    <Atom logo={logo} size={AtomSize} className="atom" position={atomPosition}/>
                </GameWorld>

            </Wrapper>
            <Welcome
                display={welcomeDisplay}
                onClick={welcomeClickHandler}
            />
            <GameOver
                display={gameOverDisplay}
                onClick={clickHandler}
            />
            <Victory
                display={victory}
                onClick={clickHandler}
            />
        </Container>
    );
}

export default App;

interface AtomProps extends HTMLAttributes<HTMLDivElement>{
    size: number;
    position: number;
    logo: string
}

const Atom = styled.div.attrs<AtomProps>(
    ({size, position}) => ({
        style: {
            height: size + "px",
            width: size + "px",
            top: position + "px",
        }
    })
)<AtomProps>`
  position: absolute;
  background-image: url(${(props) => props.logo});
  background-size: cover;
  background-position: center;
  background-color: transparent;
  animation: atom-spin infinite .1s linear;

  @keyframes atom-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(120deg);
    }
  }
`;
const Wrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  width: 100%;
`;

interface GameWorldProps {
    width: number;
    height: number;
}

const GameWorld = styled.div.attrs<GameWorldProps>(
    ({width, height}) => ({
        style: {
            width: width + "px",
            height: height + "px",
        }
    })
)<GameWorldProps>`
  justify-content: center;
  background-color: #0a303a;
  overflow: hidden;
  border-radius: .3rem;
  border: 10px solid rgba(242, 239, 234, 0.02);
  box-shadow: 10px 10px 10px #403D58;

`;

interface InterceptionProps {
    left: number;
    top: number;
    width: number;
    height: number;
}

const Interception = styled.div.attrs<InterceptionProps>(
    ({left, top, width, height}) => ({
        style: {
            left: left + "px",
            top: top + "px",
            width: width + "px",
            height: height + "px",
        }
    })
)<InterceptionProps>`
  background-color: #FFB562;
  filter: blur(1px);
  border-radius: 10px;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #F87474;
  position: relative;

`;

const ClockFace = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  justify-content: space-around;
  bottom: 0;
  width: 50rem;
  height: 5rem;
  filter: blur(.4px);
  border-radius: 20px 20px 0 0;
  background-color: rgba(64, 61, 88, 0.3);
  z-index: 100000;
  box-shadow: 10px 5px 20px 1px rgba(12, 11, 16, 0.7);
  user-select: none;


  & span {
    filter: none;
    font-weight: bold;
    color: #DBD56E;
    font-size: 2rem;
    position: relative;

    & > span {
      font-size: 3rem;
      padding-left: 1.5rem;
      color: #F9F2ED;
    }
  }

`;

const Header = styled.div`
  user-select: none;
  text-transform: uppercase;
  font-family: "Chango", cursive;
  font-size: 5rem;
  text-align: center;
  color: #FFB562;
  position: absolute;
  top: 2rem;
`;
export interface DisplayProps {
    display: string;
    onClick?: () => void;
}

