import React, { useState } from "react";
import type { QuizQuestion } from "../types/quiz";
import type { QuizAnswer } from "../types/father";

interface QuizScreenProps {
  questions: QuizQuestion[];
  onComplete: (answers: QuizAnswer[]) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [textInput, setTextInput] = useState("");

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleChoiceAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionIndex: currentQuestionIndex,
      answerIndex: optionIndex,
    };
    setAnswers(newAnswers);
    moveToNext();
  };

  const handleTextAnswer = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionIndex: currentQuestionIndex,
      text: textInput,
    };
    setAnswers(newAnswers);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextInput("");
    } else {
      onComplete(answers);
    }
  };

  return (
    <div className="screen quiz-screen">
      <div className="quiz-container screen-card">
        <div className="quiz-progress">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="quiz-content">
          <div className="screen-heading">
            <p className="quiz-question-number eyebrow">
              質問 {currentQuestionIndex + 1} / {questions.length}
            </p>
            <h2 className="quiz-question">{currentQuestion.text}</h2>
          </div>

          {currentQuestion.type === "choice" && currentQuestion.options && (
            <div className="quiz-options">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  className="quiz-option"
                  onClick={() => handleChoiceAnswer(idx)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === "text" && (
            <div className="quiz-text-input">
              <input
                type="text"
                className="text-input"
                placeholder="ひとことで..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && textInput.trim()) {
                    handleTextAnswer();
                  }
                }}
              />
              <div className="screen-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleTextAnswer}
                  disabled={!textInput.trim()}
                >
                  次へ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
