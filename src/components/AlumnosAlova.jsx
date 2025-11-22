import React, { useState, useEffect } from 'react';
import { useRequest } from 'alova/client';
import { alovaInstance } from '../services/api';

const AlumnosAlova = () => {
    const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: '', email: '', curso_id: '' });

    // GET request: Recuperar alumnos
    const { loading, data: alumnos, error, send: reloadAlumnos } = useRequest(
        alovaInstance.Get('/alumnos', { cacheFor: 0 }),
        { initialData: [] }
    );

    // POST request: Registrar alumno
    const { send: createAlumno, loading: creating } = useRequest(
        (alumno) => alovaInstance.Post('/alumnos', alumno),
        { immediate: false }
    );

    const handleChange = (e) => {
        setNuevoAlumno({ ...nuevoAlumno, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAlumno(nuevoAlumno);
            setNuevoAlumno({ nombre: '', email: '', curso_id: '' });
            reloadAlumnos(); // Recargar la lista tras el éxito
        } catch (err) {
            console.error("Error creando alumno:", err);
        }
    };

    // useEffect para manejar efectos secundarios o logging (Requerimiento explícito)
    useEffect(() => {
        if (error) {
            console.error("Error en la petición Alova:", error);
        }
    }, [error]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gestión de Alumnos (Alova)</h2>

            {/* Formulario */}
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
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
                                <button type="submit" className="btn btn-success w-100" disabled={creating}>
                                    {creating ? 'Guardando...' : 'Registrar'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <h3>Lista de Alumnos</h3>
            {loading ? (
                <div className="alert alert-info">Cargando datos...</div>
            ) : (
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
                            {alumnos && alumnos.length > 0 ? (
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
            )}
        </div>
    );
};

export default AlumnosAlova;
