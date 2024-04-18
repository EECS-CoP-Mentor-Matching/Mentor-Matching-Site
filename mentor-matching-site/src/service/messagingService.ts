import { messagingDb } from "../dal/messagingDb"
import { Message } from "../types/matchProfile";

async function sendMessage(message: Message) {
  return await messagingDb.sendMessageAsync(message);
}

async function getMessagesSentForMenteeProfile(mentorProfileId: string, menteeProfileId: string) {
  return await messagingDb.getMessagesSentForMenteeProfileAsync(mentorProfileId, menteeProfileId);
}

export const messagingService = {
  sendMessage,
  getMessagesSentForMenteeProfile
}
