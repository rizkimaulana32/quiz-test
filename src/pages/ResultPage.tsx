import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results 
  
  useEffect(() => {
    if (!results) {
      navigate("/dashboard");
    }
  }, [results, navigate]);
  
  if (!results) return null;
  
  const percentage = Math.round((results.correct / results.total) * 100);

  const handleOnResetQuiz = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
          <CardDescription>Here are your results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Circle */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
              {percentage}%
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Correct</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {results.correct}
              </div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Incorrect</span>
              </div>
              <div className="text-2xl font-bold text-red-700">
                {results.incorrect}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              You answered{" "}
              <span className="font-medium">{results.attempted}</span> out of{" "}
              <span className="font-medium">{results.total}</span> questions
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handleOnResetQuiz} className="w-full">
            Take Quiz Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
