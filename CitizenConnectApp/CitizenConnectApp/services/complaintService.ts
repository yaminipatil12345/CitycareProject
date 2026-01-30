// services/complaintService.ts
import { postData, getDataAuth, API_BASE } from "./apiClient";

/* ---------- Types ---------- */
export type Complaint = {
  id: string;
  title: string;       // mapped from backend.problem
  category: string;    // mapped from backend.problem_type
  location: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REPORT";
  date: string;
  createdAt: string;   // mapped from backend.created_at
};

/* ---------- Mapper ---------- */
function mapComplaint(raw: any): Complaint {
  return {
    id: String(raw.id),
    title: raw.problem,
    category: raw.problem_type,
    location: raw.location,
    description: raw.description,
    status: raw.status,
    date: raw.date,
    createdAt: raw.created_at,
  };
}

/* ---------- User APIs ---------- */

// Report a new complaint
export async function addComplaint(
  payload: {
    title: string;
    category: string;
    location: string;
    description: string;
  },
  token: string
): Promise<Complaint> {
  // Map frontend fields → backend fields
  const body = {
    problem: payload.title,
    problem_type: payload.category,
    location: payload.location,
    description: payload.description,
  };
  const data = await postData("issues/report/", body, token);
  return mapComplaint(data.issue);
}

// Get all complaints of the logged-in user
export async function getComplaints(token: string): Promise<Complaint[]> {
  const data = await getDataAuth("issues/user/", token);
  return (data.issues || []).map(mapComplaint);
}

// Get a specific complaint by ID
export async function getComplaintById(
  id: string,
  token: string
): Promise<Complaint | null> {
  const list = await getComplaints(token);
  return list.find((c) => String(c.id) === String(id)) ?? null;
}

/* ---------- Admin APIs ---------- */

// Update complaint status (admin) ✅ now uses PUT
export async function updateComplaintStatus(
  id: string,
  newStatus: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REPORT",
  token: string
): Promise<Complaint> {
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(`${API_BASE}admin/issues/${id}/status/`, {
    method: "PUT", // ✅ must be PUT, not POST
    headers,
    body: JSON.stringify({ status: newStatus }),
  });

  const text = await resp.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!resp.ok) {
    const err: any = new Error(`PUT admin/issues/${id}/status failed`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return mapComplaint({
    ...data.issue,
    problem: data.issue.problem ?? data.issue.title,
    problem_type: data.issue.problem_type ?? data.issue.category,
    created_at: data.issue.created_at ?? "",
  });
}

// Get all complaints (admin)
export async function getAllComplaints(token: string): Promise<Complaint[]> {
  const data = await getDataAuth("admin/issues/", token);
  return (data.issues || []).map(mapComplaint);
}

/* ---------- Feedback ---------- */

// Submit feedback for a complaint
export async function submitFeedback(
  issueId: string,
  feedback_text: string,
  token: string
) {
  const data = await postData(
    "feedback/submit/",
    { issue_id: issueId, feedback_text },
    token
  );
  return data.feedback;
}
