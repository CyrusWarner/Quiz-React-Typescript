
// This prevents a user from specifying any other difficulty besides Easy Medium Or Hard
export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answer: string[];
    question: string;
    type: string;
}
export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty) => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
    //Awaits the fetch itself then awaits the conversion to JSON
    const data = await (await fetch(endpoint)).json();
    console.log(data)
}