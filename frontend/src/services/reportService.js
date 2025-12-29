import API_BASE_URL from '../config/api';

class ReportService {
  
  // Upload PDF report
  async uploadReport(pdfFile) {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return { success: false, message: 'Please login first' };
      }

      const user = JSON.parse(userStr);
      
      const formData = new FormData();
      formData.append('report', pdfFile);
      formData.append('userId', user.id);

      const response = await fetch(`${API_BASE_URL.reports}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Save to localStorage for immediate access
        const diplomaProgress = data.data.diplomaProgress;
        localStorage.setItem('latestReportProgress', JSON.stringify(diplomaProgress));
        localStorage.setItem('latestReportDate', data.data.reportDate);
        
        console.log('✅ Report uploaded and saved to localStorage:', diplomaProgress);
        
        return { 
          success: true, 
          report: data.data,  // ✅ FIXED: Changed from "data" to "report"
          diplomaProgress: diplomaProgress
        };
      }

      return { success: false, message: data.message };

    } catch (error) {
      console.error('Upload report error:', error);
      return { success: false, message: error.message };
    }
  }

  // Get LATEST report for user (this is the key function!)
  async getLatestReport() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return { success: false, message: 'Please login first' };
      }

      const user = JSON.parse(userStr);

      // Fetch LATEST report from backend
      const response = await fetch(`${API_BASE_URL.reports}/latest/${user.id}`);
      const data = await response.json();

      if (data.success) {
        // Save to localStorage
        const diplomaProgress = data.data.diplomaProgress;
        localStorage.setItem('latestReportProgress', JSON.stringify(diplomaProgress));
        localStorage.setItem('latestReportDate', data.data.reportDate);
        
        console.log('✅ Latest report fetched:', diplomaProgress);
        
        return { 
          success: true, 
          report: data.data,  // ✅ FIXED: Changed from "data" to "report"
          diplomaProgress: diplomaProgress
        };
      }

      // If no report found, return empty progress
      return { 
        success: true, 
        report: { diplomaProgress: {} },  // ✅ FIXED: Changed from "data" to "report"
        diplomaProgress: {}
      };

    } catch (error) {
      console.error('Get latest report error:', error);
      
      // Fallback to localStorage
      const cached = localStorage.getItem('latestReportProgress');
      if (cached) {
        const diplomaProgress = JSON.parse(cached);
        return { 
          success: true, 
          report: { diplomaProgress },  // ✅ FIXED: Changed from "data" to "report"
          diplomaProgress,
          fromCache: true
        };
      }
      
      return { success: false, message: error.message };
    }
  }

  // Get report history
  async getReportHistory(limit = 30) {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return { success: false, message: 'Please login first' };
      }

      const user = JSON.parse(userStr);

      const response = await fetch(`${API_BASE_URL.reports}/history/${user.id}?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        return { success: true, reports: data.data };
      }

      return { success: false, message: data.message };

    } catch (error) {
      console.error('Get report history error:', error);
      return { success: false, message: error.message };
    }
  }

  // Get progress from localStorage (instant, no network)
  getCachedProgress() {
    try {
      const cached = localStorage.getItem('latestReportProgress');
      if (cached) {
        return JSON.parse(cached);
      }
      return {};
    } catch (error) {
      console.error('Error reading cached progress:', error);
      return {};
    }
  }

  // Clear cached progress
  clearCache() {
    localStorage.removeItem('latestReportProgress');
    localStorage.removeItem('latestReportDate');
  }
}

export default new ReportService();