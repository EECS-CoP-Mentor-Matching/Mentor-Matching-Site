import { queryMany, querySingle, readMany, readSingle, writeSingle} from "./commonDb";
import { DocItem, DbReadResult, DbReadResults, DbWriteResult } from "../types/types";
import { Option, Question, SurveyResponse, SurveySchema } from "../types/survey";
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

const surveyDb = {
  getAllQuestionsAsync,
  createQuestionAsync,
  createSurveyResponseAsync
}

export default surveyDb
