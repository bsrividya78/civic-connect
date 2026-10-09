import { IssueType, ComplaintStatus, PriorityLevel } from '../types/complaint.ts';

export const ISSUE_CONFIG: Record<
  IssueType,
  {
    label: string;
    department: string;
    defaultPriority: PriorityLevel;
    icon: string;
    color: string;
    bgColor: string;
    samplePhoto: string;
    descriptionPlaceholder: string;
  }
> = {
  Pothole: {
    label: 'Pothole & Road Damage',
    department: 'Roads & Infrastructure Department',
    defaultPriority: 'High',
    icon: 'Cone',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    samplePhoto: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    descriptionPlaceholder: 'e.g., Deep pothole on the right lane near the traffic light, causing vehicles to swerve suddenly...',
  },
  Garbage: {
    label: 'Garbage Dump & Waste',
    department: 'Solid Waste & Sanitation Department',
    defaultPriority: 'Medium',
    icon: 'Trash2',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
    samplePhoto: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    descriptionPlaceholder: 'e.g., Overflowing waste bin at corner, litter scattering on pedestrian sidewalk, foul odor...',
  },
  Drainage: {
    label: 'Drainage Overflow & Waterlogging',
    department: 'Water Supply & Drainage Board',
    defaultPriority: 'High',
    icon: 'Droplets',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    samplePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    descriptionPlaceholder: 'e.g., Blocked drain manhole overflowing with rainwater, submerging pathway and entry to apartment...',
  },
  Streetlight: {
    label: 'Broken Streetlight / Dark Spot',
    department: 'Municipal Electrical Department',
    defaultPriority: 'Medium',
    icon: 'Lightbulb',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    samplePhoto: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80',
    descriptionPlaceholder: 'e.g., Streetlight pole lamp flickers or is totally out for 3 days, making road dark and unsafe...',
  },
  Sanitation: {
    label: 'Public Sanitation & Hygiene',
    department: 'Public Health & Sanitation Wing',
    defaultPriority: 'High',
    icon: 'Sparkles',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
    samplePhoto: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    descriptionPlaceholder: 'e.g., Public toilet facility clogged and overflowing, hazardous smell affecting passersby...',
  },
  Other: {
    label: 'Other Civic Grievance',
    department: 'Civic Grievance Cell',
    defaultPriority: 'Low',
    icon: 'HelpCircle',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50 border-slate-200',
    samplePhoto: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    descriptionPlaceholder: 'e.g., Broken park bench, dangling cables, encroached footpath or missing sign board...',
  },
};

export const STATUS_STEPS: {
  key: ComplaintStatus;
  title: string;
  description: string;
  badgeClass: string;
}[] = [
  {
    key: 'Submitted',
    title: 'Submitted',
    description: 'Complaint received and logged in municipal repository',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    key: 'Assigned',
    title: 'Assigned',
    description: 'Routed to nodal department officer & work order issued',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    key: 'In Progress',
    title: 'In Progress',
    description: 'Field crew or maintenance contractor deployed on ground',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    key: 'Resolved',
    title: 'Resolved',
    description: 'Issue fixed, verified by ward inspector and closed',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
];

export const CITY_HOTSPOTS = [
  { name: 'MG Road Junction', lat: 12.9716, lon: 77.5946, address: '5th Cross, MG Road Junction, Ward 84' },
  { name: 'Central Market Square', lat: 12.9752, lon: 77.5989, address: 'Market Street, Sector 3, Ward 72' },
  { name: 'Lakeview Park Gate 2', lat: 12.9691, lon: 77.5873, address: 'Lakeview Colony, 2nd Avenue, Ward 91' },
  { name: 'Indira Nagar Metro', lat: 12.9812, lon: 77.6015, address: '7th Cross Road, Indira Nagar, Ward 65' },
];
