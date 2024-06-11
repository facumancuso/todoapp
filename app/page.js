"use client";

// Importa el componente Todo, que probablemente renderiza una sola tarea individual.
import Todo from "@/components/Todo";

// Importa Axios para realizar solicitudes HTTP.
import axios from "axios";

// Importa los hooks useState y useEffect de React para manejar el estado local y efectos secundarios.
import { useEffect, useState } from "react";

// Importa ToastContainer y toast de react-toastify para mostrar notificaciones.
import { ToastContainer, toast } from "react-toastify";

// Importa estilos globales para react-toastify.
import "react-toastify/dist/ReactToastify.css";


// Define el componente funcional Home.
export default function Home() {
  // Inicializa el estado para almacenar los datos del formulario y los datos de las tareas.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);

// Función asíncrona para buscar todas las tareas.
const fechTodos = async () => {
  const response = await axios("/api");
  setTodoData(response.data.todos);
};

// Función duplicada para buscar todas las tareas, parece ser un error ya que tiene el mismo nombre que la anterior.
const fetchTodos = async () => {
  const response = await axios("/api");
  setTodoData(response.data.todos);
}


  // Función para eliminar una tarea por su ID.
const deleteTodo = async (id) => {
  const response = await axios.delete("/api", {
    params:{
        mongoId:id
    }
  })
  toast.error(response.data.message);
  fetchTodos(); // Refresca la lista de tareas después de eliminar una.
};


 // Función para marcar una tarea como completa.
const completeTodo = async (id) => {
  const response = await axios.put('/api',{}, {
    params:{
        mongoId:id
    }
  })
  toast.success(response.data.message);
  fetchTodos(); // Refresca la lista de tareas después de actualizar una.
};


// Hook useEffect para llamar a fechTodos cuando el componente se monta.
useEffect(() => {
  fechTodos();
}, []);


// Manejador de eventos para cambiar el valor de los campos del formulario.
const onChangeHandler = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  setFormData((form) => ({...form, [name]: value }));
};


// Manejador de envío del formulario para enviar los datos del formulario a la API.
const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api", formData);
    toast.success(response.data.message);
    setFormData({ title: "", description: "" }); // Resetea el formulario después de enviarlo.
    await fechTodos(); // Refresca la lista de tareas después de agregar una nueva.
  } catch (error) {
    toast.error("Error adding todo"); // Muestra un mensaje de error si algo sale mal.
  }
};


  return (
    <>
      <ToastContainer theme="dark" />
      <form
        onSubmit={onSubmitHandler}
        className="flex items-start flex-col gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto"
      >
        <input
          value={formData.title}
          onChange={onChangeHandler}
          type="text"
          name="title"
          placeholder="Enter title"
          className="px-3 py-2 border-2 w-full"
        />
        <textarea
          value={formData.description}
          onChange={onChangeHandler}
          name="description"
          placeholder="Enter description"
          className="px-3 py-2 border-2 w-full"
        ></textarea>
        <button
          onClick={onSubmitHandler}
          type="submit"
          className="bg-orange-600 py-3 px-11 text-white"
        >
          Add Todo
        </button>
      </form>

      <div className="relative overflow-x-auto mt-24 w-[60%] mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 white:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 white:bg-gray-700 white:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((item, index) => (
              <Todo
                key={index}
                id={index}
                title={item.title}
                description={item.description}
                complete={item.isCompleted}
                mongoId={item._id}
                deleteTodo={deleteTodo}
                completeTodo={completeTodo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
