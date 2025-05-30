import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const DashboardPage = () => {
  const [hasProgress, setHasProgress] = useState(false);
  const navigate = useNavigate();

  const quizProgress = localStorage.getItem("quizProgress");
  const parsedProgress = quizProgress ? JSON.parse(quizProgress) : [];

  useEffect(() => {
    setHasProgress(!!quizProgress);
  }, [quizProgress]);

  const handleOnStartQuiz = () => {
    localStorage.removeItem("quizProgress");
    navigate("/quiz");
  };

  const handleOnResumeQuiz = () => {
    navigate("/quiz");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    localStorage.removeItem("quizProgress");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Welcome to the Quiz!
          </CardTitle>
          <CardDescription className="text-lg">
            Test your knowledge with our interactive quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">5:00</div>
              <div className="text-sm text-gray-600">Time Limit</div>
            </div>
          </div>

          {hasProgress && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">Resume Previous Session</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                You have an incomplete quiz. Question{" "}
                {parsedProgress.currentIndex + 1} of{" "}
                {parsedProgress.quizData.length}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {hasProgress ? (
            <>
              <Button onClick={handleOnResumeQuiz} className="flex-1">
                Resume Quiz
              </Button>
              <Button
                onClick={handleOnStartQuiz}
                variant="outline"
                className="flex-1"
              >
                Start Over
              </Button>
            </>
          ) : (
            <Button onClick={handleOnStartQuiz} className="w-full">
              Start Quiz
            </Button>
          )}
        </CardFooter>

        <Button
          variant="destructive"
          className="flex-1 mx-auto"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Card>
    </div>
  );
};
