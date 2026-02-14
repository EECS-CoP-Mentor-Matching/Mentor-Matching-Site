import { DocItem, DbReadResult, DbReadResults, DbWriteResult } from "../types/types";
import { Option, Question, SurveySchema } from "../types/survey";
import surveyDb from "../dal/surveyDb";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";


async function getAllQuestions() : Promise<Question[]> {
    return await surveyDb.getAllQuestionsAsync();
}

async function createQuestion(question: Question) : Promise<DbWriteResult> {
    return await surveyDb.createQuestionAsync(question);
}

const surveyService = {
    getAllQuestions,
    createQuestion
}

export default surveyService;