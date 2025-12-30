import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DiplomaSelection from './pages/DiplomaSelection';
import Dashboard from './pages/Dashboard';
import Scheduler from './pages/Scheduler';
import LandingPage from './pages/LandingPage';
import './index.css';

function App() {
  return (
    <Router>  
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/diploma-selection" element={<DiplomaSelection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>  
  );
}
export default App;
