import {doc, updateDoc, where} from "firebase/firestore";
import {MatchProfile, MentorReply, Message, MessageState} from "../types/matchProfile";
import { queryMany, writeSingle } from "./commonDb";
import { DocItem } from "../types/types";
import {db} from "../firebaseConfig";

const collectionName = 'messages';

async function sendMessageAsync(message: Message) {
  return await writeSingle(collectionName, message);
}

async function mentorReplyAsync(docId: string, message: Message, reply: MentorReply) {
  try {
    message.mentorReply = reply.toString();
    const docRef = doc(db, collectionName, docId);

    await updateDoc(docRef, message as { [field: string]: any });

    return { success: true, id: docId };
  } catch (error) {
    return { success: false, error: error };
  }
}

async function getMessagesSentForMenteeProfileAsync(mentorProfileId: string, menteeProfileId: string) : Promise<DocItem<Message>[]> {
  return (await queryMany<Message>(collectionName, 
    where("mentorProfileId", "==", mentorProfileId), 
    where("menteeProfileId", "==", menteeProfileId))).results;
}

async function getAwaitingMessagesSentForMentorAsync(mentorUID: string) : Promise<DocItem<Message>[]> {
  return (await queryMany<Message>(collectionName,
      where("mentorUID", "==", mentorUID),
      where("mentorReply", "==", MentorReply.awaiting.toString()))).results;
}

async function getProcessedMessagesSentForMentorAsync(mentorUID: string) : Promise<DocItem<Message>[]> {
  return (await queryMany<Message>(collectionName,
      where("mentorUID", "==", mentorUID),
      where("mentorReply", "in", [MentorReply.accepted.toString(), MentorReply.denied.toString()]))).results;
}

async function getMessagesSentByMenteeAsync(menteeUID: string): Promise<DocItem<Message>[]> {
  return (await queryMany<Message>(collectionName,
    where("sentByUID", "==", menteeUID))).results;
}

export const messagingDb = {
  sendMessageAsync,
  mentorReplyAsync,
  getMessagesSentForMenteeProfileAsync,
  getAwaitingMessagesSentForMentorAsync,
  getProcessedMessagesSentForMentorAsync,
  getMessagesSentByMenteeAsync
}
