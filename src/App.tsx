import React, { MouseEvent, useState } from "react";
import { QuestionState, fetchQuizQuestions } from "./API";
//Components
import QuestionCard from "./components/QuestionCard";
//Types
import { Difficulty } from "./API";
//Styles
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY)

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      difficulty
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Users answer
      const answer: string = e.currentTarget.value;
      // Check answer against the correct answer
      const correct: boolean = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((previous) => previous + 1);
      //Save answer in the array for users answers
      // answer, is the same as answer: answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // Move on to the next question if not the last question
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  const checkDifficulty = (e: MouseEvent<HTMLButtonElement>) => {
    // Checks the sellected difficulty
    let difficulty: string = e.currentTarget.value;
    if(difficulty === Difficulty.EASY) setDifficulty(Difficulty.EASY);
    if(difficulty === Difficulty.MEDIUM) setDifficulty(Difficulty.MEDIUM);
    if(difficulty === Difficulty.HARD) setDifficulty(Difficulty.HARD);
  }
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Quiz</h1>
        {(gameOver || (userAnswers.length === TOTAL_QUESTIONS)) && difficulty ? (
          <button className="start" onClick={startQuiz}>
            Start Quiz
          </button>
        ) : null}
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading && <p>Loading Questions ...</p>}
        <button onClick={checkDifficulty} value={Difficulty.EASY} className="start">Easy</button>
        <button onClick={checkDifficulty} value={Difficulty.MEDIUM} className="start">Medium</button>
        <button onClick={checkDifficulty} value={Difficulty.HARD} className="start">Hard</button>
        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 && (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  );
};

export default App;
