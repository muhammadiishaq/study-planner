import { useState } from 'react';
import reportService from '../services/reportService';

// Upload Report Modal Component with Backend Integration
function UploadReportModal({ onUpload, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await reportService.uploadReport(selectedFile);

      if (result.success) {
        setSuccess(result.message);
        
        // Show extracted data
        if (result.data && result.data.diplomaProgress) {
          const progressStr = Object.entries(result.data.diplomaProgress)
            .map(([diploma, progress]) => `${diploma}: ${progress}%`)
            .join(', ');
          setSuccess(`Report uploaded successfully! Extracted: ${progressStr}`);
        }

        // Call parent's onUpload if provided
        if (onUpload) {
          onUpload(result.data);
        }

        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(result.message || 'Failed to upload report');
      }
    } catch (err) {
      setError('An error occurred. Make sure backend is running on port 5003.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📤 Upload Daily Progress Report</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your AlNafi Progress Report (PDF)
            </label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept=".pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload the daily report PDF from AlNafi
            </p>
          </div>
          
          {selectedFile && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Selected:</span> {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>Note:</strong> The system will extract diploma progress percentages from your PDF and update your dashboard automatically. The PDF file will not be stored (saves storage space!).
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                loading || !selectedFile
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? 'Uploading...' : 'Upload Report'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadReportModal;
