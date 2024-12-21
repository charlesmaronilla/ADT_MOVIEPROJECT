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
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  return ( 
  <div className='Main'> 
  <div className='header'> 
    <div className='nav-container'> 
      <button onClick={() => navigate('/main/dashboard')} 
      className='navigate-button'> Dashboard </button> 
      <button onClick={() => { handleLogout(); navigate('/login'); }}
       className='navigate-button'> 
       Sign Out </button> 
       </div> </div> 
       <div className='container'> 
        <div className='outlet'> <Outlet /> 
        </div> </div> {isLoggingOut && <div className='loading-spinner'> </div>} </div> 
        );
}

export default Main;
