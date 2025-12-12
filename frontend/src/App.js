import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

import CompanyRegister from './components/CompanyRegister';
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import UserSignup from './components/UserSignup';
import UserLogin from './components/UserLogin';
import AdConsentRegister from './components/AdConsentRegister';
import AdConsentList from './components/AdConsentList';
import UserConsentList from './components/UserConsentList';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (type, userData) => {
    setIsLoggedIn(true);
    setUserType(type);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
    localStorage.setItem('userData', JSON.stringify(userData));
    navigate(type === 'user' ? '/user/consent/list' : '/admin/consent/list');
  };

  const handleLogout = () => {
    if(window.confirm('로그아웃 하시겠습니까?')) {
      setIsLoggedIn(false);
      setUserType(null);
      localStorage.clear();
      navigate('/');
    }
  };

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedType = localStorage.getItem('userType');
    if (storedLogin === 'true' && storedType) {
      setIsLoggedIn(true);
      setUserType(storedType);
    }
  }, []);


  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            광고성 수신 동의 내역 통합 관리
          </Link>
        </h1>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            !isLoggedIn ? (
              <LandingPage />
            ) : (
              <div className="text-center py-10">
                <p>로그인 상태입니다. 메뉴를 선택해주세요.</p>
              </div>
            )
          } />

          <Route path="/auth/user" element={<AuthContainer type="user" onLogin={handleLogin} />} />
          <Route path="/auth/admin" element={<AuthContainer type="admin" onLogin={handleLogin} />} />

          <Route path="/super/register-company" element={<CompanyRegister />} />

          <Route path="/admin/consent/register" element={userType === 'admin' ? <AdConsentRegister /> : <Forbidden />} />
          <Route path="/admin/consent/list" element={userType === 'admin' ? <AdConsentList /> : <Forbidden />} />

          <Route path="/user/consent/list" element={userType === 'user' ? <UserConsentList /> : <Forbidden />} />
        </Routes>

        {isLoggedIn && (
          <nav className="dashboard-nav">
            {userType === 'admin' && (
              <>
                <Link to="/admin/consent/list" className="nav-link">📋 전체 내역 조회</Link>
                <Link to="/admin/consent/register" className="nav-link">➕ 수신 동의 등록</Link>
              </>
            )}
            {userType === 'user' && (
              <Link to="/user/consent/list" className="nav-link">📋 내 수신 동의 관리</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">로그아웃</button>
          </nav>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 Ad Consent Management System. All rights reserved.</p>
        <Link to="/super/register-company" className="super-admin-link">
          기업 등록이 필요하시면 여기를 눌러주세요
        </Link>
      </footer>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="role-selection-container">
      <div className="role-card" onClick={() => navigate('/auth/user')}>
        <span className="role-icon">👤</span>
        <h2 className="role-title">일반 사용자</h2>
        <p className="role-desc">나의 수신 동의 내역을<br/>조회하고 관리합니다.</p>
      </div>
      <div className="role-card" onClick={() => navigate('/auth/admin')}>
        <span className="role-icon">🏢</span>
        <h2 className="role-title">기업 관리자</h2>
        <p className="role-desc">고객의 동의 내역을<br/>등록하고 관리합니다.</p>
      </div>
    </div>
  );
};

const AuthContainer = ({ type, onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const title = type === 'user' ? '일반 사용자' : '기업 관리자';

  return (
    <div className="auth-container">
      <button onClick={() => navigate('/')} className="back-button" style={{margin: '1rem'}}>
        ← 뒤로 가기
      </button>
      
      <div className="auth-tabs">
        <button 
          className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          로그인
        </button>
        <button 
          className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          회원가입
        </button>
      </div>

      <div className="auth-body">
        <h2 className="text-xl font-bold mb-4 text-center">{title} {activeTab === 'login' ? '로그인' : '회원가입'}</h2>
        
        {type === 'user' && activeTab === 'login' && <UserLogin onLogin={(data) => onLogin('user', data)} />}
        {type === 'user' && activeTab === 'signup' && <UserSignup />}
        
        {type === 'admin' && activeTab === 'login' && <AdminLogin onLogin={(data) => onLogin('admin', data)} />}
        {type === 'admin' && activeTab === 'signup' && <AdminSignup />}
      </div>
    </div>
  );
};

const Forbidden = () => (
  <div className="text-center text-red-500 font-bold p-10">
    접근 권한이 없습니다.
  </div>
);

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;