import {doc, updateDoc, where} from "firebase/firestore";
import {MatchProfile, MentorReply, Message, MessageState} from "../types/matchProfile";
import { queryMany, writeSingle } from "./commonDb";
import { DocItem, UserReport } from "../types/types";
import {db} from "../firebaseConfig";
import { reportUserService } from "../service/reportUserService";

const collectionName = 'messages';

function containsReportedUserID(usersReported: DocItem<UserReport>[], mentorUID: string) : boolean {
  let reported = false;
  usersReported.forEach(user => {
    if (user.data.reportedForUID === mentorUID) {
      reported = true;
    }
  });
  return reported;
}

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
  const messages = (await queryMany<Message>(collectionName, 
    where("mentorProfileId", "==", mentorProfileId), 
    where("menteeProfileId", "==", menteeProfileId))).results;
  
  if (messages.length === 0) return messages;

  return await filterMessages(messages[0].data.menteeUID, messages);
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
  const messages = (await queryMany<Message>(collectionName,
    where("sentByUID", "==", menteeUID))).results;

  if (messages.length === 0) return messages;

  return await filterMessages(menteeUID, messages);
}

async function getMessagesSentToMenteeAsync(menteeUID: string): Promise<DocItem<Message>[]> {
  const messages = (await queryMany<Message>(collectionName,
    where("menteeUID", "==", menteeUID))).results;

  if (messages.length === 0) return messages;

  return await filterMessages(menteeUID, messages);
}

const filterMessages = async (menteeUID: string, messages: DocItem<Message>[]) => {
  const userReports = await reportUserService.getUserReports(menteeUID);
  
  // hide messages of reported users and rejected messages
  const filteredMessages = Array.of<DocItem<Message>>();
  messages.forEach(message => {
    const mentorDenied = parseInt(message.data.mentorReply) === MentorReply.denied;
    const mentorReported = reportUserService.containsReportedUserID(userReports, message.data.mentorUID)
    
    if (!mentorDenied && !mentorReported) {
      filteredMessages.push(message);
    }
  });
  return filteredMessages;
}

export const messagingDb = {
  sendMessageAsync,
  mentorReplyAsync,
  getMessagesSentForMenteeProfileAsync,
  getAwaitingMessagesSentForMentorAsync,
  getProcessedMessagesSentForMentorAsync,
  getMessagesSentByMenteeAsync,
  getMessagesSentToMenteeAsync,
  containsReportedUserID
}
