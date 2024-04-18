import { messagingDb } from "../dal/messagingDb"
import { Message } from "../types/matchProfile";

async function sendMessage(message: Message) {
  return await messagingDb.sendMessageAsync(message);
}

async function getMessagesSentForMenteeProfile(mentorProfileId: string, menteeProfileId: string) {
  return await messagingDb.getMessagesSentForMenteeProfileAsync(mentorProfileId, menteeProfileId);
}

async function getMessagesSentForMentor(mentorUID: string) {
  return await messagingDb.getMessagesSentForMentorAsync(mentorUID);
}

export const messagingService = {
  sendMessage,
  getMessagesSentForMenteeProfile,
  getMessagesSentForMentor
}
