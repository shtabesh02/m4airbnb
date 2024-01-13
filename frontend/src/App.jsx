// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage/LoginFormPage';

import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <div className='app-container'>
      {isLoaded && <Outlet />}
      {/* <Outlet />
          just to check the login page. because if the page is logged in,
          it automatically navigate to home */}
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: 'login',
        element: <LoginFormPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;