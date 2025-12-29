import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { diplomasData } from '../data/diplomaData';
import authService from '../services/authService';
import reportService from '../services/reportService';
import scheduleService from '../services/scheduleService';
import UploadReportModal from '../components/UploadReportModal';

function Dashboard() {
  const navigate = useNavigate();
  const [selectedDiploma, setSelectedDiploma] = useState('');
  const [courses, setCourses] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDiplomaView, setSelectedDiplomaView] = useState(null);
  const [todaySessions, setTodaySessions] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [diplomaProgress, setDiplomaProgress] = useState({});

  // Load diploma and courses
  useEffect(() => {
    const diploma = localStorage.getItem('selectedDiploma');
    if (!diploma) {
      navigate('/diploma-selection');
      return;
    }
    setSelectedDiploma(diploma);
    
    const savedCourses = localStorage.getItem(`courses_${diploma}`);
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      const diplomaCourses = diplomasData[diploma].courses.map(course => ({
        ...course,
        completed: false,
        hoursCompleted: 0,
        deadline: null
      }));
      setCourses(diplomaCourses);
      localStorage.setItem(`courses_${diploma}`, JSON.stringify(diplomaCourses));
    }

    loadLatestProgress();
    loadTodaySessions();
    loadWeeklyStats();
  }, [navigate]);

  useEffect(() => {
    if (selectedDiploma && courses.length > 0) {
      localStorage.setItem(`courses_${selectedDiploma}`, JSON.stringify(courses));
    }
  }, [courses, selectedDiploma]);

  const loadLatestProgress = async () => {
    console.log('📊 Loading latest report from DATABASE...');
    
    // Clear cache first
    localStorage.removeItem('latestReportProgress');
    localStorage.removeItem('latestReportDate');
    
    const result = await reportService.getLatestReport();
    
    if (result.success && result.report && result.report.diplomaProgress) {
      console.log('✅ Latest report loaded:', result.report.diplomaProgress);
      setDiplomaProgress(result.report.diplomaProgress);
      
      // ✅ AUTO-MARK COURSES based on report progress
      autoMarkCoursesFromReport(result.report.diplomaProgress);
    } else {
      console.log('⚠️ No report found');
      setDiplomaProgress({});
    }
  };

  // ✅ NEW FUNCTION: Auto-mark courses based on report percentages
  const autoMarkCoursesFromReport = (reportProgress) => {
    console.log('🔄 Auto-marking courses from report...');
    
    setCourses(prevCourses => {
      const updatedCourses = prevCourses.map(course => {
        const diplomaName = course.diploma;
        const reportPercentage = reportProgress[diplomaName];
        
        if (reportPercentage && reportPercentage > 0) {
          // Get all courses for this diploma
          const diplomaCourses = prevCourses.filter(c => c.diploma === diplomaName);
          
          // Calculate how many courses should be marked complete
          const targetCompleteCount = Math.round((reportPercentage / 100) * diplomaCourses.length);
          
          // Get this course's index within its diploma
          const courseIndex = diplomaCourses.findIndex(c => c.id === course.id);
          
          // Mark as complete if within target
          if (courseIndex < targetCompleteCount) {
            return { ...course, completed: true };
          } else {
            return { ...course, completed: false };
          }
        }
        
        return course;
      });
      
      console.log('✅ Courses auto-marked:', updatedCourses.filter(c => c.completed).length, 'completed');
      return updatedCourses;
    });
  };

  const loadTodaySessions = async () => {
    const result = await scheduleService.getTodaySessions();
    if (result.success) {
      setTodaySessions(result.sessions || []);
    }
  };

  const loadWeeklyStats = async () => {
    const result = await scheduleService.getWeeklyStats();
    if (result.success) {
      setWeeklyStats(result.stats);
    }
  };

  // ✅ FIXED: Calculate from report progress
  const totalHours = diplomasData[selectedDiploma]?.totalHours || 0;
  const includes = diplomasData[selectedDiploma]?.includes || [];
  
  let completedCourses = 0;
  let completedHours = 0;
  
  if (Object.keys(diplomaProgress).length > 0) {
    // Use report progress for accurate calculation
    includes.forEach(diplomaName => {
      const diplomaCourses = courses.filter(c => c.diploma === diplomaName);
      const diplomaTotalHours = diplomaCourses.reduce((sum, c) => sum + c.hours, 0);
      const reportProgress = diplomaProgress[diplomaName] || 0;
      
      // Calculate hours from percentage
      completedHours += (reportProgress / 100) * diplomaTotalHours;
      
      // Calculate courses from percentage
      completedCourses += Math.round((reportProgress / 100) * diplomaCourses.length);
    });
  } else {
    // Fallback to manual completion
    completedHours = courses.reduce((sum, c) => sum + (c.completed ? c.hours : 0), 0);
    completedCourses = courses.filter(c => c.completed).length;
  }
  
  const totalCourses = courses.length;
  const remainingHours = totalHours - completedHours;
  const progressPercentage = totalHours > 0 ? ((completedHours / totalHours) * 100).toFixed(1) : 0;

  const diplomaBreakdown = {};
  
  includes.forEach(diplomaName => {
    const diplomaCourses = courses.filter(c => c.diploma === diplomaName);
    const completed = diplomaCourses.filter(c => c.completed).length;
    const totalHrs = diplomaCourses.reduce((sum, c) => sum + c.hours, 0);
    const completedHrs = diplomaCourses.reduce((sum, c) => sum + (c.completed ? c.hours : 0), 0);
    
    // Use report progress if available
    const reportProgress = diplomaProgress[diplomaName] || 0;
    
    // Calculate from report
    const calculatedCompletedCourses = reportProgress > 0 
      ? Math.round((reportProgress / 100) * diplomaCourses.length)
      : completed;
    
    const calculatedCompletedHours = reportProgress > 0
      ? (reportProgress / 100) * totalHrs
      : completedHrs;
    
    diplomaBreakdown[diplomaName] = {
      total: diplomaCourses.length,
      completed: calculatedCompletedCourses,
      totalHours: totalHrs,
      completedHours: calculatedCompletedHours,
      percentage: reportProgress > 0 ? reportProgress : (totalHrs > 0 ? ((completedHrs / totalHrs) * 100).toFixed(1) : 0),
      reportProgress: reportProgress
    };
  });

  const handleMarkComplete = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, completed: !course.completed }
        : course
    ));
  };

  const handleUploadReport = async (extractedData) => {
    if (extractedData && extractedData.diplomaProgress) {
      console.log('✅ Report uploaded successfully!');
      console.log('📊 Extracted progress:', extractedData.diplomaProgress);
      
      // Clear cache
      localStorage.removeItem('latestReportProgress');
      localStorage.removeItem('latestReportDate');
      
      // Update state
      setDiplomaProgress(extractedData.diplomaProgress);
      
      // ✅ Auto-mark courses based on report
      autoMarkCoursesFromReport(extractedData.diplomaProgress);
      
      // Show success message
      const progressMsg = Object.entries(extractedData.diplomaProgress)
        .map(([diploma, progress]) => `${diploma}: ${progress}%`)
        .join('\n');
      
      alert(`✅ Report Uploaded & Progress Updated!\n\nExtracted Progress:\n${progressMsg}\n\n✓ Courses automatically marked based on percentages!`);
      
      // Reload immediately
      window.location.reload();
    }
    setShowUploadModal(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/login');
    }
  };

  const handleChangeDiploma = () => {
    if (window.confirm('Changing diploma will reset your progress. Continue?')) {
      localStorage.removeItem(`courses_${selectedDiploma}`);
      localStorage.removeItem('selectedDiploma');
      navigate('/diploma-selection');
    }
  };

  const handleStartTimer = async (sessionId) => {
    const result = await scheduleService.startTimer(sessionId);
    if (result.success) {
      alert('⏱️ Timer started! Go study! 📚');
      loadTodaySessions();
    }
  };

  const getDisplayedCourses = () => {
    if (selectedDiplomaView) {
      return courses.filter(c => c.diploma === selectedDiplomaView);
    }
    return [];
  };

  const displayedCourses = getDisplayedCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AlNafi Study Planner</h1>
              <p className="text-sm text-gray-600">
                {diplomasData[selectedDiploma]?.name || 'Dashboard'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/scheduler" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                📅 Schedule Study
              </Link>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                📤 Upload Report
              </button>
              <button
                onClick={handleChangeDiploma}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                🔄 Change
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Progress</div>
            <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-500 mt-2">
              {completedHours.toFixed(1)} / {totalHours} hours
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Courses</div>
            <div className="text-3xl font-bold text-green-600">
              {completedCourses}/{totalCourses}
            </div>
            <div className="text-sm text-gray-500 mt-2">Completed</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Remaining</div>
            <div className="text-3xl font-bold text-orange-600">
              {remainingHours.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 mt-2">Hours left</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">This Week</div>
            <div className="text-3xl font-bold text-purple-600">
              {weeklyStats ? `${weeklyStats.completedHours}h` : '0h'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {weeklyStats ? `${weeklyStats.completedSessions} sessions` : 'No sessions'}
            </div>
          </div>
        </div>

        {/* Today's Schedule Widget */}
        {todaySessions.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 mb-8 border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">📅 Today's Schedule</h2>
              <Link to="/scheduler" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                View Full Calendar →
              </Link>
            </div>
            <div className="space-y-3">
              {todaySessions.slice(0, 3).map(session => (
                <div key={session._id} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">⏰ {session.startTime} - {session.endTime}</div>
                      <div className="text-sm text-gray-600 mt-1">📚 {session.courseName}</div>
                      <div className="text-xs text-gray-500">⏱️ {session.plannedHours} hours</div>
                    </div>
                    {session.status === 'not_started' && (
                      <button
                        onClick={() => handleStartTimer(session._id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        ▶ Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diploma Breakdown */}
        {includes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Diploma Progress 
              {Object.keys(diplomaProgress).length > 0 && (
                <span className="text-sm text-green-600 ml-2">(✅ From Latest Report)</span>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {includes.map((diplomaName) => {
                const breakdown = diplomaBreakdown[diplomaName];
                const isSelected = selectedDiplomaView === diplomaName;
                
                return (
                  <button
                    key={diplomaName}
                    onClick={() => setSelectedDiplomaView(isSelected ? null : diplomaName)}
                    className={`bg-white rounded-lg shadow-lg p-6 text-left transition-all transform hover:scale-105 ${
                      isSelected ? 'ring-4 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {diplomaName}
                        </div>
                        <div className="text-4xl font-bold text-blue-600">
                          {breakdown.percentage}%
                        </div>
                      </div>
                      {breakdown.reportProgress > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                          Report ✓
                        </span>
                      )}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${breakdown.percentage}%` }}
                      />
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>📚 {breakdown.completed}/{breakdown.total} courses</div>
                      <div>⏱️ {breakdown.completedHours.toFixed(1)}/{breakdown.totalHours} hrs</div>
                    </div>
                    
                    <div className="mt-3 text-sm font-semibold text-blue-600">
                      {isSelected ? '✓ Hide courses' : '👆 View courses'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Course List */}
        {selectedDiplomaView && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                📚 {selectedDiplomaView} - Courses
              </h2>
              <button
                onClick={() => setSelectedDiplomaView(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="space-y-3">
              {displayedCourses.map((course) => (
                <div
                  key={course.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    course.completed
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={course.completed}
                      onChange={() => handleMarkComplete(course.id)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className={`font-semibold ${course.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {course.name}
                      </div>
                      <div className="flex gap-3 mt-1 text-sm text-gray-600">
                        <span>⏱️ {course.hours} hrs</span>
                        <span>📁 {course.type}</span>
                      </div>
                    </div>
                  </div>
                  {course.completed && <span className="text-2xl">✅</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedDiplomaView && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">👆</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Click on any diploma card above to view its courses
            </div>
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadReportModal
          onUpload={handleUploadReport}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;