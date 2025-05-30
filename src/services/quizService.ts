import axios from "axios";

const BASE_URL = "https://opentdb.com/api.php";

export const getQuiz = async() => {
    try {
        const response = await axios.get(
          `${BASE_URL}?amount=10&type=multiple`
        );
        return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || "Failed to fetch quiz data"
          );
        }
        throw new Error("An unexpected error occurred");
    }
}