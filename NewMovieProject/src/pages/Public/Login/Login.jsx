import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');

  const navigate = useNavigate();

  const handleShowPassword = useCallback((event) => {
    event.preventDefault();
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
    try {
      const res = await axios.post('/admin/login', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      localStorage.setItem('accessToken', res.data.access_token);
      navigate('/main');
    } catch (error) {
      console.error(error);
      alert('Login failed. Please try again.');
    } finally {
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Login</h3>
        <form>
          <div className="form-container">
            <div className="form-group">
              <label>E-mail:</label>
              <input
                type="text"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, 'email')}
              />
              {debounceState && isFieldsDirty && email === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            
            <div className="form-group">
              <label>Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                name="password"
                ref={passwordRef}
                onChange={(e) => handleOnChange(e, 'password')}
              />
              {debounceState && isFieldsDirty && password === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <button className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </button>

            <div className="submit-container">
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={() => {
                  if (status !== 'loading') {
                    if (email && password) {
                      handleLogin();
                    } else {
                      setIsFieldsDirty(true);
                      if (email === '') emailRef.current.focus();
                      if (password === '') passwordRef.current.focus();
                    }
                  }
                }}
              >
                {status === 'idle' ? 'Login' : 'Loading'}
              </button>
            </div>
            <div className="register-container">
              <small>Don't have an account? </small>
              <Link to="/register">
                <small>Register</small>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
