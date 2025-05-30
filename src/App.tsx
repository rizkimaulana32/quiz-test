import { Route, Routes } from "react-router"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { QuizPage } from "./pages/QuizPage"
import { ResultPage } from "./pages/ResultPage"
import ProtectedRoute from "./components/protectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Route>
    </Routes>
  );
}

export default App
