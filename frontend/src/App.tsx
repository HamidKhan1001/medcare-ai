// src/App.tsx
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { isLoggedIn, getUser, logout } from './services/api';

function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Auto login check
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
        setPage(user.role === 'doctor' ? 'doctor' : 'dashboard');
      }
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setPage(user.role === 'doctor' ? 'doctor' : 'dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setPage('home');
  };

  if (page === 'login') return (
    <Login onLogin={handleLogin} />
  );

  if (page === 'dashboard') return (
    <PatientDashboard
      user={currentUser}
      onLogout={handleLogout}
    />
  );

  if (page === 'doctor') return (
    <DoctorDashboard
      user={currentUser}
      onLogout={handleLogout}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="text-xl font-bold text-blue-900">MedCare AI</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setPage('login')}
            className="text-gray-600 hover:text-blue-900 font-medium">
            Login
          </button>
          <button
            onClick={() => setPage('login')}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🇵🇰 Pakistan's First AI Medical Platform
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Medical AI For
          <span className="text-blue-900"> Every Pakistani</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          AI-powered X-ray analysis, ECG reading,
          blood test interpretation and more.
          Free. Fast. In Urdu & English.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setPage('login')}
            className="bg-blue-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-800 transition">
            Start Free Analysis
          </button>
          <button className="border-2 border-blue-900 text-blue-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-4 gap-8 text-center">
          {[
            { num: "9",    label: "AI Modules" },
            { num: "3",    label: "AI Models" },
            { num: "24/7", label: "Available" },
            { num: "Free", label: "For Patients" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-2">{stat.num}</div>
              <div className="text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          9 Medical AI Modules
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: "🫁", title: "X-Ray Analysis",   desc: "Chest X-ray, MRI, CT scan analysis" },
            { icon: "🦴", title: "Bone Scan",         desc: "Fracture detection and bone disease" },
            { icon: "💓", title: "ECG Analyzer",      desc: "Heart rhythm and cardiac reports" },
            { icon: "🧪", title: "Blood Tests",       desc: "Complete blood report interpretation" },
            { icon: "🧠", title: "Mental Health",     desc: "PHQ-9, GAD-7 screening" },
            { icon: "🔍", title: "Diagnosis AI",      desc: "Symptom-based differential diagnosis" },
            { icon: "💊", title: "Prescription",      desc: "Handwritten prescription reader" },
            { icon: "📊", title: "Vital Signs",       desc: "BP, sugar, oxygen monitoring" },
            { icon: "🚨", title: "Emergency Aid",     desc: "Instant first aid guidance" },
          ].map((mod, i) => (
            <div key={i}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="text-4xl mb-4">{mod.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{mod.title}</h3>
              <p className="text-gray-500 text-sm">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="text-gray-400">
          MedCare AI — Syed Hassan Tayyab — Atomcamp Cohort 15 — 2026
        </p>
      </footer>
    </div>
  );
}

export default App;