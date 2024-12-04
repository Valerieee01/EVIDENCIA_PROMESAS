const URL = 'http://127.0.0.1:3000/';
export const solicitud  = async (endpoint) => {
    const respuesta = await fetch(`${URL}${endpoint}`);
    return await respuesta.json();
}