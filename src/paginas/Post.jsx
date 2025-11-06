import { useState, useEffect } from "react";
import { db } from "../lib/firebase.js";
import {collection,  onSnapshot,query,addDoc,deleteDoc, doc, updateDoc,} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageSquare, Edit, Trash2, Save, X, RotateCw } from "lucide-react"; // Importando iconos de Lucide para una estética moderna

// Componente principal Post
export default function Post() {
  const [post, setPost] = useState([]);
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const consulta = query(collection(db, "post"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPost(docs);
      setIsLoadingPosts(false);
    });
    return () => unsubscribe();
  }, []);

  const abrirModal = () => {
    if (texto.trim() === "") {
      setError("⚠️ Por favor escribe un mensaje antes de enviarlo, ¡el universo espera tu brillo!");
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
    // Se ha eliminado window.confirm para cumplir con las directrices de la plataforma.
    try {
      await deleteDoc(doc(db, "post", id));
      console.log("Post eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const guardarEdicion = async (id, nuevoTexto) => {
    await updateDoc(doc(db, "post", id), { mensaje: nuevoTexto });
  };

  return (
    <motion.div 
      className="min-h-screen bg-linear-to-br from-rose-50 to-pink-100 flex flex-col items-center py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-4xl font-extrabold text-pink-700 mb-8 tracking-wide drop-shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, duration: 0.7 }}
      >
        <MessageSquare size={30} className="inline mr-2" /> Diario de Notas Mágicas
      </motion.h1>

      {/* Input para nuevo post - Estilizado como Tarjeta Glassmorphism */}
      <motion.div 
        className="flex flex-col items-center gap-4 mb-12 bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-rose-200/50 w-full max-w-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        <div className="flex items-center gap-4 w-full">
          <input
            className="border-2 border-rose-300 rounded-full px-5 py-3 focus:ring-4 focus:ring-rose-200/50 focus:outline-none grow text-gray-700 placeholder-rose-300 font-medium"
            type="text"
            placeholder="💭 Escribe algo bonito para compartir..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && abrirModal()}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="bg-linear-to-r from-pink-400 to-rose-500 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
            onClick={abrirModal}
          >
            <Send size={20} className="mr-1" /> Publicar
          </motion.button>
        </div>

        {error && (
          <motion.div 
            className="text-red-600 text-sm font-medium mt-3 bg-red-100 border border-red-300 px-4 py-2 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Modal autor - Estilizado con AnimatePresence */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl shadow-2xl p-8 w-80 text-center border-4 border-pink-200/70"
              initial={{ scale: 0.7, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <h2 className="text-2xl font-bold text-pink-600 mb-4 flex justify-center items-center">
                <User size={24} className="mr-2" /> ¿Quién lo escribió?
              </h2>
              <input
                type="text"
                className="border-2 border-rose-300 rounded-xl px-4 py-2 w-full mb-6 focus:ring-4 focus:ring-rose-200/50 focus:outline-none text-gray-700 placeholder-rose-300"
                placeholder="Tu nombre, o Anónimo 🤫"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && guardarPost()}
              />
              <div className="flex justify-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={guardarPost}
                  className="bg-linear-to-r from-pink-500 to-rose-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                >
                  Guardar <Save size={18} className="ml-2" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 flex items-center"
                >
                  Cancelar <X size={18} className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de posts */}
      <motion.ul 
        className="w-full max-w-lg space-y-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {isLoadingPosts && (
          <div className="text-center text-gray-500 mt-8 flex justify-center items-center p-4 bg-white/70 rounded-xl">
            <RotateCw className="animate-spin mr-2 text-pink-400" size={18} /> Cargando mensajes...
          </div>
        )}
        <AnimatePresence>
          {post.map((doc) => (
            <EditablePost
              key={doc.id}
              doc={doc}
              onDelete={eliminarPost}
              onSave={guardarEdicion}
            />
          ))}
        </AnimatePresence>
        
        {!isLoadingPosts && post.length === 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 italic mt-8 p-4 bg-white/70 rounded-xl"
          >
            ¡Este muro está vacío! Escribe el primer mensaje inspirador. 🌟
          </motion.p>
        )}
      </motion.ul>
    </motion.div>
  );
}

// Componente EditablePost
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
    <motion.li
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 8px 25px rgba(255, 100, 150, 0.15)",
      }}
      className="bg-white/80 backdrop-blur-sm border border-rose-200/50 rounded-2xl p-5 shadow-md transition-all duration-300 flex justify-between items-start"
    >
      <div className="flex-1 mr-4">
        {isEditing ? (
          <input
            className="border-2 border-pink-300 rounded-xl px-4 py-2 w-full focus:ring-4 focus:ring-pink-200/50 focus:outline-none text-gray-700 font-medium text-lg"
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <>
            <h2 className="text-lg font-bold text-pink-700 mb-1 leading-snug">
              {doc.mensaje}
            </h2>
            <p className="text-sm text-pink-500 italic mt-1 font-medium flex items-center">
              <User size={14} className="mr-1.5 text-rose-400" /> {doc.autor || "Anónimo 🌸"}
            </p>
            <p className="text-xs text-pink-400 mt-2">
              🕓 Publicado: {fechaFormateada}
            </p>
          </>
        )}
          </div>

      <div className="flex gap-2 shrink-0">
        {isEditing ? (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              title="Guardar cambios"
              className="bg-indigo-400 hover:bg-indigo-500 text-white p-2 rounded-full shadow-md transition-all duration-300"
            >
              <Save size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setNuevoTexto(doc.mensaje);
                setIsEditing(false);
              }}
              title="Cancelar edición"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-full transition-all duration-300"
            >
              <X size={18} />
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ rotate: 10 }}
              onClick={() => setIsEditing(true)}
              title="Editar post"
              className="bg-rose-100 hover:bg-rose-200 text-pink-500 p-2 rounded-full shadow-sm transition-all duration-300"
            >
              <Edit size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ rotate: -10 }}
              onClick={() => onDelete(doc.id)}
              title="Eliminar post"
              className="bg-red-100 hover:bg-red-200 text-red-500 p-2 rounded-full shadow-sm transition-all duration-300"
            >
              <Trash2 size={18} />
            </motion.button>
          </>
        )}
      </div>
    </motion.li>
  );
}
