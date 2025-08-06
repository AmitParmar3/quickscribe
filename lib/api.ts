// API configuration
const API_BASE_URL = 'http://localhost:8000'; // Your backend URL

// API Functions for QuickScribe
export class QuickScribeAPI {
  
  // Upload file to backend
  static async uploadFile(file: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  // Create assignment session with SRT file
  static async createAssignmentSession(file: File, sessionId?: string): Promise<{ session_id: string; file_id: number; message: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // Add session_id as header if provided
    if (sessionId) {
      headers['session_id'] = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}/assign/create-session`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Assignment session creation failed');
    }

    return response.json();
  }

  // Get file data for assignment editor
  static async getFileData(fileId: number): Promise<{ subtitles: SubtitleEntry[]; speakers: Speaker[] }> {
    const response = await fetch(`${API_BASE_URL}/assign/file/${fileId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file data');
    }

    return response.json();
  }

  // Save assignment data
  static async saveFileAssignments(fileId: number, speakers: Speaker[], subtitles: SubtitleEntry[]): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/assign/save/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speakers,
        subtitles
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save assignments');
    }

    return response.json();
  }

  // Translate file and get session_id
  static async translateFile(file: File, language: string, style: string): Promise<{ response: string; session_id: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        // Add language and style as headers if needed
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    return response.json();
  }

  // Get speakers for a session
  static async getSpeakers(sessionId: string): Promise<Speaker[]> {
    const response = await fetch(`${API_BASE_URL}/speakers`, {
      method: 'GET',
      headers: {
        'session_id': sessionId,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch speakers');
    }

    return response.json();
  }

  // Save speakers and assignments
  static async saveAssignments(sessionId: string, speakers: Speaker[], subtitles: SubtitleEntry[]): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/assignments/save`, {
      method: 'POST',
      headers: {
        'session_id': sessionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speakers,
        subtitles
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save assignments');
    }

    return response.json();
  }
}

// Types (you'll move these to a separate types file later)
export interface Speaker {
  id: number;
  name: string;
  color: string;
}

export interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text1: string;
  text2: string;
  speakerId?: number;
  lineSpeakers?: { [lineIndex: number]: number };
}