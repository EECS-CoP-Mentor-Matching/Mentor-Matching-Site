import { where } from "firebase/firestore";
import { Message } from "../types/matchProfile";
import { queryMany, readMany, writeSingle } from "./commonDb";
import { DocItem } from "../types/types";

const collectionName = 'messages';

async function sendMessageAsync(message: Message) {
  return await writeSingle(collectionName, message);
}

async function getMessagesSentForMenteeProfileAsync(mentorProfileId: string, menteeProfileId: string) : Promise<DocItem<Message>[]> {
  return (await queryMany<Message>(collectionName, 
    where("mentorProfileId", "==", mentorProfileId), 
    where("menteeProfileId", "==", menteeProfileId))).results;
}

async function getMessagesSentForMentorAsync(mentorUID: string) : Promise<DocItem<Message>[]> {
  return (await queryMany<Message>(collectionName,
      where("mentorUID", "==", mentorUID))).results;
}

export const messagingDb = {
  sendMessageAsync,
  getMessagesSentForMenteeProfileAsync,
  getMessagesSentForMentorAsync
}
