import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './pages/Main/Main';
import Home from './pages/Main/Movie/Home/Home';
import View from './pages/Main/Movie/View/View';
import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';
import MovieContextProvider from './context/MovieContext';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/view/:movieId?',
        element: <View />,
      },
      {
        path: '/login', 
        element: <Login />,
      },
      {
        path: '/register', 
        element: <Register />,
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <MovieContextProvider>
        <RouterProvider router={router} />
      </MovieContextProvider>
    </div>
  );
}

export default App;