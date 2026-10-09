import { Router, Request, Response } from 'express';
import { complaintStorage, DEPARTMENT_MAP, calculatePriority } from './storage.ts';
import { ComplaintStatus, IssueType, PriorityLevel } from '../src/types/complaint.ts';

export const apiRouter = Router();

// GET all complaints with optional query filters
apiRouter.get('/complaints', (req: Request, res: Response) => {
  try {
    let complaints = complaintStorage.getAll();
    const { status, issueType, priority, search } = req.query;

    if (status && typeof status === 'string' && status !== 'All') {
      complaints = complaints.filter((c) => c.status === status);
    }

    if (issueType && typeof issueType === 'string' && issueType !== 'All') {
      complaints = complaints.filter((c) => c.issueType === issueType);
    }

    if (priority && typeof priority === 'string' && priority !== 'All') {
      complaints = complaints.filter((c) => c.priority === priority);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      complaints = complaints.filter((c) =>
        c.complaintId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.locationAddress && c.locationAddress.toLowerCase().includes(q)) ||
        (c.landmark && c.landmark.toLowerCase().includes(q)) ||
        c.department.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Check nearby potential duplicates
apiRouter.get('/complaints/check-nearby', (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const issueType = req.query.issueType as IssueType;

    if (isNaN(lat) || isNaN(lon) || !issueType) {
      return res.status(400).json({ success: false, message: 'lat, lon and issueType are required' });
    }

    const duplicates = complaintStorage.findNearbyDuplicates(lat, lon, issueType);
    res.json({
      success: true,
      hasDuplicates: duplicates.length > 0,
      count: duplicates.length,
      duplicates,
    });
  } catch (error) {
    console.error('Error checking nearby complaints:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET complaint by ID (e.g. CC1024)
apiRouter.get('/complaints/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const complaint = complaintStorage.getById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint with ID "${id}" was not found. Please verify the ID.`,
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Error fetching complaint by ID:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST Create new complaint
apiRouter.post('/complaints', (req: Request, res: Response) => {
  try {
    const {
      issueType,
      description,
      image,
      latitude,
      longitude,
      locationAddress,
      landmark,
      citizenName,
      citizenPhone,
      priority,
    } = req.body;

    if (!issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Issue type and description are required.',
      });
    }

    const validTypes: IssueType[] = ['Pothole', 'Garbage', 'Drainage', 'Streetlight', 'Sanitation', 'Other'];
    if (!validTypes.includes(issueType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid issue type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude) || 12.9716;
    const lon = typeof longitude === 'number' ? longitude : parseFloat(longitude) || 77.5946;

    const result = complaintStorage.create({
      issueType,
      description,
      image,
      latitude: lat,
      longitude: lon,
      locationAddress,
      landmark,
      citizenName,
      citizenPhone,
      priority,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaintId: result.complaint.complaintId,
      complaint: result.complaint,
      nearbyDuplicates: result.nearbyDuplicates,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PATCH / PUT update complaint status
apiRouter.patch('/complaints/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comment, updatedBy, assignedOfficer } = req.body;

    const validStatuses: ComplaintStatus[] = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = complaintStorage.updateStatus(id, status, comment, updatedBy, assignedOfficer);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Complaint with ID "${id}" was not found.`,
      });
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      complaint: updated,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET aggregated statistics & metrics
apiRouter.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = complaintStorage.getStats();
    res.json({
      success: true,
      stats,
      departments: DEPARTMENT_MAP,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST Reset Demo Data
apiRouter.post('/reset-demo', (_req: Request, res: Response) => {
  try {
    complaintStorage.resetDemoData();
    res.json({
      success: true,
      message: 'Demo dataset reset successfully to initial complaints.',
    });
  } catch (error) {
    console.error('Error resetting demo data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
