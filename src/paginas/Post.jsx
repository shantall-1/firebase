import { useState, useEffect } from "react";
import { db } from './lib/firebase.js';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function Post() {
  const [post, setPost] = useState([]);
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consulta = query(collection(db, "post"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPost(docs);
    });
    return () => unsubscribe();
  }, []);

  // Abrir modal para agregar autor al nuevo post
  const abrirModal = () => {
    if (texto.trim() === "") {
      setError("⚠️ Por favor escribe un mensaje antes de enviarlo.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  // Guardar nuevo post con fecha y hora
  const guardarPost = async () => {
    const fecha = new Date();
    await addDoc(collection(db, "post"), {
      mensaje: texto,
      autor: autor.trim() || "Anónimo 🌸",
      createdAt: fecha, // 🕒 Nuevo: guardamos la fecha completa
    });
    setTexto("");
    setAutor("");
    setShowModal(false);
  };

  // Eliminar post
  const eliminarPost = async (id) => {
    await deleteDoc(doc(db, "post", id));
  };

  // Guardar cambios en edición inline
  const guardarEdicion = async (id, nuevoTexto) => {
    await updateDoc(doc(db, "post", id), { mensaje: nuevoTexto });
  };

  // Componente principal
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-purple-700 mb-6 drop-shadow-sm">
        🌷 Lista de Posts 🌷
      </h1>

      {/* Input para escribir nuevo post */}
      <div className="flex flex-col items-center gap-3 mb-8 bg-white p-4 rounded-2xl shadow-md border border-purple-200">
        <div className="flex items-center gap-3">
          <input
            className="border border-purple-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none w-64"
            type="text"
            placeholder="Escribe un nuevo post 💭"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && abrirModal()}
          />
          <button
            className="bg-linear-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
            onClick={abrirModal}
          >
            Guardar 💌
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium mt-2 bg-red-50 border border-red-200 px-3 py-1 rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* Modal para autor */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">💁 Agregar autor</h2>
            <input
              type="text"
              className="border border-purple-300 rounded-xl px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              placeholder="Escribe tu nombre o déjalo vacío 🌸"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={guardarPost}
                className="bg-linear-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition duration-300"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-400 transition duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de posts */}
      <ul className="w-full max-w-md space-y-4">
        {post.map((doc) => (
          <EditablePost key={doc.id} doc={doc} onDelete={eliminarPost} onSave={guardarEdicion} />
        ))}
      </ul>
    </div>
  );
}

// ✅ Componente para edición inline
function EditablePost({ doc, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nuevoTexto, setNuevoTexto] = useState(doc.mensaje);

  const handleSave = async () => {
    if (nuevoTexto.trim() === "") return;
    await onSave(doc.id, nuevoTexto);
    setIsEditing(false);
  };

  // 🕒 Nuevo: convertir timestamp a texto legible
  const fecha = doc.createdAt?.toDate
    ? doc.createdAt.toDate()
    : new Date(doc.createdAt);
  const fechaFormateada = fecha.toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <li className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition duration-300 flex justify-between items-center">
      <div className="flex-1 mr-3">
        {isEditing ? (
          <input
            className="border border-purple-300 rounded-xl px-2 py-1 w-full focus:ring-2 focus:ring-purple-300 focus:outline-none"
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-purple-700 mb-1">{doc.mensaje}</h2>
            <p className="text-sm text-gray-500 italic">{doc.autor || "Anónimo 🌸"}</p>
            <p className="text-xs text-gray-400 mt-1">🕒 {fechaFormateada}</p> {/* 🕒 Nuevo */}
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-xl shadow-md transition duration-300"
            >
              💾
            </button>
            <button
              onClick={() => {
                setNuevoTexto(doc.mensaje);
                setIsEditing(false);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded-xl transition duration-300"
            >
              ❌
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl shadow-md transition duration-300"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(doc.id)}
              className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-xl shadow-md transition duration-300"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default Post;
