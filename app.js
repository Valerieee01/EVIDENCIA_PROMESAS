import { solicitud } from "./modulo.js";


const cargarUserCiudad = async () => {
    const ciudades = await solicitud('ciudades');
    const respuesta = await Promise.all(
        ciudades.map(async (ciudad) => {
            const usuarios = await solicitud(`usuarios?cityId=${ciudad.id}`);
            console.log(`Usuarios ciudad ${ciudad.name}:` );
            console.log(usuarios);
            return {usuarios}
        })
    )
    return respuesta;
}

cargarUserCiudad()
//     .then((a) => {
//     console.log(a);
// })

const cargarMateriasUser = async () => {
  
    const users = await solicitud('usuarios');
    const respuesta = await Promise.all(
        users.map(async (user) => {
           const materias_usuarios = await solicitud(`materia_usuario?userId=${user.id}`); 
           const materias = await Promise.all(
            materias_usuarios.map(async (materia) => {
                const materiaNombre = await solicitud(`materias?id=${materia.subjectId}`);
                return materiaNombre; 
            })
        );
        return { ...user, materias };
    })
);
    return respuesta;
}

cargarMateriasUser().then((a) => {
    console.log('Materias de cada usuarios');
    console.log(a);
    
})

const cargarPromedioMateriasPorUser = async () => {
    const users = await solicitud('usuarios');
  
    const respuesta = await Promise.all(
      users.map(async (user) => {
        const materias_usuarios = await solicitud(`materia_usuario?userId=${user.id}`);
  
        const materias = await Promise.all(
          materias_usuarios.map(async (materia) => {
            const materiaNombre = await solicitud(`materias?id=${materia.subjectId}`);
            const nombreMateria = materiaNombre.length > 0 ? materiaNombre[0].name : 'Desconocida';
  
            const notasMateria = await solicitud(`notas?subjectUserId=${materia.subjectId}&userId=${user.id}`);
            
            let sumaNotas = 0;
            let contadorNotas = 0;
  
            // Iteramos sobre las notas de la materia
            for (const nota of notasMateria) {
              const score = parseFloat(nota.score); 
              if (!isNaN(score)) {  
                sumaNotas += score;
                contadorNotas++;  
              }
            }
  
            const promedio = contadorNotas > 0 ? (sumaNotas / contadorNotas).toFixed(2) : 0;
  
            return { materia: nombreMateria, promedio, notas: notasMateria };
          })
        );
  
        return { ...user, materias };
      })
    );
  
    return respuesta;
  };
  
  cargarPromedioMateriasPorUser().then((a) => {
    console.log('Notas por usuario y materia');
    console.log(a);
  });


  const cargarUsersConMaterias = async () => {
    const users = await solicitud('usuarios');
    const respuesta = await Promise.all(
        users.map(async (user) => {
            const materias_usuarios = await solicitud(`materia_usuario?userId=${user.id}`);
            const materias = await Promise.all(
                materias_usuarios.map(async (materia) => {
                    const materiaNombre = await solicitud(`materias?id=${materia.subjectId}`);
                    return materiaNombre;
                })
            );
            return { ...user, materias };
        })
    );
    
    const usuariosConMaterias = respuesta.filter(user => user.materias.length > 0);
    return usuariosConMaterias;
}

cargarUsersConMaterias().then((usuarios) => {
    console.log('Usuarios con materias');
    console.log(usuarios);
})