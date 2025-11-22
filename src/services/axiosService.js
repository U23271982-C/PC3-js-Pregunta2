import { axiosInstance } from './api';

export const getAlumnos = async () => {
    const response = await axiosInstance.get('/alumnos');
    return response.data;
};

export const createAlumno = async (alumno) => {
    const response = await axiosInstance.post('/alumnos', alumno);
    return response.data;
};
