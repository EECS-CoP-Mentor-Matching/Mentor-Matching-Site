import { messagingDb } from "../dal/messagingDb"
import {MentorReply, Message, MessageState} from "../types/matchProfile";

async function sendMessage(message: Message) {
  return await messagingDb.sendMessageAsync(message);
}

async function deleteMessage(messageId: string) {
  return await messagingDb.DeleteMessageAsync(messageId);
}

async function mentorReply(docId: string, message: Message, reply: MentorReply) {
  return await messagingDb.mentorReplyAsync(docId, message, reply);
}

async function getAwaitingMessagesSentForMentor(mentorUID: string) {
  return await messagingDb.getAwaitingMessagesSentForMentorAsync(mentorUID);
}

async function getProcessedMessagesSentForMentor(mentorUID: string) {
  return await messagingDb.getProcessedMessagesSentForMentorAsync(mentorUID);
}

async function getMessagesSentByUser(userUID: string) {
  return await messagingDb.getMessagesSentByUserAsync(userUID);
}

async function getMessagesSentToUser(userUID: string) {
  return await messagingDb.getMessagesSentToUserAsync(userUID);
}

export const messagingService = {
  sendMessage,
  deleteMessage,
  mentorReply,
  getAwaitingMessagesSentForMentor,
  getProcessedMessagesSentForMentor,
  getMessagesSentByUser,
  getMessagesSentToUser
}
