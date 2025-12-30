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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    localStorage.removeItem('latestReportProgress');
    localStorage.removeItem('latestReportDate');
    
    const result = await reportService.getLatestReport();
    
    if (result.success && result.report && result.report.diplomaProgress) {
      setDiplomaProgress(result.report.diplomaProgress);
      autoMarkCoursesFromReport(result.report.diplomaProgress);
    } else {
      setDiplomaProgress({});
    }
  };

  const autoMarkCoursesFromReport = (reportProgress) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        const diplomaName = course.diploma;
        const reportPercentage = reportProgress[diplomaName];
        
        if (reportPercentage && reportPercentage > 0) {
          const diplomaCourses = prevCourses.filter(c => c.diploma === diplomaName);
          const targetCompleteCount = Math.round((reportPercentage / 100) * diplomaCourses.length);
          const courseIndex = diplomaCourses.findIndex(c => c.id === course.id);
          
          if (courseIndex < targetCompleteCount) {
            return { ...course, completed: true };
          } else {
            return { ...course, completed: false };
          }
        }
        
        return course;
      });
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

  const totalHours = diplomasData[selectedDiploma]?.totalHours || 0;
  const includes = diplomasData[selectedDiploma]?.includes || [];
  
  let completedCourses = 0;
  let completedHours = 0;
  
  if (Object.keys(diplomaProgress).length > 0) {
    includes.forEach(diplomaName => {
      const diplomaCourses = courses.filter(c => c.diploma === diplomaName);
      const diplomaTotalHours = diplomaCourses.reduce((sum, c) => sum + c.hours, 0);
      const reportProgress = diplomaProgress[diplomaName] || 0;
      
      completedHours += (reportProgress / 100) * diplomaTotalHours;
      completedCourses += Math.round((reportProgress / 100) * diplomaCourses.length);
    });
  } else {
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
    
    const reportProgress = diplomaProgress[diplomaName] || 0;
    
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
      localStorage.removeItem('latestReportProgress');
      localStorage.removeItem('latestReportDate');
      
      setDiplomaProgress(extractedData.diplomaProgress);
      autoMarkCoursesFromReport(extractedData.diplomaProgress);
      
      const progressMsg = Object.entries(extractedData.diplomaProgress)
        .map(([diploma, progress]) => `${diploma}: ${progress}%`)
        .join('\n');
      
      alert(`✅ Report Uploaded!\n\n${progressMsg}\n\n✓ Courses auto-marked!`);
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

  const getDisplayedCourses = () => {
    if (selectedDiplomaView) {
      return courses.filter(c => c.diploma === selectedDiplomaView);
    }
    return [];
  };

  const displayedCourses = getDisplayedCourses();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header with NEW COLORS */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: window.innerWidth < 640 ? '18px' : '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                AlNafi Study Planner
              </h1>
              <p style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', color: '#6B7280', margin: 0 }}>
                {diplomasData[selectedDiploma]?.name || 'Dashboard'}
              </p>
            </div>
            
            {/* Desktop Menu */}
            <div style={{ display: window.innerWidth < 768 ? 'none' : 'flex', gap: '8px' }}>
              <Link 
                to="/scheduler" 
                style={{ 
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                📅 Schedule
              </Link>
              <a
                href="https://alnafi.com/?al_aid=bbb8fe480970429"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                📚 Continue Study
              </a>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                📤 Upload
              </button>
              <button
                onClick={handleChangeDiploma}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🔄 Change
              </button>
              <button
                onClick={handleLogout}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🚪 Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                display: window.innerWidth < 768 ? 'block' : 'none',
                padding: '8px',
                color: '#6B7280',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && window.innerWidth < 768 && (
            <div style={{ marginTop: '12px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link 
                to="/scheduler" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                📅 Schedule Study
              </Link>
              <a
                href="https://alnafi.com/?al_aid=bbb8fe480970429"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                📚 Continue Study
              </a>
              <button
                onClick={() => {
                  setShowUploadModal(true);
                  setShowMobileMenu(false);
                }}
                style={{ 
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                📤 Upload Report
              </button>
              <button
                onClick={handleChangeDiploma}
                style={{ 
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🔄 Change Diploma
              </button>
              <button
                onClick={handleLogout}
                style={{ 
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: window.innerWidth < 640 ? '16px 12px' : '32px 24px' }}>
        {/* Statistics Cards with NEW COLORS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: window.innerWidth < 640 ? '12px' : '24px',
          marginBottom: window.innerWidth < 640 ? '24px' : '32px'
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: window.innerWidth < 640 ? '16px' : '24px' }}>
            <div style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', fontWeight: 500, color: '#6B7280', marginBottom: window.innerWidth < 640 ? '4px' : '8px' }}>
              Total Progress
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '24px' : '30px', fontWeight: 'bold', color: '#6366F1' }}>
              {progressPercentage}%
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px', color: '#9CA3AF', marginTop: window.innerWidth < 640 ? '4px' : '8px' }}>
              {completedHours.toFixed(1)}/{totalHours}h
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: window.innerWidth < 640 ? '16px' : '24px' }}>
            <div style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', fontWeight: 500, color: '#6B7280', marginBottom: window.innerWidth < 640 ? '4px' : '8px' }}>
              Courses
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '24px' : '30px', fontWeight: 'bold', color: '#10B981' }}>
              {completedCourses}/{totalCourses}
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px', color: '#9CA3AF', marginTop: window.innerWidth < 640 ? '4px' : '8px' }}>
              Done
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: window.innerWidth < 640 ? '16px' : '24px' }}>
            <div style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', fontWeight: 500, color: '#6B7280', marginBottom: window.innerWidth < 640 ? '4px' : '8px' }}>
              Remaining
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '24px' : '30px', fontWeight: 'bold', color: '#F97316' }}>
              {remainingHours.toFixed(1)}
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px', color: '#9CA3AF', marginTop: window.innerWidth < 640 ? '4px' : '8px' }}>
              Hours
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: window.innerWidth < 640 ? '16px' : '24px' }}>
            <div style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', fontWeight: 500, color: '#6B7280', marginBottom: window.innerWidth < 640 ? '4px' : '8px' }}>
              This Week
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '24px' : '30px', fontWeight: 'bold', color: '#8B5CF6' }}>
              {weeklyStats ? `${weeklyStats.completedHours}h` : '0h'}
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px', color: '#9CA3AF', marginTop: window.innerWidth < 640 ? '4px' : '8px' }}>
              {weeklyStats ? `${weeklyStats.completedSessions} done` : 'No data'}
            </div>
          </div>
        </div>

        {/* Rest of the component stays the same... */}
        {/* (Today's sessions, diploma breakdown, course list) */}
        {/* I'll keep the logic but won't repeat all the code here */}
        
        {/* Today's Schedule Widget */}
        {todaySessions.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: window.innerWidth < 640 ? '16px' : '24px',
            marginBottom: window.innerWidth < 640 ? '24px' : '32px',
            border: '1px solid #C7D2FE'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: window.innerWidth < 640 ? '12px' : '16px' }}>
              <h2 style={{ fontSize: window.innerWidth < 640 ? '16px' : '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                📅 Today
              </h2>
              <Link to="/scheduler" style={{ color: '#6366F1', fontWeight: 600, fontSize: window.innerWidth < 640 ? '12px' : '14px', textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: window.innerWidth < 640 ? '8px' : '12px' }}>
              {todaySessions.slice(0, 3).map(session => (
                <div key={session._id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: window.innerWidth < 640 ? '12px' : '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight: 600, fontSize: window.innerWidth < 640 ? '14px' : '16px', color: '#111827' }}>
                    ⏰ {session.startTime} - {session.endTime}
                  </div>
                  <div style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', color: '#6B7280', marginTop: '4px' }}>
                    📚 {session.courseName}
                  </div>
                  <div style={{ fontSize: window.innerWidth < 640 ? '11px' : '12px', color: '#9CA3AF' }}>
                    ⏱️ {session.plannedHours}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diploma Progress */}
        {includes.length > 0 && (
          <div style={{ marginBottom: window.innerWidth < 640 ? '24px' : '32px' }}>
            <h2 style={{ fontSize: window.innerWidth < 640 ? '18px' : '24px', fontWeight: 'bold', color: '#111827', marginBottom: window.innerWidth < 640 ? '12px' : '16px' }}>
              📊 Progress
              {Object.keys(diplomaProgress).length > 0 && (
                <span style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', color: '#10B981', marginLeft: '8px' }}>
                  (✅ Report)
                </span>
              )}
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: window.innerWidth < 640 ? '12px' : '24px'
            }}>
              {includes.map((diplomaName) => {
                const breakdown = diplomaBreakdown[diplomaName];
                const isSelected = selectedDiplomaView === diplomaName;
                
                return (
                  <button
                    key={diplomaName}
                    onClick={() => setSelectedDiplomaView(isSelected ? null : diplomaName)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: window.innerWidth < 640 ? '16px' : '24px',
                      textAlign: 'left',
                      border: isSelected ? '2px solid #6366F1' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: window.innerWidth < 640 ? '8px' : '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: window.innerWidth < 640 ? '12px' : '14px', fontWeight: 500, color: '#6B7280', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {diplomaName}
                        </div>
                        <div style={{ fontSize: window.innerWidth < 640 ? '30px' : '36px', fontWeight: 'bold', color: '#6366F1' }}>
                          {breakdown.percentage}%
                        </div>
                      </div>
                      {breakdown.reportProgress > 0 && (
                        <span style={{ padding: '4px 8px', backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', borderRadius: '9999px', fontWeight: 600, flexShrink: 0 }}>
                          ✓
                        </span>
                      )}
                    </div>
                    
                    <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '9999px', height: window.innerWidth < 640 ? '8px' : '12px', marginBottom: window.innerWidth < 640 ? '8px' : '12px' }}>
                      <div
                        style={{
                          background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                          height: '100%',
                          borderRadius: '9999px',
                          width: `${breakdown.percentage}%`,
                          transition: 'width 0.3s'
                        }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: window.innerWidth < 640 ? '12px' : '14px', color: '#6B7280' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📚 {breakdown.completed}/{breakdown.total} courses
                      </div>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        ⏱️ {breakdown.completedHours.toFixed(1)}/{breakdown.totalHours}h
                      </div>
                    </div>
                    
                    <div style={{ marginTop: window.innerWidth < 640 ? '8px' : '12px', fontSize: window.innerWidth < 640 ? '12px' : '14px', fontWeight: 600, color: '#6366F1' }}>
                      {isSelected ? '✓ Hide' : '👆 View'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Course List */}
        {selectedDiplomaView && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: window.innerWidth < 640 ? '16px' : '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: window.innerWidth < 640 ? '16px' : '24px' }}>
              <h2 style={{ fontSize: window.innerWidth < 640 ? '16px' : '24px', fontWeight: 'bold', color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                📚 {selectedDiplomaView}
              </h2>
              <button
                onClick={() => setSelectedDiplomaView(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: '8px'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: window.innerWidth < 640 ? '8px' : '12px' }}>
              {displayedCourses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px',
                    padding: window.innerWidth < 640 ? '12px' : '16px',
                    borderRadius: '8px',
                    border: `2px solid ${course.completed ? '#D1FAE5' : '#E5E7EB'}`,
                    backgroundColor: course.completed ? '#ECFDF5' : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={course.completed}
                    onChange={() => handleMarkComplete(course.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#6366F1',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: window.innerWidth < 640 ? '4px' : '0'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: window.innerWidth < 640 ? '14px' : '16px',
                      fontWeight: 600,
                      color: course.completed ? '#6B7280' : '#111827',
                      textDecoration: course.completed ? 'line-through' : 'none',
                      wordWrap: 'break-word'
                    }}>
                      {course.name}
                    </div>
                    <div style={{ display: 'flex', gap: window.innerWidth < 640 ? '8px' : '12px', marginTop: '4px', fontSize: window.innerWidth < 640 ? '12px' : '14px', color: '#6B7280', flexWrap: 'wrap' }}>
                      <span style={{ whiteSpace: 'nowrap' }}>⏱️ {course.hours}h</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📁 {course.type}</span>
                    </div>
                  </div>
                  {course.completed && <span style={{ fontSize: window.innerWidth < 640 ? '20px' : '24px', flexShrink: 0 }}>✅</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedDiplomaView && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: window.innerWidth < 640 ? '16px' : '24px', textAlign: 'center' }}>
            <div style={{ fontSize: window.innerWidth < 640 ? '32px' : '48px', marginBottom: window.innerWidth < 640 ? '8px' : '12px' }}>
              👆
            </div>
            <div style={{ fontSize: window.innerWidth < 640 ? '14px' : '18px', fontWeight: 600, color: '#111827' }}>
              Click any diploma to view courses
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