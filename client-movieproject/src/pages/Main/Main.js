import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/'); 
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, [accessToken]);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <Link to="/">Movies</Link>
            </li>
            {accessToken ? (
              <li className='logout'>
                <a href="/" onClick={handleLogout}>Logout</a> 
              </li>
            ) : (
              <li className='login'>
                <Link to="/login">Login</Link> 
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;