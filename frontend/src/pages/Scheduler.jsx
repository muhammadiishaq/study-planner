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

  // NOTIFICATION HANDLERS - IN THE RIGHT PLACE!
  const handleEnableNotifications = async (sessionId) => {
    const result = await scheduleService.enableNotifications(sessionId);
    if (result.success) {
      alert('✅ Notifications enabled! You will receive emails 15 and 5 minutes before your session.');
      loadSessions();
    } else {
      alert('❌ Failed to enable notifications: ' + result.message);
    }
  };

  const handleDisableNotifications = async (sessionId) => {
    if (!window.confirm('Disable email reminders for this session?')) return;
    
    const result = await scheduleService.disableNotifications(sessionId);
    if (result.success) {
      alert('🔕 Notifications disabled');
      loadSessions();
    } else {
      alert('❌ Failed to disable notifications');
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Study Scheduler</h1>
              <p className="text-sm text-gray-600">
                {syncStatus && syncStatus.hasPending ? (
                  <span className="text-orange-600">
                    ⚠️ {syncStatus.pendingCount} sessions pending sync
                  </span>
                ) : (
                  <span className="text-green-600">✅ All synced</span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousDay}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Previous
            </button>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatDate(selectedDate)}</div>
              {isToday(selectedDate) && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold">
                  Today
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleToday}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Today
              </button>
              <button
                onClick={handleNextDay}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isPast(selectedDate) && !isToday(selectedDate)}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
              isPast(selectedDate) && !isToday(selectedDate)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isPast(selectedDate) && !isToday(selectedDate)
              ? '🚫 Cannot schedule sessions in the past'
              : '➕ Add Study Session'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📚 Scheduled Sessions ({sessions.length})
          </h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <div className="text-xl font-semibold text-gray-700 mb-2">
                No sessions scheduled
              </div>
              <div className="text-gray-500">Add a study session to get started!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session._id || session.id}
                  className={`border-2 rounded-lg p-6 transition ${
                    session.status === 'completed'
                      ? 'bg-green-50 border-green-300'
                      : session.status === 'in_progress'
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ⏰ {session.startTime} - {session.endTime}
                        </span>
                        {session.status === 'completed' && (
                          <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-semibold">
                            ✅ Completed
                          </span>
                        )}
                      </div>
                      
                      <div className="text-lg font-semibold text-gray-800 mb-1">
                        📚 {session.courseName}
                      </div>
                      
                      <div className="flex gap-4 text-sm text-gray-600 mb-2">
                        <span>🏷️ {session.diploma}</span>
                        <span>⏱️ {session.plannedHours} hours planned</span>
                        {session.actualHours > 0 && (
                          <span className="text-green-600 font-semibold">
                            ✓ {session.actualHours} hours completed
                          </span>
                        )}
                      </div>
                      
                      {session.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-700">
                            📝 <span className="font-semibold">Notes:</span> {session.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* NOTIFICATION SECTION */}
                  {session.notificationsEnabled ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-green-700 text-sm font-semibold mb-2">
                        <span>🔔</span>
                        <span>Notifications Enabled</span>
                      </div>
                      <div className="text-xs text-green-600 space-y-1">
                        <div>• 15-min reminder: {session.reminder15Sent ? '✅ Sent' : '⏰ Scheduled'}</div>
                        <div>• 5-min reminder: {session.reminder5Sent ? '✅ Sent' : '⏰ Scheduled'}</div>
                      </div>
                      <button
                        onClick={() => handleDisableNotifications(session._id || session.id)}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 font-semibold"
                      >
                        🔕 Disable Notifications
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnableNotifications(session._id || session.id)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg mb-3"
                    >
                      🔔 Notify Me (15 & 5 min before)
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteSession(session._id || session.id)}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    🗑️ Delete Session
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
      alert('✅ Session scheduled successfully!');
      onAdd();
    } else {
      alert('❌ Failed to schedule session: ' + (result.message || 'Unknown error'));
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📅 Add Study Session</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📚 Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.diploma})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                placeholder="e.g., Complete videos 5-8"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Scheduling...' : '✓ Schedule Session'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
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