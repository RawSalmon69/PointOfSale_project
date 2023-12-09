import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Package from './pages/Package';
import Home from './pages/Home';
import Login from './pages/Login';
import Product from './pages/Product';
import User from './pages/User';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Package/>,
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/home",
    element: <Home/>
  },
  {
    path: "/product",
    element: <Product/>
  },
  {
    path: "/user",
    element: <User/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();
 