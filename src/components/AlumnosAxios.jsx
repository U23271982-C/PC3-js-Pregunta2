import React, { useState, useEffect } from 'react';
import { getAlumnos, createAlumno } from '../services/axiosService';

const AlumnosAxios = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: '', email: '', curso_id: '' });

    useEffect(() => {
        cargarAlumnos();
    }, []);

    const cargarAlumnos = async () => {
        try {
            const data = await getAlumnos();
            setAlumnos(data);
        } catch (error) {
            console.error("Error cargando alumnos:", error);
        }
    };

    const handleChange = (e) => {
        setNuevoAlumno({ ...nuevoAlumno, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAlumno(nuevoAlumno);
            setNuevoAlumno({ nombre: '', email: '', curso_id: '' });
            cargarAlumnos(); // Recargar lista
        } catch (error) {
            console.error("Error creando alumno:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gestión de Alumnos (Axios)</h2>

            {/* Formulario */}
            <div className="card mb-4">
                <div className="card-header bg-info text-white">
                    Registrar Nuevo Alumno
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    value={nuevoAlumno.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={nuevoAlumno.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label className="form-label">ID Curso</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="curso_id"
                                    value={nuevoAlumno.curso_id}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-2 mb-3 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100">Registrar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <h3>Lista de Alumnos</h3>
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Curso ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.length > 0 ? (
                            alumnos.map(alumno => (
                                <tr key={alumno.id}>
                                    <td>{alumno.id}</td>
                                    <td>{alumno.nombre}</td>
                                    <td>{alumno.email}</td>
                                    <td>{alumno.curso_id}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No hay alumnos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlumnosAxios;
