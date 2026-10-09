import { Complaint, ComplaintStatus, CreateComplaintInput, IssueType, PriorityLevel } from '../types/complaint.ts';

export interface ComplaintsResponse {
  success: boolean;
  count: number;
  complaints: Complaint[];
}

export interface ComplaintDetailResponse {
  success: boolean;
  complaint: Complaint;
  message?: string;
}

export interface CreateComplaintResponse {
  success: boolean;
  message: string;
  complaintId: string;
  complaint: Complaint;
  nearbyDuplicates?: Complaint[];
}

export interface StatsResponse {
  success: boolean;
  stats: {
    total: number;
    submitted: number;
    assigned: number;
    inProgress: number;
    resolved: number;
    openIssues: number;
    resolutionRate: number;
    byType: Record<string, number>;
    byDepartment: Record<string, number>;
    byPriority: Record<string, number>;
  };
  departments: Record<IssueType, string>;
}

export async function fetchAllComplaints(params?: {
  status?: string;
  issueType?: string;
  priority?: string;
  search?: string;
}): Promise<Complaint[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'All') query.set('status', params.status);
  if (params?.issueType && params.issueType !== 'All') query.set('issueType', params.issueType);
  if (params?.priority && params.priority !== 'All') query.set('priority', params.priority);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`/api/complaints?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch complaints: ${res.statusText}`);
  }
  const data: ComplaintsResponse = await res.json();
  return data.complaints;
}

export async function fetchComplaintById(id: string): Promise<Complaint> {
  const cleanId = id.trim().toUpperCase();
  const res = await fetch(`/api/complaints/${encodeURIComponent(cleanId)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Complaint with ID "${cleanId}" not found`);
  }
  const data: ComplaintDetailResponse = await res.json();
  return data.complaint;
}

export async function submitComplaint(input: CreateComplaintInput): Promise<CreateComplaintResponse> {
  const res = await fetch('/api/complaints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit complaint');
  }

  return await res.json();
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  comment?: string,
  assignedOfficer?: string,
  updatedBy: string = 'Civic Authority Control Room'
): Promise<Complaint> {
  const res = await fetch(`/api/complaints/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      comment,
      assignedOfficer,
      updatedBy,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update status');
  }

  const data = await res.json();
  return data.complaint;
}

export async function checkNearbyComplaints(lat: number, lon: number, issueType: IssueType): Promise<Complaint[]> {
  try {
    const res = await fetch(`/api/complaints/check-nearby?lat=${lat}&lon=${lon}&issueType=${encodeURIComponent(issueType)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.duplicates || [];
  } catch {
    return [];
  }
}

export async function fetchStats(): Promise<StatsResponse['stats']> {
  const res = await fetch('/api/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch statistics');
  }
  const data: StatsResponse = await res.json();
  return data.stats;
}

export async function resetDemoDataset(): Promise<void> {
  const res = await fetch('/api/reset-demo', { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to reset demo dataset');
  }
}
