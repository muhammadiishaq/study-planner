import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diplomasList } from '../data/diplomaData';
import authService from '../services/authService';

function DiplomaSelection() {
  const [selectedDiploma, setSelectedDiploma] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDiploma) {
      setError('Please select a diploma level');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await authService.updateLevel(selectedDiploma);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Failed to update diploma level');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to AlNafi Study Planner! 🎓</h1>
          <p className="text-gray-600">Select your diploma to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose Your Diploma Program
            </label>
            <div className="space-y-3">
              {diplomasList.map((diploma) => (
                <label
                  key={diploma.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedDiploma === diploma.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="diploma"
                      value={diploma.id}
                      checked={selectedDiploma === diploma.id}
                      onChange={(e) => setSelectedDiploma(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                      disabled={loading}
                    />
                    <div className="ml-3">
                      <span className="text-gray-900 font-medium block">{diploma.name}</span>
                      <span className="text-sm text-gray-500">{diploma.description}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedDiploma || loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 shadow-lg ${
              selectedDiploma && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DiplomaSelection;
