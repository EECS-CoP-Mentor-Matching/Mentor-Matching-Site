import { DocItem, DbReadResult, DbReadResults, DbWriteResult } from "../types/types";
import { CompatibilityScoreResult, Option, Question, SurveyResponse, SurveySchema } from "../types/survey";
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

async function computeCompatibility(menteeSurveyRespId: string, mentorSurveyRespId: string): Promise<CompatibilityScoreResult> {
    return await surveyDb.computeCompatibilityAsync(menteeSurveyRespId, mentorSurveyRespId)
}

async function getAllMentorSurveyResp(): Promise<DocItem<SurveyResponse>[]> {
  return surveyDb.getAllMentorSurveyRespAsync();
}

async function getAllMenteeSurveyResp(): Promise<DocItem<SurveyResponse>[]> {
return surveyDb.getAllMenteeSurveyRespAsync();

}

const surveyService = {
    getAllQuestions,
    createQuestion,
    createSurveyResponse,
    computeCompatibility,
    getAllMentorSurveyResp,
    getAllMenteeSurveyResp
}

export default surveyService;