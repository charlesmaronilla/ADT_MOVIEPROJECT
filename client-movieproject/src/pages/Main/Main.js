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
      setIsLoggingOut(true); 
      setTimeout(() => {
        localStorage.removeItem('accessToken');
        setIsLoggingOut(false); 
        navigate('/login'); 
      }, 3000); 
    }
  };

  useEffect(() => {
    // Navigate to login if accessToken is not present
    if (!accessToken) { 
      navigate('/login'); 
    }
  }, [accessToken, navigate]); 

  return (
    <div className="Main">
      <div className="container">
        <div className="navigation">
          <ul>
            <li>
              <button onClick={() => navigate('/home')}>
                Movies</button>
            </li>
            {accessToken ? (
              <li className="logout">
                <button onClick={handleLogout}>
                  Sign OUT</button>
              </li>
            ) : (
              <li className="login">
                <button onClick={() => navigate('/login')}>Sign IN</button>
              </li>
            )}
          </ul>
        </div>
        <div className="outlet">
          {isLoggingOut ? (
            <div className="loading-spinner"></div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;