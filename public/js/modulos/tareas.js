import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../modulos/funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
   
    tareas.addEventListener('click', e => {
        //console.log(e.target.classList);
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia => /tareas:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, {idTarea} )
                .then( respuesta => {
                    
                    if(respuesta.status === 200) {
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }

        if (e.target.classList.contains('fa-trash')) {
            
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

                  Swal.fire({
                    title: '¿Deseas eliminar esta tarea?',
                    text: "Una tarea eliminada, no se puede recuperar.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'No, cancelar.',
                    confirmButtonText: 'Si, eliminar tarea.'
                })
                
                .then((result) => {
                    if (result.value) {
                        
                        const url = `${location.origin}/tareas/${idTarea}`;
                        
                        axios.delete( url, { params: { idTarea } })
                            .then( respuesta =>{
                                
                                if (respuesta.status === 200) {
                                    
                                    //Eliminar nodo html
                                    tareaHTML.parentElement.removeChild(tareaHTML);

                                    Swal.fire(
                                        '!Tarea!',
                                        respuesta.data,
                                        'success'
                                    );

                                    actualizarAvance();

                                }
                            });
                    }
                })
        }
    });
}

export default tareas;