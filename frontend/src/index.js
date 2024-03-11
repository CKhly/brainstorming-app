import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Landing from './Landing';
import 'bootstrap/dist/css/bootstrap.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    basename: "/bs",
    path: "/:id",
    element: <App />,
  },  
  {
    path: "/me",
    element: <App />,
  },
  {
    path: "/tc",
    element: <App />,
  },
  {
    path: "/fc",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider  router={router} />
  </React.StrictMode>
);

