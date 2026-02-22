import { queryDocId, queryMany, querySingle, readMany, readSingle, writeSingle} from "./commonDb";
import { DocItem, DbReadResult, DbReadResults, DbWriteResult } from "../types/types";
import { Option, Question, SurveyResponse, SurveySchema, CompatibilityScoreResult } from "../types/survey";
import { app, db } from "../firebaseConfig";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore, orderBy } from "firebase/firestore";

const schemaCollectionName = 'surveySchema';
const resultsCollectionName = 'surveyResults';

async function getSurveySchemaIdAsync() : Promise<string> {
  const schema = (await readSingle<SurveySchema>(schemaCollectionName));
  return schema.docId
}

async function getAllQuestionsAsync(): Promise<DocItem<Question>[]> {
  const surveySchemaId = await getSurveySchemaIdAsync();
  const questions = await queryMany<Question>(collection(db, schemaCollectionName, surveySchemaId, 'questions'), orderBy("updated", "asc"));
  return questions.results;
}

async function createQuestionAsync(question: Question): Promise<DbWriteResult> {
  const surveySchemaId = await getSurveySchemaIdAsync();
  const questionsCollectionRef = collection(db, schemaCollectionName, surveySchemaId, "questions");
  const result = await writeSingle(questionsCollectionRef, question);
  return result;
}

async function createSurveyResponseAsync(uid: string, role: "mentee" | "mentor", responses: Record<string, any>): Promise<DbWriteResult> {
  
  const surveyResponse: SurveyResponse = {
    UID: uid,
    role,
    responses
  }
  const result = await writeSingle(resultsCollectionName, surveyResponse);
  return result;
}

async function getAllMentorSurveyRespAsync(): Promise<DocItem<SurveyResponse>[]> {
  const responses = await queryMany<SurveyResponse>(resultsCollectionName, where("role", "==", "mentor"));
  return responses.results;
}

async function getAllMenteeSurveyRespAsync(): Promise<DocItem<SurveyResponse>[]> {
  const responses = await queryMany<SurveyResponse>(resultsCollectionName, where("role", "==", "mentee"));
  return responses.results;
}

// Score calcualted with Jaccard method
// score = |intersection| / |union|
async function computeCompatibilityAsync(menteeSurveyRespId: string, mentorSurveyRespId: string): Promise<CompatibilityScoreResult> {

  // Find the intersection of dict keys
  function intersection(o1: Record<string, any>, o2: Record<string, any>): string[] {
    const [k1, k2] = [Object.keys(o1), Object.keys(o2)];
    const [first, next] = k1.length > k2.length ? [k2, o1] : [k1, o2];
    return first.filter(k => k in next);
  }

  function jaccard_index(s1: Record<string, any>, s2: Record<string, any>): number {
    let size_s1 = s1.length;
    let size_s2 = s2.length;

    let intersect = intersection(s1, s2);
    let size_in = intersect.length;
    let jaccard_in = size_in / (size_s1 + size_s2 - size_in);

    return jaccard_in;
  }

  const menteeRespDoc: DbReadResult<SurveyResponse> = await queryDocId(resultsCollectionName, menteeSurveyRespId);
  const mentorRespDoc: DbReadResult<SurveyResponse> = await queryDocId(resultsCollectionName, mentorSurveyRespId);
  const score = jaccard_index(menteeRespDoc.data, mentorRespDoc.data);
  
  const result: CompatibilityScoreResult = {
    menteeSurveyRespId,
    mentorSurveyRespId,
    score
  }
  return result;
}

const surveyDb = {
  getAllQuestionsAsync,
  createQuestionAsync,
  createSurveyResponseAsync,
  computeCompatibilityAsync
}

export default surveyDb
