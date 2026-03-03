import {deleteDoc, doc, updateDoc, where} from "firebase/firestore";
import {MatchProfile, MentorReply, Message, MessageState} from "../types/matchProfile";
import { deleteDocId, queryMany, writeSingle } from "./commonDb";
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

async function DeleteMessageAsync(messageId: string) {
  return await deleteDocId(collectionName, messageId);
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

async function getMessagesSentToMentorAsync(mentorUID: string): Promise<DocItem<Message>[]> {
  const messages = (await queryMany<Message>(collectionName,
    where("mentorUID", "==", mentorUID))).results;

  if (messages.length === 0) return messages;

  return await filterMessages(mentorUID, messages);
}

async function getMessagesSentToUserAsync(userUID: string): Promise<DocItem<Message>[]> {
  const messages = (await queryMany<Message>(collectionName,
    where("recipientUID", "==", userUID))).results;

    if (messages.length === 0) return messages;

    return await filterMessages(userUID, messages);
}

const filterMessages = async (userUID: string, messages: DocItem<Message>[]) => {
  const userReports = await reportUserService.getUserReports(userUID);
  
  // hide messages of reported users and rejected messages
  const filteredMessages = Array.of<DocItem<Message>>();
  messages.forEach(message => {
    const mentorDenied = parseInt(message.data.mentorReply) === MentorReply.denied;
    const mentorReported = reportUserService.containsReportedUserID(userReports, message.data.senderUID)
    
    if (!mentorDenied && !mentorReported) {
      filteredMessages.push(message);
    }
  });
  return filteredMessages;
}

export const messagingDb = {
  sendMessageAsync,
  DeleteMessageAsync,
  mentorReplyAsync,
  getAwaitingMessagesSentForMentorAsync,
  getProcessedMessagesSentForMentorAsync,
  getMessagesSentByMenteeAsync,
  getMessagesSentToUserAsync,
  containsReportedUserID
}