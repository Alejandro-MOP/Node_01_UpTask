import Swal from 'sweetalert2';
import axios from 'axios';


const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar){

    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;//console.log(urlProyecto);

        
        Swal.fire({
            title: '¿Deseas eliminar el proyecto?',
            text: "Un proyecto eliminado, no se puede recuperar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No, cancelar.',
            confirmButtonText: 'Si, eliminar proyecto.'
        })
        
        .then((result) => {
            if (result.value) {
                //Peticion axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;//console.log(url);

                axios.delete(url, { params: { urlProyecto } })
                    .then( respuesta => {
                        
                        Swal.fire(
                            '!Eliminado!',
                            respuesta.data,
                            'success'
                        );

                        //redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1500);
                    
                    })
                    .catch( () => {
                        
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto, intenta más tarde',
                            
                        })
                    })
            }
        })
    });

}

export default btnEliminar;


