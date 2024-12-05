import { useEffect, useState, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const accessToken = useMemo(() => localStorage.getItem('accessToken'), []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setIsLoggingOut(true); // Set loading state
      setTimeout(() => {
        localStorage.removeItem('accessToken'); // Remove the access token
        setIsLoggingOut(false); // Reset loading state
        navigate('/login'); // Navigate to the login page
      }, 3000); // Delay of 3 seconds
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  return (
    <div className='Main'>
      <div className='header'>
        <div className='nav-container'>
          <button onClick={() => navigate('/main/dashboard')} className='navigate-button'>
            Dashboard
          </button>
          <button onClick={handleLogout} className='navigate-button'>
            Sign OUT
          </button>
        </div>
      </div>
      <div className='container'>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
      {isLoggingOut && <div className='loading-spinner'></div>}
    </div>
  );
}

export default Main;
