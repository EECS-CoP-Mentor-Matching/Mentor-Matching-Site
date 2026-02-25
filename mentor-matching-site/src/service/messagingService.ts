import { messagingDb } from "../dal/messagingDb"
import {MentorReply, Message, MessageState} from "../types/matchProfile";

async function sendMessage(message: Message) {
  return await messagingDb.sendMessageAsync(message);
}

async function mentorReply(docId: string, message: Message, reply: MentorReply) {
  return await messagingDb.mentorReplyAsync(docId, message, reply);
}

async function getMessagesSentForMenteeProfile(mentorProfileId: string, menteeProfileId: string) {
  return await messagingDb.getMessagesSentForMenteeProfileAsync(mentorProfileId, menteeProfileId);
}

async function getAwaitingMessagesSentForMentor(mentorUID: string) {
  return await messagingDb.getAwaitingMessagesSentForMentorAsync(mentorUID);
}

async function getProcessedMessagesSentForMentor(mentorUID: string) {
  return await messagingDb.getProcessedMessagesSentForMentorAsync(mentorUID);
}

async function getMessagesSentByMentee(mentorUID: string) {
  return await messagingDb.getMessagesSentByMenteeAsync(mentorUID);
}

async function getMessagesSentToMentor(mentorUID: string){
  return await messagingDb.getMessagesSentToMentorAsync(mentorUID);
}

async function getMessagesSentToMentee(menteeUID: string) {
  return await messagingDb.getMessagesSentToMenteeAsync(menteeUID);
}

export const messagingService = {
  sendMessage,
  mentorReply,
  getMessagesSentForMenteeProfile,
  getAwaitingMessagesSentForMentor,
  getProcessedMessagesSentForMentor,
  getMessagesSentByMentee,
  getMessagesSentToMentee,
  getMessagesSentToMentor
}
