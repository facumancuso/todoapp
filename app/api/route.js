// Importa la función ConnectDB desde el archivo de configuración de la base de datos.
import { ConnectDB } from "@/lib/config/db";

// Importa el modelo TodoModel que define la estructura de los documentos de la colección 'todos' en MongoDB.
import TodoModel from "@/lib/models/TodoModel";

// Importa NextResponse del paquete next/server para crear respuestas HTTP personalizadas.
import { NextResponse } from "next/server";

// Define una función asíncrona para conectar a la base de datos.
const LoadDB = async () => {
    await ConnectDB();
}

// Llama a la función LoadDB al inicio del script para asegurar que la conexión a la base de datos se establezca antes de ejecutar las demás funciones.
LoadDB();

// Función exportada para manejar solicitudes GET. Busca todos los documentos en la colección 'todos'.
export async function GET(request){
    // Utiliza el método find de TodoModel para obtener todos los documentos.
    const todos = await TodoModel.find({});
    // Retorna una respuesta JSON con los todos encontrados.
    return NextResponse.json({todos:todos})
}

// Función exportada para manejar solicitudes POST. Crea un nuevo documento en la colección 'todos'.
export async function POST(request){
    // Desestructura el título y la descripción del cuerpo de la solicitud.
    const {title, description} = await request.json();
    // Crea un nuevo documento en la colección 'todos' con el título y la descripción proporcionados.
    await  TodoModel.create({
        title,
        description
    })
    // Retorna una respuesta JSON indicando que el todo fue creado.
    return NextResponse.json({message: "Todo Created"})
}

// Función exportada para manejar solicitudes DELETE. Elimina un documento específico de la colección 'todos'.
export async function DELETE(request){
    // Obtiene el ID del documento a eliminar de los parámetros de búsqueda de la URL.
    const mongoId = await request.nextUrl.searchParams.get("mongoId")
    // Encuentra y elimina el documento por su ID.
    await TodoModel.findByIdAndDelete(mongoId);
    // Retorna una respuesta JSON indicando que el todo fue eliminado.
    return NextResponse.json({message: "Todo Deleted"})
}

// Función exportada para manejar solicitudes PUT. Actualiza el estado de completado de un documento específico en la colección 'todos'.
export async function PUT(request){
    // Obtiene el ID del documento a actualizar de los parámetros de búsqueda de la URL.
    const mongoId = await request.nextUrl.searchParams.get("mongoId")
    // Actualiza el campo 'isCompleted' del documento especificado a true.
    await TodoModel.findByIdAndUpdate(mongoId, {
        $set:{
            isCompleted:true
        }
    });
    // Retorna una respuesta JSON indicando que el todo fue marcado como completo.
    return NextResponse.json({message: "Todo Completed"})
}
