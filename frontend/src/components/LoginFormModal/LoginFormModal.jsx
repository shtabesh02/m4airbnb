import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
//import { Navigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  //const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  //if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data);
        }
    });
  };

  //create a hanlder to log in demo user when demo button is clicked.
  const handleDemoLogin = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: 'adanesh', password: 'password2' }))
      .then(closeModal)
  }

  const handleDisableLogin = credential.length < 4 || password.length < 6

  return (
    <>
      <h1 className='login'>Log In</h1>
      <form className='form' onSubmit={handleSubmit}>
        {errors.message && (
          <p className='form-error-message'>The provided credentials were invalid</p>
        )}
        <label className='form-label'>
          <input className='form-input '
            type="text"
            value={credential}
            placeholder="Enter your username or email"
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='form-label'>
          <input className='form-input '
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className='login-form-button'
          type="submit"
          disabled={handleDisableLogin}
        >Log In</button>

        <button className='login-form-demo-login'
          type='button'
          onClick={handleDemoLogin}
        >
          Log in as Demo User
        </button>
      </form>
    </>

  );
}

export default LoginFormModal;
