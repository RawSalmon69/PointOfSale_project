import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Package from './pages/Package';
import Home from './pages/Home';
import Login from './pages/Login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Product from './pages/Product';

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
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();
 