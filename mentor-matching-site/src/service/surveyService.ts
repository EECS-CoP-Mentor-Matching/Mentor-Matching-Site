import { DocItem, DbReadResult, DbReadResults } from "../types/types";
import { SurveyOption, SurveyQuestion, SurveySchema } from "../types/survey";
import surveyDb from "../dal/surveyDb";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";


async function getSurveySchemas() : Promise<SurveySchema[]> {
    return await surveyDb.getSurveySchemasAsync();
}

const surveyService = {
    getSurveySchemas
}

export default surveyService;