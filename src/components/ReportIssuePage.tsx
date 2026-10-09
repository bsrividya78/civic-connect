import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Navigation, 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  Building, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon,
  ShieldAlert,
  Send,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { IssueType, PriorityLevel, Complaint } from '../types/complaint.ts';
import { ISSUE_CONFIG, CITY_HOTSPOTS } from '../constants/civic.ts';
import { submitComplaint, checkNearbyComplaints } from '../services/api.ts';
import { MapPreview } from './MapPreview.tsx';

interface ReportIssuePageProps {
  onSuccessTrack: (complaintId: string) => void;
  onNavigateToAuthority: () => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  onSuccessTrack,
  onNavigateToAuthority,
}) => {
  const [issueType, setIssueType] = useState<IssueType>('Pothole');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string>(ISSUE_CONFIG['Pothole'].samplePhoto);
  const [imagePreview, setImagePreview] = useState<string>(ISSUE_CONFIG['Pothole'].samplePhoto);
  const [latitude, setLatitude] = useState<number | null>(12.9716);
  const [longitude, setLongitude] = useState<number | null>(77.5946);
  const [locationAddress, setLocationAddress] = useState('5th Cross, MG Road Junction, Ward 84');
  const [landmark, setLandmark] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  
  // Geolocation state
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationObtained, setLocationObtained] = useState(true);

  // Nearby duplicate detection
  const [nearbyDuplicates, setNearbyDuplicates] = useState<Complaint[]>([]);
  const [isCheckingNearby, setIsCheckingNearby] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Auto calculate priority & department when issue type or description changes
  useEffect(() => {
    const config = ISSUE_CONFIG[issueType];
    const lower = description.toLowerCase();
    const urgentWords = ['danger', 'accident', 'sparking', 'flooding', 'hospital', 'school', 'urgent', 'severe', 'manhole'];
    const hasUrgent = urgentWords.some(w => lower.includes(w));

    if (hasUrgent) {
      setPriority('High');
    } else {
      setPriority(config.defaultPriority);
    }
  }, [issueType, description]);

  // Check nearby duplicates whenever lat, lon, or issueType changes
  useEffect(() => {
    if (latitude && longitude && issueType) {
      setIsCheckingNearby(true);
      checkNearbyComplaints(latitude, longitude, issueType)
        .then((res) => {
          setNearbyDuplicates(res);
        })
        .catch(() => {})
        .finally(() => setIsCheckingNearby(false));
    }
  }, [latitude, longitude, issueType]);

  // Real Browser Geolocation API call
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation API is not supported by your browser.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lon = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lon);
        setLocationObtained(true);
        setIsGettingLocation(false);
        setLocationAddress(`GPS Geotag: ${lat}° N, ${lon}° E`);
      },
      (err) => {
        setIsGettingLocation(false);
        let msg = 'Unable to retrieve your location.';
        if (err.code === 1) msg = 'Location access permission was denied. You can pick a city hotspot below or enter coordinates.';
        else if (err.code === 2) msg = 'Location unavailable. Using city ward coordinates.';
        else if (err.code === 3) msg = 'Location request timed out.';
        setLocationError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Image upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick preset photo select
  const handleSelectPresetPhoto = (type: IssueType) => {
    const sample = ISSUE_CONFIG[type].samplePhoto;
    setImage(sample);
    setImagePreview(sample);
    setIssueType(type);
  };

  // Select city preset
  const handleSelectHotspot = (spot: typeof CITY_HOTSPOTS[0]) => {
    setLatitude(spot.lat);
    setLongitude(spot.lon);
    setLocationAddress(spot.address);
    setLocationObtained(true);
    setLocationError(null);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a short description of the civic problem.');
      return;
    }

    if (latitude === null || longitude === null) {
      alert('Please acquire GPS location or select a landmark before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitComplaint({
        issueType,
        description,
        image,
        latitude,
        longitude,
        locationAddress,
        landmark,
        citizenName: citizenName.trim() || 'Citizen (Ward 84)',
        citizenPhone: citizenPhone.trim() || undefined,
        priority,
      });

      setSubmittedComplaint(res.complaint);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error submitting complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyComplaintId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // If submitted, show success state
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
              Status: Submitted
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Complaint Registered Successfully!
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your grievance has been logged in the Municipal Database and routed to the assigned department.
            </p>
          </div>

          {/* Ticket ID Highlight Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-300 rounded-2xl p-5 max-w-md mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Your Unique Complaint Tracking ID
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wider">
                {submittedComplaint.complaintId}
              </span>
              <button
                onClick={() => copyComplaintId(submittedComplaint.complaintId)}
                className="p-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-xs"
                title="Copy Complaint ID"
              >
                {copiedId ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Save this ID to track your complaint progress anytime.
            </p>
          </div>

          {/* Summary Details */}
          <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Issue Category:</span>
              <span className="font-bold text-slate-800 text-sm">{submittedComplaint.issueType}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Assigned Dept:</span>
              <span className="font-bold text-teal-800 text-sm leading-tight block">{submittedComplaint.department}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Priority Level:</span>
              <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                submittedComplaint.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {submittedComplaint.priority} Priority
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Reported At:</span>
              <span className="font-medium text-slate-700">{new Date(submittedComplaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSuccessTrack(submittedComplaint.complaintId)}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <span>Track Resolution Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setDescription('');
              }}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Report Another Issue
            </button>
          </div>

        </div>
      </div>
    );
  }

  const selectedConfig = ISSUE_CONFIG[issueType];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          <span>Citizen Grievance Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Civic Problem
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Upload photo, capture GPS location, and dispatch directly to the responsible municipal department.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Issue Type Dropdown & Routing Info */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">1</span>
              <span>Select Issue Category *</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">Automatic Department Routing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <select
                value={issueType}
                onChange={(e) => {
                  const val = e.target.value as IssueType;
                  setIssueType(val);
                  setImage(ISSUE_CONFIG[val].samplePhoto);
                  setImagePreview(ISSUE_CONFIG[val].samplePhoto);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all text-sm"
              >
                <option value="Pothole">Pothole (Road & Pavement Damage)</option>
                <option value="Garbage">Garbage (Waste Dump & Overflow)</option>
                <option value="Drainage">Drainage (Overflow & Sewage Block)</option>
                <option value="Streetlight">Streetlight (Broken / Non-functional)</option>
                <option value="Sanitation">Sanitation (Public Hygiene Hazard)</option>
                <option value="Other">Other Civic Grievance</option>
              </select>
            </div>

            {/* Smart Department Routing Card */}
            <div className={`p-3.5 rounded-xl border ${selectedConfig.bgColor} flex items-start gap-3`}>
              <div className="p-2 rounded-lg bg-white/90 text-slate-800 shadow-xs shrink-0">
                <Building className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-xs leading-snug">
                <span className="font-bold text-slate-800 block">Smart Routed To:</span>
                <span className="font-extrabold text-emerald-950 block text-xs mt-0.5">{selectedConfig.department}</span>
                <span className="text-slate-600 mt-1 block">Default SLA: 24-48 Hours</span>
              </div>
            </div>
          </div>

          {/* Quick preset selector buttons for fast testing */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              Or pick an issue type to auto-fill sample photo:
            </span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ISSUE_CONFIG) as IssueType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleSelectPresetPhoto(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    issueType === type
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Photo Upload & Image Preview */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">2</span>
              <span>Upload / Capture Photo *</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">Visual Proof for Inspection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Upload Zone */}
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20 group">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-800">
                  Tap to take photo or upload
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports JPG, PNG, WebP from mobile camera or file
                </span>
              </label>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Tip: A clear photo helps municipal teams bring the right repair gear.</span>
              </p>
            </div>

            {/* Image Preview Box */}
            <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Issue Preview"
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] rounded-md font-medium">
                    Preview Loaded
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white p-2 rounded-lg text-xs flex items-center justify-between">
                    <span className="truncate">{selectedConfig.label}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetPhoto(issueType)}
                      className="text-[10px] text-teal-300 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-52 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                  <span className="text-xs">No image selected yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Location Section with Geolocation API */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">3</span>
              <span>Capture GPS Location *</span>
            </label>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Browser Geolocation API
            </span>
          </div>

          <div className="space-y-4">
            {/* Get Current Location Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="px-5 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isGettingLocation ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Detecting GPS Coordinates...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Get Current Location</span>
                  </>
                )}
              </button>

              <div className="text-xs text-slate-500">
                Pings your device's browser GPS to accurately tag ward coordinates.
              </div>
            </div>

            {/* Error Message if location fails */}
            {locationError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Location notice: </span>
                  <span>{locationError}</span>
                </div>
              </div>
            )}

            {/* Coordinates Display */}
            {locationObtained && latitude !== null && longitude !== null && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Acquired Latitude & Longitude
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="font-mono text-sm sm:text-base font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                        Lat: {latitude.toFixed(6)}
                      </div>
                      <div className="font-mono text-sm sm:text-base font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                        Lon: {longitude.toFixed(6)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Street Address / Ward Name
                    </label>
                    <input
                      type="text"
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      placeholder="e.g. 5th Cross Road, Sector 3, Ward 84"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Government High School Gate"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Visual Map Radar Canvas */}
                <div>
                  <MapPreview
                    latitude={latitude}
                    longitude={longitude}
                    address={locationAddress}
                    landmark={landmark}
                    issueType={issueType}
                  />
                </div>
              </div>
            )}

            {/* Demo Hotspots quick-picker */}
            <div className="pt-1">
              <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                Quick Test Hotspots (City Wards):
              </span>
              <div className="flex flex-wrap gap-2">
                {CITY_HOTSPOTS.map((spot) => (
                  <button
                    type="button"
                    key={spot.name}
                    onClick={() => handleSelectHotspot(spot)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200"
                  >
                    📍 {spot.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Duplicate Warning */}
            {nearbyDuplicates.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block text-sm">
                    Potential Duplicate Detected ({nearbyDuplicates.length} nearby active issue)
                  </span>
                  <p className="mt-1">
                    Another <span className="font-semibold">{issueType}</span> was reported recently within 200m (ID:{' '}
                    <span className="font-mono font-bold">{nearbyDuplicates.map((d) => d.complaintId).join(', ')}</span>).
                  </p>
                  <p className="mt-1 text-amber-800">
                    Your report will automatically reinforce the priority queue with municipal dispatchers!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Description & Citizen Details */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">4</span>
              <span>Issue Description & Urgency *</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Assessed Priority:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                priority === 'High' ? 'bg-red-100 text-red-700' : priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {priority}
              </span>
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={selectedConfig.descriptionPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
              <span>Mention specific hazards (e.g. deep puddle, traffic obstruction, dark spot)</span>
              <span>{description.length} chars</span>
            </div>
          </div>

          {/* Citizen Contact (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Citizen Name (Optional)
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Phone Number (For SMS updates)
              </label>
              <input
                type="tel"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            By submitting, your grievance is entered into the open civic database with initial status <span className="font-bold text-slate-700">"Submitted"</span>.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5 disabled:opacity-70 text-base"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Registering Complaint...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Complaint</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
