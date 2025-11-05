import { useState, useEffect } from "react";
import { db } from "../lib/firebase.js";
import {collection,  onSnapshot,query,addDoc,deleteDoc, doc, updateDoc,} from "firebase/firestore";

export default function Post() {
  const [post, setPost] = useState([]);
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consulta = query(collection(db, "post"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPost(docs);
    });
    return () => unsubscribe();
  }, []);

  const abrirModal = () => {
    if (texto.trim() === "") {
      setError("⚠️ Por favor escribe un mensaje antes de enviarlo.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const guardarPost = async () => {
    const fecha = new Date();
    await addDoc(collection(db, "post"), {
      mensaje: texto,
      autor: autor.trim() || "Anónimo 🌸",
      createdAt: fecha,
    });
    setTexto("");
    setAutor("");
    setShowModal(false);
  };

  const eliminarPost = async (id) => {
    await deleteDoc(doc(db, "post", id));
  };

  const guardarEdicion = async (id, nuevoTexto) => {
    await updateDoc(doc(db, "post", id), { mensaje: nuevoTexto });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-pink-50 to-purple-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-pink-600 mb-6 tracking-tight drop-shadow-sm">
        🌷 Lista de Posts 🌷
      </h1>

      {/* Input para nuevo post */}
      <div className="flex flex-col items-center gap-3 mb-10 bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md border border-pink-200">
        <div className="flex items-center gap-3">
          <input
            className="border border-pink-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none w-72 text-pink-700 placeholder-pink-300"
            type="text"
            placeholder="💭 Escribe algo bonito..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && abrirModal()}
          />
          <button
            className="bg-linear-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300"
            onClick={abrirModal}
          >
            💌 Publicar
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium mt-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            {error}
          </div>
        )}
      </div>

      {/* Modal autor */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center border border-pink-200">
            <h2 className="text-xl font-semibold text-pink-600 mb-4">
              💁 Agrega tu nombre
            </h2>
            <input
              type="text"
              className="border border-pink-300 rounded-full px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-pink-300 focus:outline-none text-pink-700"
              placeholder="🌸 Escribe tu nombre (opcional)"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={guardarPost}
                className="bg-linear-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-all duration-300"
              >
                Guardar 💕
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-all duration-300"
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
          <EditablePost
            key={doc.id}
            doc={doc}
            onDelete={eliminarPost}
            onSave={guardarEdicion}
          />
        ))}
      </ul>
    </div>
  );
}

function EditablePost({ doc, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nuevoTexto, setNuevoTexto] = useState(doc.mensaje);

  const handleSave = async () => {
    if (nuevoTexto.trim() === "") return;
    await onSave(doc.id, nuevoTexto);
    setIsEditing(false);
  };

  const fecha = doc.createdAt?.toDate
    ? doc.createdAt.toDate()
    : new Date(doc.createdAt);
  const fechaFormateada = fecha.toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <li className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex justify-between items-center">
      <div className="flex-1 mr-3">
        {isEditing ? (
          <input
            className="border border-pink-300 rounded-full px-3 py-1 w-full focus:ring-2 focus:ring-pink-300 focus:outline-none text-pink-700"
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-pink-700 mb-1">
              {doc.mensaje}
            </h2>
            <p className="text-sm text-pink-500 italic">
              {doc.autor || "Anónimo 🌸"}
            </p>
            <p className="text-xs text-pink-300 mt-1">🕒 {fechaFormateada}</p>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-full shadow-sm transition-all duration-300"
            >
              💾
            </button>
            <button
              onClick={() => {
                setNuevoTexto(doc.mensaje);
                setIsEditing(false);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded-full transition-all duration-300"
            >
              ❌
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-300 hover:bg-yellow-400 text-white px-3 py-1 rounded-full shadow-sm transition-all duration-300"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(doc.id)}
              className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-full shadow-sm transition-all duration-300"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </li>
  );
}
