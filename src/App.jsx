import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AlumnosAxios from './components/AlumnosAxios';
import AlumnosAlova from './components/AlumnosAlova';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <div className="container text-center mt-5">
              <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                  <h1 className="display-5 fw-bold">Sistema de Gestión de Alumnos</h1>
                  <p className="col-md-8 fs-4 mx-auto">
                    Esta aplicación demuestra el consumo de APIs utilizando dos librerías diferentes:
                    <strong> Axios</strong> y <strong> Alova</strong>.
                  </p>
                  <p>Seleccione una opción en la barra de navegación para comenzar.</p>
                </div>
              </div>
            </div>
          } />
          <Route path="/axios" element={<AlumnosAxios />} />
          <Route path="/alova" element={<AlumnosAlova />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
