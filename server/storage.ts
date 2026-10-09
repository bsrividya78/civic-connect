import fs from 'fs';
import path from 'path';
import { Complaint, IssueType, PriorityLevel, ComplaintStatus, CreateComplaintInput } from '../src/types/complaint.ts';

// Department routing map based on issue type
export const DEPARTMENT_MAP: Record<IssueType, string> = {
  Pothole: 'Roads & Infrastructure Department',
  Garbage: 'Solid Waste & Sanitation Department',
  Drainage: 'Water Supply & Drainage Board',
  Streetlight: 'Municipal Electrical Department',
  Sanitation: 'Public Health & Sanitation Wing',
  Other: 'Civic Grievance Cell',
};

// Default priority determination logic
export function calculatePriority(issueType: IssueType, description: string): PriorityLevel {
  const lowerDesc = description.toLowerCase();
  const highRiskKeywords = ['danger', 'accident', 'sparking', 'exposed wire', 'flooding', 'hospital', 'school', 'urgent', 'blocked road', 'severe'];
  const hasUrgentKeyword = highRiskKeywords.some((kw) => lowerDesc.includes(kw));

  if (hasUrgentKeyword) return 'High';

  switch (issueType) {
    case 'Drainage':
    case 'Pothole':
      return 'High';
    case 'Streetlight':
    case 'Sanitation':
    case 'Garbage':
      return 'Medium';
    default:
      return 'Low';
  }
}

// Haversine formula to compute distance in meters
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Initial demo complaints
const DEMO_COMPLAINTS: Complaint[] = [
  {
    id: 'CC1024',
    complaintId: 'CC1024',
    issueType: 'Pothole',
    description: 'Deep dangerous pothole near the intersection of 5th Cross & Main Road. Causing vehicle damage and near accidents during peak traffic hours.',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    latitude: 12.9716,
    longitude: 77.5946,
    locationAddress: '5th Cross, MG Road Junction, Ward 84',
    landmark: 'Opposite Central City Library',
    priority: 'High',
    status: 'In Progress',
    department: 'Roads & Infrastructure Department',
    assignedOfficer: 'Eng. R. Sharma (Divisional Inspector)',
    citizenName: 'Rahul Verma',
    citizenPhone: '+91 98765 43210',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        comment: 'Complaint logged via Civic Connect mobile portal by citizen.',
      },
      {
        status: 'Assigned',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        comment: 'Routed to Roads & Infrastructure Dept. Work order #RO-882 created.',
        updatedBy: 'Civic Dispatch AI',
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        comment: 'Road patch crew dispatched with cold-mix asphalt. Work scheduled completion by 6 PM.',
        updatedBy: 'Eng. R. Sharma',
      },
    ],
    resolutionNotes: 'Material dispatched. Crew on site barricading the lane.',
  },
  {
    id: 'CC1025',
    complaintId: 'CC1025',
    issueType: 'Garbage',
    description: 'Illegal solid waste accumulation and overflowing municipal bin at corner of Market Street. Stray animals scattering plastic bags.',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    latitude: 12.9752,
    longitude: 77.5989,
    locationAddress: 'Market Street, Sector 3, Ward 72',
    landmark: 'Behind Daily Fresh Vegetables Market',
    priority: 'Medium',
    status: 'Submitted',
    department: 'Solid Waste & Sanitation Department',
    citizenName: 'Ananya Deshmukh',
    citizenPhone: '+91 98450 11223',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        comment: 'Complaint registered. Verification queue position #4.',
      },
    ],
  },
  {
    id: 'CC1026',
    complaintId: 'CC1026',
    issueType: 'Drainage',
    description: 'Blocked storm water drain causing dirty water overflow across pedestrian walkway after evening shower. Foul smell reported.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    latitude: 12.9691,
    longitude: 77.5873,
    locationAddress: 'Lakeview Colony, 2nd Avenue, Ward 91',
    landmark: 'Near Lakeview Community Park Gate 2',
    priority: 'High',
    status: 'Resolved',
    department: 'Water Supply & Drainage Board',
    assignedOfficer: 'Officer M. Kulkarni',
    citizenName: 'Karthik Raman',
    citizenPhone: '+91 97112 88490',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        comment: 'Emergency high priority complaint submitted.',
      },
      {
        status: 'Assigned',
        timestamp: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
        comment: 'Assigned to Ward 91 Drainage Quick Response Unit.',
        updatedBy: 'Disaster Cell',
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        comment: 'Jetting machine deployed to clear silt and debris blockage.',
        updatedBy: 'Officer M. Kulkarni',
      },
      {
        status: 'Resolved',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        comment: 'Drainage blockage cleared completely and disinfected with bleaching powder. Water flow restored.',
        updatedBy: 'Officer M. Kulkarni',
      },
    ],
    resolutionNotes: 'Cleared 300kg silt from main drain chamber. Flow tested and verified normal.',
  },
  {
    id: 'CC1027',
    complaintId: 'CC1027',
    issueType: 'Streetlight',
    description: 'Two consecutive street lights non-functional along residential street #7 for 3 nights. Road is completely dark and unsafe for pedestrians.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80',
    latitude: 12.9812,
    longitude: 77.6015,
    locationAddress: '7th Cross Road, Indira Nagar, Ward 65',
    landmark: 'Near Pillar 140',
    priority: 'Medium',
    status: 'Assigned',
    department: 'Municipal Electrical Department',
    assignedOfficer: 'Tech Lead Sandeep S.',
    citizenName: 'Priya Sundar',
    citizenPhone: '+91 99880 77665',
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        comment: 'Complaint registered by resident.',
      },
      {
        status: 'Assigned',
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        comment: 'Assigned to Electrical Dept Zone 2 maintenance team for LED bulb / timer inspection.',
        updatedBy: 'Zone Coordinator',
      },
    ],
  },
  {
    id: 'CC1028',
    complaintId: 'CC1028',
    issueType: 'Sanitation',
    description: 'Public urinal near metro station exit is overflowing and uncleaned, causing severe hygiene hazard and mosquito breeding.',
    image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    latitude: 12.9734,
    longitude: 77.6102,
    locationAddress: 'Metro Station Gate 3, MG Promenade, Ward 85',
    landmark: 'Beside Foot-over-bridge',
    priority: 'High',
    status: 'In Progress',
    department: 'Public Health & Sanitation Wing',
    assignedOfficer: 'Health Inspector Dr. V. Patil',
    citizenName: 'Deepak Nair',
    citizenPhone: '+91 98223 34455',
    createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
        comment: 'Report submitted.',
      },
      {
        status: 'Assigned',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        comment: 'Routed to Rapid Sanitation Action Team.',
        updatedBy: 'Public Health Control Desk',
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        comment: 'Sanitation truck and pressure washer on route. Area taped off for deep cleaning.',
        updatedBy: 'Health Inspector Dr. V. Patil',
      },
    ],
  },
];

class ComplaintStorage {
  private complaints: Complaint[] = [];
  private dataFilePath: string;
  private idCounter: number = 1029;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error('Could not create data directory, using memory only:', err);
      }
    }
    this.dataFilePath = path.join(dataDir, 'complaints.json');
    this.loadData();
  }

  private loadData(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.complaints = parsed;
          // find highest CC number
          for (const item of this.complaints) {
            const match = item.complaintId.match(/CC(\d+)/i);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num >= this.idCounter) {
                this.idCounter = num + 1;
              }
            }
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Error reading data file, using default demo complaints:', err);
    }

    // Default to demo complaints
    this.complaints = [...DEMO_COMPLAINTS];
    this.saveData();
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.complaints, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to complaints.json:', err);
    }
  }

  public getAll(): Complaint[] {
    // Return newest first
    return [...this.complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): Complaint | undefined {
    const cleanId = id.trim().toUpperCase();
    return this.complaints.find((c) => c.complaintId.toUpperCase() === cleanId || c.id.toUpperCase() === cleanId);
  }

  public findNearbyDuplicates(latitude: number, longitude: number, issueType: IssueType, maxDistanceMeters: number = 250): Complaint[] {
    return this.complaints.filter((c) => {
      if (c.status === 'Resolved') return false;
      const isSameOrSimilar = c.issueType === issueType;
      if (!isSameOrSimilar) return false;
      const dist = getDistanceMeters(latitude, longitude, c.latitude, c.longitude);
      return dist <= maxDistanceMeters;
    });
  }

  public create(input: CreateComplaintInput): { complaint: Complaint; nearbyDuplicates: Complaint[] } {
    const complaintId = `CC${this.idCounter++}`;
    const department = DEPARTMENT_MAP[input.issueType] || 'Civic Grievance Cell';
    const priority = input.priority || calculatePriority(input.issueType, input.description);
    const now = new Date().toISOString();

    const nearbyDuplicates = this.findNearbyDuplicates(input.latitude, input.longitude, input.issueType);

    const newComplaint: Complaint = {
      id: complaintId,
      complaintId,
      issueType: input.issueType,
      description: input.description.trim(),
      image: input.image || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
      locationAddress: input.locationAddress || `Lat: ${Number(input.latitude).toFixed(4)}, Lon: ${Number(input.longitude).toFixed(4)}`,
      landmark: input.landmark,
      priority,
      status: 'Submitted',
      department,
      citizenName: input.citizenName,
      citizenPhone: input.citizenPhone,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: now,
          comment: 'Complaint officially registered in the Civic Connect database.',
        },
      ],
    };

    this.complaints.unshift(newComplaint);
    this.saveData();

    return { complaint: newComplaint, nearbyDuplicates };
  }

  public updateStatus(
    id: string,
    newStatus: ComplaintStatus,
    comment?: string,
    updatedBy?: string,
    assignedOfficer?: string
  ): Complaint | null {
    const complaint = this.getById(id);
    if (!complaint) return null;

    complaint.status = newStatus;
    complaint.updatedAt = new Date().toISOString();

    if (assignedOfficer) {
      complaint.assignedOfficer = assignedOfficer;
    }

    const historyEntry = {
      status: newStatus,
      timestamp: complaint.updatedAt,
      comment: comment || `Status updated to ${newStatus}.`,
      updatedBy: updatedBy || 'Civic Authority Control Room',
    };

    complaint.statusHistory.push(historyEntry);

    if (newStatus === 'Resolved' && comment) {
      complaint.resolutionNotes = comment;
    }

    this.saveData();
    return complaint;
  }

  public resetDemoData(): void {
    this.complaints = [...DEMO_COMPLAINTS];
    this.idCounter = 1029;
    this.saveData();
  }

  public getStats() {
    const total = this.complaints.length;
    const submitted = this.complaints.filter((c) => c.status === 'Submitted').length;
    const assigned = this.complaints.filter((c) => c.status === 'Assigned').length;
    const inProgress = this.complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = this.complaints.filter((c) => c.status === 'Resolved').length;

    const byType: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    const byPriority: Record<string, number> = { High: 0, Medium: 0, Low: 0 };

    for (const c of this.complaints) {
      byType[c.issueType] = (byType[c.issueType] || 0) + 1;
      byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;
      byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
    }

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      total,
      submitted,
      assigned,
      inProgress,
      resolved,
      openIssues: submitted + assigned + inProgress,
      resolutionRate,
      byType,
      byDepartment,
      byPriority,
    };
  }
}

export const complaintStorage = new ComplaintStorage();
