import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { diplomasData } from '../data/diplomaData';
import scheduleService from '../services/scheduleService';

function Scheduler() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState('');
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    const diploma = localStorage.getItem('selectedDiploma');
    if (!diploma) {
      navigate('/diploma-selection');
      return;
    }
    setSelectedDiploma(diploma);
    loadSessions();
    checkSyncStatus();
  }, [navigate, selectedDate]);

  const loadSessions = async () => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await scheduleService.getSessions(
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );

    if (result.success) {
      setSessions(result.sessions || []);
    }
  };

  const checkSyncStatus = () => {
    const status = scheduleService.getSyncStatus();
    setSyncStatus(status);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleNotifyMe = async (sessionId) => {
    const result = await scheduleService.enableNotifications(sessionId);
    if (result.success) {
      alert('✅ You will receive an email reminder 15 minutes before your session!');
      loadSessions();
    } else {
      alert('❌ Failed to enable notifications: ' + result.message);
    }
  };

  const handleDisableNotifications = async (sessionId) => {
    if (!window.confirm('Disable reminder for this session?')) return;
    
    const result = await scheduleService.disableNotifications(sessionId);
    if (result.success) {
      alert('🔕 Reminder disabled');
      loadSessions();
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Delete this session?')) return;
    
    const result = await scheduleService.deleteSession(sessionId);
    if (result.success) {
      loadSessions();
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile-Responsive Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">📅 Scheduler</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {syncStatus && syncStatus.hasPending ? (
                  <span className="text-orange-600">
                    ⚠️ {syncStatus.pendingCount} pending
                  </span>
                ) : (
                  <span className="text-green-600">✅ Synced</span>
                )}
              </p>
            </div>
            <Link
              to="/dashboard"
              className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition shrink-0"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile-Optimized Date Navigator */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-4 sm:mb-8">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePreviousDay}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
            >
              ←
            </button>
            
            <div className="text-center flex-1 min-w-0">
              <div className="hidden sm:block text-xl sm:text-2xl font-bold text-gray-900">
                {formatDate(selectedDate)}
              </div>
              <div className="sm:hidden text-base font-bold text-gray-900">
                {formatDateShort(selectedDate)}
              </div>
              {isToday(selectedDate) && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                  Today
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleToday}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
              >
                Today
              </button>
              <button
                onClick={handleNextDay}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Add Session Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isPast(selectedDate) && !isToday(selectedDate)}
            className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition ${
              isPast(selectedDate) && !isToday(selectedDate)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
            }`}
          >
            {isPast(selectedDate) && !isToday(selectedDate)
              ? '🚫 Cannot schedule in past'
              : '➕ Add Study Session'}
          </button>
        </div>

        {/* Mobile-Optimized Sessions List */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            📚 Sessions ({sessions.length})
          </h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📅</div>
              <div className="text-base sm:text-xl font-semibold text-gray-700 mb-2">
                No sessions
              </div>
              <div className="text-sm text-gray-500">Add a study session to start!</div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sessions.map((session) => (
                <div
                  key={session._id || session.id}
                  className={`border-2 rounded-lg p-4 sm:p-6 transition ${
                    session.status === 'completed'
                      ? 'bg-green-50 border-green-300'
                      : session.status === 'in_progress'
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <span className="text-lg sm:text-2xl font-bold text-gray-900 whitespace-nowrap">
                        ⏰ {session.startTime} - {session.endTime}
                      </span>
                      {session.status === 'completed' && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
                          ✅ Done
                        </span>
                      )}
                    </div>
                    
                    <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2 break-words">
                      📚 {session.courseName}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="truncate">🏷️ {session.diploma}</span>
                      <span className="whitespace-nowrap">⏱️ {session.plannedHours}h</span>
                      {session.actualHours > 0 && (
                        <span className="text-green-600 font-semibold whitespace-nowrap">
                          ✓ {session.actualHours}h done
                        </span>
                      )}
                    </div>
                    
                    {session.notes && (
                      <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-700 break-words">
                          📝 {session.notes}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* UPDATED: Only 15-minute notification */}
                  {session.notificationsEnabled ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-green-700 text-xs sm:text-sm font-semibold">
                          <span>🔔</span>
                          <span>Reminder Enabled</span>
                        </div>
                        <button
                          onClick={() => handleDisableNotifications(session._id || session.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          🔕 Turn Off
                        </button>
                      </div>
                      <div className="text-xs text-green-600">
                        {/* ONLY show 15-minute status */}
                        <div>📧 Email reminder 15 minutes before: {session.reminder15Sent ? '✅ Sent' : '⏰ Scheduled'}</div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNotifyMe(session._id || session.id)}
                      className="w-full py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg mb-3 text-sm sm:text-base"
                    >
                      🔔 Notify Me 
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteSession(session._id || session.id)}
                    className="w-full px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm sm:text-base"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSessionModal
          selectedDate={selectedDate}
          selectedDiploma={selectedDiploma}
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            setShowAddModal(false);
            loadSessions();
          }}
        />
      )}
    </div>
  );
}

// Mobile-Responsive Modal
function AddSessionModal({ selectedDate, selectedDiploma, onClose, onAdd }) {
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const courses = diplomasData[selectedDiploma]?.courses || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const course = courses.find(c => c.id === parseInt(selectedCourse));
    if (!course) {
      alert('Please select a course');
      setLoading(false);
      return;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffHours = (end - start) / (1000 * 60 * 60);

    if (diffHours <= 0) {
      alert('End time must be after start time');
      setLoading(false);
      return;
    }

    const sessionData = {
      date: selectedDate.toISOString(),
      startTime,
      endTime,
      courseId: course.id,
      courseName: course.name,
      diploma: course.diploma,
      plannedHours: Math.round(diffHours * 100) / 100,
      notes
    };

    const result = await scheduleService.createSession(sessionData);

    if (result.success) {
      alert('✅ Session scheduled!');
      onAdd();
    } else {
      alert('❌ Failed: ' + (result.message || 'Unknown error'));
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            📅 Add Session
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📚 Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                required
              >
                <option value="">Choose...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.diploma})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 Start
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 End
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                rows="3"
                placeholder="e.g., Watch videos 5-8"
              />
            </div>

            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Scheduling...' : '✓ Schedule'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2 sm:py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Scheduler;