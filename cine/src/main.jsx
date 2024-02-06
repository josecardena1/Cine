import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import './App.css'
import Header from './componentes/Header';
import Inicio from './componentes/Inicio'; 
import Peliculas from './componentes/Peliculas'; 
import Footer from './componentes/Footer';





function AppLayout() {
  return <>
    <Header />
    <Outlet />
    <Footer />
  </>
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
  /*   errorElement: <ErrorPage />, */
    children: [{
      path: "/",
      element: < Inicio/>,
    },
    {
      path: "/films",
      element: <Peliculas />,
    }/* ,
    {
      path: "/filmDetails/:id",
      element: <FilmDetails/>,
      loader: filmDetailsLoader
    } */]
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
