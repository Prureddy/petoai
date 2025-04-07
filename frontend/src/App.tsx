import 'regenerator-runtime/runtime';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import Home from './components/Home';
import ChatBot from './components/ChatBot';
import DietPlanner from './components/DietPlanner';
import HealthDashboard from './components/HealthDashboard';
import GamifiedRanking from './components/GamifiedRanking';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import PetProfileSetup from './components/auth/PetProfileSetup';
import ProtectedRoute from './components/ProtectedRoute';
import 'regenerator-runtime/runtime';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route 
          path="/chatbot" 
          element={
            <ProtectedRoute>
              <Layout><ChatBot /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/diet-planner" 
          element={
            <ProtectedRoute>
              <Layout><DietPlanner /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/health-dashboard" 
          element={
            <ProtectedRoute>
              <Layout><HealthDashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gamified-ranking" 
          element={
            <ProtectedRoute>
              <Layout><GamifiedRanking /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pet-profile-setup" 
          element={
            <ProtectedRoute>
              <PetProfileSetup />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
