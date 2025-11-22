import React, { useState, useEffect } from 'react';
import { useRequest } from 'alova/client';
import { alovaInstance } from '../services/api';

const GestionMatriculas = () => {
    const [formData, setFormData] = useState({
        alumnoId: '',
        cursoId: '',
        fechaMatricula: ''
    });
    const [editingId, setEditingId] = useState(null);

    // --- API Requests Definitions ---

    // GET requests
    const getAlumnos = alovaInstance.Get('/alumnos');
    const getCursos = alovaInstance.Get('/cursos');
    const getMatriculas = alovaInstance.Get('/matriculas');

    // POST request (Create)
    const createMatricula = (data) => alovaInstance.Post('/matriculas', data);

    // PUT request (Update)
    const updateMatricula = (id, data) => alovaInstance.Put(`/matriculas/${id}`, data);

    // DELETE request (Delete)
    const deleteMatricula = (id) => alovaInstance.Delete(`/matriculas/${id}`);


    // --- Hooks for Data Fetching ---

    // Fetch Alumnos
    const { data: alumnos, loading: loadingAlumnos } = useRequest(getAlumnos, {
        initialData: []
    });

    // Fetch Cursos
    const { data: cursos, loading: loadingCursos } = useRequest(getCursos, {
        initialData: []
    });

    // Fetch Matriculas (with manual reload capability)
    const { data: matriculas, loading: loadingMatriculas, send: reloadMatriculas } = useRequest(getMatriculas, {
        initialData: []
    });

    // --- Hooks for Mutations ---

    const { send: sendCreate } = useRequest(createMatricula, { immediate: false });
    const { send: sendUpdate } = useRequest(updateMatricula, { immediate: false });
    const { send: sendDelete } = useRequest(deleteMatricula, { immediate: false });


    // --- Handlers ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await sendUpdate(editingId, formData);
                alert('Matrícula actualizada correctamente');
            } else {
                await sendCreate(formData);
                alert('Matrícula creada correctamente');
            }
            // Reset form and reload table
            resetForm();
            reloadMatriculas();
        } catch (error) {
            console.error("Error saving matricula:", error);
            alert('Error al guardar la matrícula');
        }
    };

    const handleEdit = (matricula) => {
        setEditingId(matricula.id);
        setFormData({
            alumnoId: matricula.alumnoId,
            cursoId: matricula.cursoId,
            fechaMatricula: matricula.fechaMatricula
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta matrícula?')) {
            try {
                await sendDelete(id);
                alert('Matrícula eliminada');
                reloadMatriculas();
            } catch (error) {
                console.error("Error deleting matricula:", error);
                alert('Error al eliminar');
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            alumnoId: '',
            cursoId: '',
            fechaMatricula: ''
        });
    };

    // --- Helper to find names ---
    const getAlumnoName = (id) => {
        const alumno = alumnos.find(a => a.id === id || a.id === String(id));
        return alumno ? alumno.nombre : 'Desconocido';
    };

    const getCursoName = (id) => {
        const curso = cursos.find(c => c.id === id || c.id === String(id));
        return curso ? curso.nombre_curso : 'Desconocido';
    };

    if (loadingAlumnos || loadingCursos) return <div className="text-center mt-5">Cargando datos maestros...</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gestión de Matrículas</h2>

            {/* Section A: Formulario */}
            <div className="card mb-5 shadow-sm">
                <div className="card-header bg-secondary text-white">
                    {editingId ? 'Editar Matrícula' : 'Nueva Matrícula'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Alumno</label>
                                <select
                                    className="form-select"
                                    name="alumnoId"
                                    value={formData.alumnoId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un Alumno</option>
                                    {alumnos.map(alumno => (
                                        <option key={alumno.id} value={alumno.id}>
                                            {alumno.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Curso</label>
                                <select
                                    className="form-select"
                                    name="cursoId"
                                    value={formData.cursoId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un Curso</option>
                                    {cursos.map(curso => (
                                        <option key={curso.id} value={curso.id}>
                                            {curso.nombre_curso}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Fecha de Matrícula</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fechaMatricula"
                                    value={formData.fechaMatricula}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success">
                                {editingId ? 'Actualizar Matrícula' : 'Guardar Matrícula'}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                                    Cancelar Edición
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Section B: Tabla */}
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    Listado de Matrículas
                </div>
                <div className="card-body">
                    {loadingMatriculas ? (
                        <div className="text-center">Cargando matrículas...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Alumno</th>
                                        <th>Curso</th>
                                        <th>Fecha</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matriculas.length > 0 ? (
                                        matriculas.map(matricula => (
                                            <tr key={matricula.id}>
                                                <td>{matricula.id}</td>
                                                <td>{getAlumnoName(matricula.alumnoId)}</td>
                                                <td>{getCursoName(matricula.cursoId)}</td>
                                                <td>{matricula.fechaMatricula}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() => handleEdit(matricula)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(matricula.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">
                                                No hay matrículas registradas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GestionMatriculas;
