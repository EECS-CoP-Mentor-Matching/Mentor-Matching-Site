import { queryMany, querySingle, readMany} from "./commonDb";
import { DocItem, DbReadResult, DbReadResults } from "../types/types";
import { SurveyOption, SurveyQuestion, SurveySchema } from "../types/survey";
import { app, db } from "../firebaseConfig";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";

const collectionName = 'surveySchema';

async function getSurveySchemasAsync() : Promise<DocItem<SurveySchema>[]> {
  const schema = (await readMany<SurveySchema>(collectionName));
  return schema.results
}

const surveyDb = {
  getSurveySchemasAsync
}

export default surveyDb
