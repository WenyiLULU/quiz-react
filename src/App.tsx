import React, {useState} from 'react';
import { fetchQuizQuestions } from './API';
//Components
import QuestionCard from './components/QestionCard';
//Types
import { QuestionState, Difficulty } from './API'
//Styles
import { Wrapper, GlobalStyle } from './App.style';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUseranswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const TOTAL_QUESTIONS = 10;

  //console.log("questions", questions)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQustions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY)

    setQuestions(newQustions)
    setScore(0);
    setUseranswers([])
    setNumber(0)
    setLoading(false)
  }

  const checkAnser = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      const answer = e.currentTarget.value
      const correct = questions[number].correct_answer === answer
      if(correct) setScore(prev => prev + 1)
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      setUseranswers((prev)=>[...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    const nextOne = number + 1;
    if(nextOne === TOTAL_QUESTIONS){
      setGameOver(true)
    }else{
      setNumber(nextOne)
    }
  }

  return (
    <>
    <GlobalStyle/>
    <Wrapper>
      <h1>Here's Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? 
        (<button className='start' onClick={startTrivia}>Start</button>)
        : null
      }
      {!gameOver ? <p className='score'>Score: {score}</p> : null}
      {loading && <p>Loading Questions...</p>}

      {
        !gameOver && 
        !loading && 
        (<QuestionCard 
        questionNr = {number + 1}
        totalQuestions = {TOTAL_QUESTIONS}
        question = {questions[number].question}
        answers = {questions[number].answers}
        userAnswer = {userAnswers ? userAnswers[number] : undefined}
        callback = {checkAnser}
      />)
      }
      {
        !gameOver && 
        !loading && 
        userAnswers.length === number+1 && 
        number !== TOTAL_QUESTIONS-1 ? 
        <button className='next' onClick={nextQuestion}>Next Question</button>
        :null
      }
    </Wrapper>
    </>
    
  );
}

export default App;
