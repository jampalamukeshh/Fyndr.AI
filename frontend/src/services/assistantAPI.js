import { apiRequest } from "../utils/api";

export async function getSemanticMatches(limit = 12) {
  return apiRequest(`/applications/semantic-matches/?limit=${limit}`, "GET");
}

export async function chatWithAssistant(message, limit = 5) {
  return apiRequest("/applications/assistant/chat/", "POST", {
    message,
    limit,
  });
}

export async function previewAssistantAction(type, payload = {}) {
  return apiRequest("/applications/assistant/action-preview/", "POST", {
    type,
    payload,
  });
}
