import { queryDocId, queryMany, querySingle, readMany, readSingle, writeSingle} from "./commonDb";
import { DocItem, DbReadResult, DbReadResults, DbWriteResult } from "../types/types";
import { Option, Question, SurveyResponse, SurveySchema, CompatibilityScoreResult, DisplayUi } from "../types/survey";
import { app, db } from "../firebaseConfig";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore, orderBy, getDoc } from "firebase/firestore";

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

function calculateCompatibilityWithWeights(
  r1: Record<string, any>,
  r2: Record<string, any>,
  questionMeta: Record<string, { algorithmWeight: number; displayUi?: DisplayUi }>
): number {

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const questionId in questionMeta) {

    const meta = questionMeta[questionId];
    const weight = meta.algorithmWeight;
    let questionScore: number | null = null;
    const a = r1[questionId];
    const b = r2[questionId];

    // ignore questions with weight 0
    if (!weight) continue;

    // ignore question if either user didn’t answer
    if (a == null || b == null) continue;

    // ignore text questions
    if (meta.displayUi === DisplayUi.text) continue;

    // -----------------------------------
    // Score calculated with Jaccard method
    // score = |intersection| / |union|
    // -----------------------------------
    // Multi responses questions (checkbox)
    if (meta.displayUi === DisplayUi.checkbox) {
      const setA = new Set(a);
      const setB = new Set(b);

      const intersection = new Set([...setA].filter(x => setB.has(x)));
      const union = new Set([...setA, ...setB]);

      if (union.size > 0) {
        questionScore = intersection.size / union.size; // Jaccard
      }
    }

    // Single response questions (radio / dropdown)
    else if (meta.displayUi === DisplayUi.radio || meta.displayUi === DisplayUi.dropdown) {
      questionScore = a === b ? 1 : 0;
    }

    if (questionScore !== null) {
      totalWeightedScore += questionScore * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;

  return totalWeightedScore / totalWeight; // normalize score [0, 1]
}

async function computeCompatibilityAsync(menteeSurveyRespId: string, mentorSurveyRespId: string): Promise<CompatibilityScoreResult> {
  const [menteeRespDoc, mentorRespDoc, allQuestions] = await Promise.all([
    queryDocId<SurveyResponse>(resultsCollectionName, menteeSurveyRespId),
    queryDocId<SurveyResponse>(resultsCollectionName, mentorSurveyRespId),
    getAllQuestionsAsync()
  ]);

  if (!menteeRespDoc?.data || !mentorRespDoc?.data) {
    throw new Error("Survey response not found");
  }

  const questionMeta = Object.fromEntries(
    allQuestions.map(q => [
      q.docId,
      {
        algorithmWeight: q.data.algorithmWeight ?? 0,
        displayUi: q.data.displayUi
      }
    ])
  );

  const score = calculateCompatibilityWithWeights(menteeRespDoc.data.responses, mentorRespDoc.data.responses, questionMeta);

  return {
    menteeSurveyRespId,
    mentorSurveyRespId,
    score
  };
}

const surveyDb = {
  getAllQuestionsAsync,
  createQuestionAsync,
  createSurveyResponseAsync,
  computeCompatibilityAsync,
  getAllMentorSurveyRespAsync,
  getAllMenteeSurveyRespAsync
}

export default surveyDb
