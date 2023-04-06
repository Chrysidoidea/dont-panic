import logo from './logo.svg';
import styled from 'styled-components';
import {useState, useEffect} from 'react';

const AtomSize = 50;
const WorldHeight = 600;
const WorldWidth = 800;
const interceptionWidth = 40;
const jumpPower = 150;
const interceptionGap = 200;


const App = () => {
    const [victory, setVictory] = useState('none');
    const [welcomeDisplay, setWelcomeDisplay] = useState('flex');
    const [gameOverDisplay, setGameOverDisplay] = useState('none');
    const [attempts, setAttempts] = useState(0);
    const [gravitation, setGravitation] = useState(13);
    const [interceptionSpeed, setInterceptionSpeed] = useState(15);
    const [atomPosition, setAtomPosition] = useState(WorldHeight / 2 - AtomSize);
    const [gameStarted, setGameStarted] = useState(false);
    const [interceptionLeft, setInterceptionLeft] = useState(WorldWidth - interceptionWidth);
    const [interceptionHeight, setInterceptionHeight] = useState(150);
    const [score, setScore] = useState(0);

    const clickHandler = () => {
        if (!gameStarted) {
            setGameStarted(true);
            setGameOverDisplay('none');
            setScore(0)
            setVictory('none');
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

    const updateAtomPosition = () => {
        if (atomPosition < WorldHeight - AtomSize) {
            setAtomPosition((atomPosition) => atomPosition + gravitation);
        }
    };
    const updateInterceptionLeft = () => {
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
    const checkGameOver = () => {
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
            setGameOverDisplay('flex');

        }
    };
    const checkVictory = () => {
        if (score === 42) {
            setVictory('flex');
            setGameStarted(false);
        }
    }

    const welcomeClickHandler = () => {
        setWelcomeDisplay('none');
        setVictory('none');
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
                        <Atom logo={logo} size={AtomSize} className='atom' position={atomPosition}/>
                    </GameWorld>

                </Wrapper>
            <WelcomeDisplay
                display={welcomeDisplay}
                onClick={welcomeClickHandler}
            >
                <h1>Welcome! 😄</h1>
                <span>🎯Your goal is to get 42 points 🎯</span>
                <span>Use your intuition</span>
                <span>👩‍💻 to understand the rules 👩‍💻</span>
                <span>Press any key to continue</span>
                <span>and</span>
                <span>🍀 Good luck! 🍀</span>
            </WelcomeDisplay>
            <GameOver
                display={gameOverDisplay}
                onClick={clickHandler}
            >
                <h1>Game Over</h1>
                <span>click on screen to continue...</span>
            </GameOver>
            <VictoryDisplay
                display={victory}
                onClick={clickHandler}
            >
                <h1>Congratulations, you are won.</h1>
                <span>Now you should know the answer of life universe and everything</span>
                <p>In a humorous twist, the supercomputer Deep Thought reveals the answer to the ultimate question of life, the universe, and everything as 42, leaving everyone baffled because they never actually understood the question itself. Lesson learned: it's hard to appreciate an answer when you don't know what you're asking.</p>
            </VictoryDisplay>
        </Container>
    );
}

export default App;

const Atom = styled.div.attrs(
    ({size, position}) => ({
        style: {
            height: size + "px",
            width: size + "px",
            top: position + "px",
        }
    })
)`
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

const GameWorld = styled.div.attrs(
    ({width, height}) => ({
        style: {
            width: width + 'px',
            height: height + 'px',
        }
    })
)`
  justify-content: center;
  background-color: #0a303a;
  overflow: hidden;
  border-radius: .3rem;
  border: 10px solid rgba(242, 239, 234, 0.02);
  box-shadow: 10px 10px 10px #403D58;

`;

const Interception = styled.div.attrs(
    ({left, top, width, height}) => ({
        style: {
            left: left + 'px',
            top: top + 'px',
            width: width + 'px',
            height: height + 'px',
        }
    })
)`
  background-color: #FFB562;
  filter: blur(1px);
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
  font-family: 'Chango', cursive;
  font-size: 5rem;
  text-align: center;
  color: #FFB562;
  position: absolute;
  top: 2rem;
`;

const GameOver = styled.div.attrs(
    ({display}) => ({
        style: {
            display: display,
        }
    })
)`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(5px);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-family: 'Chango', cursive;
  font-size: 35px;
  background-color: rgba(9, 28, 40, 0.82);
  transition: 1s;
  user-select: none;

  & h1 {
    color: #F87474;
  }

  & span {
    color: #FFB562;
  }
`;

const WelcomeDisplay = styled.div.attrs(
    ({display}) => ({
        style: {
            display: display,
        }
    })
)`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  backdrop-filter: blur(5px);
  background-color: rgba(249, 242, 237, 0.7);
  z-index: 10000000000;
  font-family: 'Chango', cursive;
  user-select: none;


  & h1 {
    color: rgba(60, 44, 62, 0.68);
    font-size: 75px;
  }

  & span {
    color: #3C2C3EAD;
    font-size: 30px;
    align-self: center;
    padding: 10px 40px 0;
    margin: 0 25px;

  }
`;

const VictoryDisplay = styled.div.attrs(
          ({display}) => ({
              style: {
                  display: display,
              }
          })
)`
  background-color: rgba(0, 0, 0, 0.58);
  position: absolute;
  width: 100vw;
  height: 100vh;
  color: rgba(225, 149, 97, 0.97);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  backdrop-filter: blur(10px);
  font-family: 'Chango', cursive;
  user-select: none;
  
  & > p {
    width: 80vw;
  }
`;