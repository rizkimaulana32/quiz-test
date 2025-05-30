import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getQuiz } from "@/services/quizService";
import type { quizData } from "@/types/quiz";
import { decode } from "html-entities";
import { Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { shuffleOptions, formatTime } from "@/utils/quizUtils";

export const QuizPage = () => {
  const [quizData, setQuizData] = useState<quizData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300);

  const currentQuestion = quizData[currentIndex];

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      const response = await getQuiz();

      const preparedData = response.results.map((quiz: quizData) => {
        const decodedQuestion = decode(quiz.question);
        const decodedCorrectAnswer = decode(quiz.correct_answer);
        const decodedIncorrectAnswers = quiz.incorrect_answers.map(
          (answer: string) => decode(answer)
        );

        return {
          ...quiz,
          question: decodedQuestion,
          correct_answer: decodedCorrectAnswer,
          incorrect_answers: decodedIncorrectAnswers,
          options: shuffleOptions(
            decodedCorrectAnswer,
            decodedIncorrectAnswers
          ),
        };
      });

      setQuizData(preparedData);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem("quizProgress");

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);

      if (parsed.quizData) setQuizData(parsed.quizData);
      if (parsed.currentIndex) setCurrentIndex(parsed.currentIndex);
      if (parsed.score) setScore(parsed.score);
      if (parsed.selectedAnswer) setSelectedAnswer(parsed.selectedAnswer);
      if (parsed.timeLeft) setTimeLeft(parsed.timeLeft);
      if (parsed.attemptedCount) setAttemptedCount(parsed.attemptedCount);
    } else {
      fetchQuizData();
    }
  }, []);

  useEffect(() => {
    if (quizData.length === 0) return;

    const progress = {
      quizData,
      currentIndex,
      score,
      selectedAnswer,
      timeLeft,
      attemptedCount, 
    };
    localStorage.setItem("quizProgress", JSON.stringify(progress));
  }, [quizData, currentIndex, score, selectedAnswer, timeLeft, attemptedCount]);

  const handleQuizFinish = useCallback(
    (finalAttemptedCount?: number) => {
      const finalAttempted = finalAttemptedCount || attemptedCount;

      const resultData = {
        correct: score,
        incorrect: finalAttempted - score,
        attempted: finalAttempted,
        total: quizData.length,
      };

      navigate("/result", { state: { results: resultData } });
    },
    [score, quizData.length, navigate, attemptedCount]
  );

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);

    const newAttemptedCount = attemptedCount + 1;
    setAttemptedCount(newAttemptedCount);

    if (value === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelectedAnswer("");
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleQuizFinish(newAttemptedCount);
      }
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      handleQuizFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleQuizFinish]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Timer and Progress */}
        {quizData.length > 0 && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg py-1">
                Question {currentIndex + 1} of {quizData.length}
              </div>
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="w-5 h-5" />
                <span className="text-gray-700">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Progress
              value={((currentIndex + 1) / quizData.length) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Question Card */}
        <Card>
          {error && quizData.length === 0 && !loading && (
            <div className="flex flex-col">
              <div className="text-red-500 text-center py-4">{error}</div>
              <Button
                variant={"outline"}
                onClick={fetchQuizData}
                className="mx-auto"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <CardHeader>
              <div className="flex justify-center items-center py-8">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            </CardHeader>
          ) : currentQuestion ? (
            <>
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                        selectedAnswer === option
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />

                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </>
          ) : null}
        </Card>
      </div>
    </div>
  );
};
