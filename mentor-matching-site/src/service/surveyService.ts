import { DocItem, DbReadResult, DbReadResults, DbWriteResult } from "../types/types";
import { Option, Question, SurveyResponse, SurveySchema } from "../types/survey";
import surveyDb from "../dal/surveyDb";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { MatchRole } from "../types/matchProfile";


async function getAllQuestions() : Promise<DocItem<Question>[]> {
    return await surveyDb.getAllQuestionsAsync();
}

async function createQuestion(question: Question) : Promise<DbWriteResult> {
    return await surveyDb.createQuestionAsync(question);
}

async function createSurveyResponse(uid: string, role: "mentee" | "mentor", responses: Record<string, any>): Promise<DbWriteResult> {
    return await surveyDb.createSurveyResponseAsync(uid, role, responses);
}

const surveyService = {
    getAllQuestions,
    createQuestion,
    createSurveyResponse
}

export default surveyService;