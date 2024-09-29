import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';

function App() {
  const [token, setToken] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuth && location.pathname !== '/register' && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuth, location.pathname, navigate]);

  function ProtectedRoute({ isAuthenticated, children }) {
    if (!isAuthenticated) {
      return null;
    }
    return children;
  }

  return (
    <div>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route index element={
          <ProtectedRoute isAuthenticated={isAuth}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
