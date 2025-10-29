import { useState, useEffect } from "react";
import './App.css'
import { db } from './lib/firebase.js'
import { collection, onSnapshot ,query, addDoc } from 'firebase/firestore'

function App() {
  const [post, setPost] = useState([])
  const [texto, setTexto] = useState("")

  useEffect(() => {
    //Creamos la consulta
    const consulta = query(collection(db, "post"));

    //Escuchamos los cambios en tiempo real
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
//Actualizar post
      setPost(docs);
    });

      //Limpiar unsubscribe
    return () => unsubscribe()

  }, [])

  //Agregar nuevo post
  //Funcion para agregar un mensaje
  const agregarPost = async () => {
    await addDoc(collection(db, "post"), {
      mensaje: texto,
      createAt: new Date(), //fecha actual
    });
    setTexto("") //Limpiar el input 
  }

  return (
    <div> 
      <h1>Lista de Posts</h1>
      {/* Input para escribir mensaje */}
      <input 
      className='border p-2 me-2'
        type="text" 
        placeholder="Escribe un nuevo post"
        value={texto} 
        onChange={(e) => setTexto(e.target.value)} 
        onKeyDown={(e) => e.key === "Enter" && agregarPost}
      />
      <button
      className="bg-blue-500 text-white px-3 py-2 rounded"
      onClick={agregarPost}>
        Guardar
        </button>

      <ul>
        {post.map((doc) => (
          <li key={doc.id}>
            <h2>{doc.mensaje}</h2>
            <p>{doc.autor}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App