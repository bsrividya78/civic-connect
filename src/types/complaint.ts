export type IssueType = 'Pothole' | 'Garbage' | 'Drainage' | 'Streetlight' | 'Sanitation' | 'Other';
export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  address?: string;
  landmark?: string;
}

export interface StatusHistoryEntry {
  status: ComplaintStatus;
  timestamp: string;
  comment?: string;
  updatedBy?: string;
}

export interface Complaint {
  id: string;
  complaintId: string;
  issueType: IssueType;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  locationAddress?: string;
  landmark?: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  department: string;
  assignedOfficer?: string;
  citizenName?: string;
  citizenPhone?: string;
  statusHistory: StatusHistoryEntry[];
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentInfo {
  name: string;
  code: string;
  headOfficer: string;
  phone: string;
  issueTypes: IssueType[];
  color: string;
}

export interface CreateComplaintInput {
  issueType: IssueType;
  description: string;
  image?: string;
  latitude: number;
  longitude: number;
  locationAddress?: string;
  landmark?: string;
  citizenName?: string;
  citizenPhone?: string;
  priority?: PriorityLevel;
}
