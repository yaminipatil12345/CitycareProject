// services/apiClient.ts
import { Platform } from "react-native";

// 🔧 Detect platform and choose correct API base URL
// - Web (Expo web) → use localhost
// - Mobile (real phone on Wi-Fi) → use your PC IP
// - Android Emulator → use 10.0.2.2
// - iOS Simulator → localhost works

let baseURL = "http://localhost:8000/api/"; // default for web + iOS simulator

if (Platform.OS === "android") {
  // Android emulator special IP
  baseURL = "http://10.0.2.2:8000/api/";
} else if (Platform.OS === "ios") {
  // iOS simulator can use localhost
  baseURL = "http://localhost:8000/api/";
}

export const API_BASE = baseURL;

type LoginPayload = { email?: string; username?: string; password: string };

async function safeJsonResponse(resp: Response) {
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function loginUser(payload: LoginPayload) {
  const body = {
    email: payload.email ?? payload.username,
    password: payload.password,
  };

  const resp = await fetch(`${API_BASE}auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await safeJsonResponse(resp);

  if (!resp.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Login failed (${resp.status})`;
    const err: any = new Error(msg);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data; // should contain { access, refresh, ... }
}

export async function getDataAuth(endpoint: string, token: string) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await safeJsonResponse(response);

  if (!response.ok) {
    const err: any = new Error(`GET ${endpoint} failed`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function postData(endpoint: string, body: any, token?: string) {
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await safeJsonResponse(resp);

  if (!resp.ok) {
    const err: any = new Error(`POST ${endpoint} failed`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data;
}
