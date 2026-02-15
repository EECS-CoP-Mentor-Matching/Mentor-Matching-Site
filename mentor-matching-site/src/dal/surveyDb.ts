import { queryMany, querySingle, readMany, readSingle, writeSingle} from "./commonDb";
import { DocItem, DbReadResult, DbReadResults, DbWriteResult } from "../types/types";
import { Option, Question, SurveySchema } from "../types/survey";
import { app, db } from "../firebaseConfig";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore, orderBy } from "firebase/firestore";

const collectionName = 'surveySchema';
const questionsRef = collection(db, collectionName,)

async function getSurveySchemaIdAsync() : Promise<string> {
  const schema = (await readSingle<SurveySchema>(collectionName));
  return schema.docId
}

async function getAllQuestionsAsync(): Promise<DocItem<Question>[]> {
  const surveySchemaId = await getSurveySchemaIdAsync();
  const questions = await queryMany<Question>(collection(db, collectionName, surveySchemaId, 'questions'), orderBy("updated", "asc"));
  return questions.results;
}

async function createQuestionAsync(question: Question): Promise<DbWriteResult> {
  const surveySchemaId = await getSurveySchemaIdAsync();
  const questionsCollectionRef = collection(db, collectionName, surveySchemaId, "questions");
  const result = await writeSingle(questionsCollectionRef, question);
  return result;
}

const surveyDb = {
  getAllQuestionsAsync,
  createQuestionAsync
}

export default surveyDb
