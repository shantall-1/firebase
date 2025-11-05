import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/firebase";

export function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formUsuario, setFormUsuario] = useState({
    nombre: "",
    celular: "",
    correo: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "usuarios"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setUsuarios(data);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormUsuario({ ...formUsuario, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, celular, correo } = formUsuario;

    if (!nombre || !celular || !correo) {
      setErrorMsg("⚠️ Por favor completa todos los campos antes de guardar.");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "usuarios", editingId), formUsuario);
        showToast("✏️ Cambios guardados con éxito!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, "usuarios"), formUsuario);
        showToast("💌 Usuario agregado correctamente!");
      }
      setFormUsuario({ nombre: "", celular: "", correo: "" });
      setErrorMsg("");
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrorMsg("❌ Ocurrió un error al guardar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormUsuario({
      nombre: user.nombre || "",
      celular: user.celular || "",
      correo: user.correo || "",
    });
    setEditingId(user.id);
    setErrorMsg("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormUsuario({ nombre: "", celular: "", correo: "" });
    setErrorMsg("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este usuario? 🗑️");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "usuarios", id));
      showToast("🗑️ Usuario eliminado correctamente!");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("❌ No se pudo eliminar el usuario.");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <motion.div
      className="min-h-screen bg-linear-to-b from-pink-50 to-pink-100 flex flex-col items-center py-10 px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-3xl font-bold text-pink-600 mb-6"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
         Registro de Usuarios 
      </motion.h1>

      <motion.form
        id="user-form"
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-pink-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <div className="mb-4">
          <label className="block text-pink-600 font-medium mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formUsuario.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Escribe tu nombre..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-pink-600 font-medium mb-2">Celular</label>
          <input
            type="text"
            name="celular"
            value={formUsuario.celular}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Tu número de celular..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-pink-600 font-medium mb-2">Correo</label>
          <input
            type="email"
            name="correo"
            value={formUsuario.correo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Tu correo electrónico..."
          />
        </div>

        {errorMsg && (
          <motion.p
            className="text-red-500 text-sm mb-4 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMsg}
          </motion.p>
        )}

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-200 disabled:opacity-60"
          >
            {editingId ? "✏️ Guardar cambios" : "💌 Guardar Usuario"}
          </motion.button>

          {editingId && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-pink-300 bg-white text-pink-600 font-medium shadow-sm"
            >
              ✖️ Cancelar
            </motion.button>
          )}
        </div>
      </motion.form>

      <motion.div
        className="mt-10 w-full max-w-md"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-pink-600 mb-4 justify-center">
           Usuarios Registrados 
        </h2>

        <AnimatePresence>
          {usuarios.map((user) => (
            <motion.li
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 15px rgba(255, 182, 193, 0.4)",
              }}
              className="bg-white border border-pink-200 rounded-xl shadow-sm p-4 flex items-start justify-between mb-3 transition-transform"
            >
              <div className="flex-1">
                <span className="font-bold text-pink-700">{user.nombre}</span>
                <div className="text-sm text-pink-500">
                  <div>{user.celular}</div>
                  <div>{user.correo}</div>
                </div>
              </div>

              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  title="Editar usuario"
                  className="p-2 rounded-full hover:bg-pink-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-pink-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                      fillRule="evenodd"
                      d="M2 15.5A1.5 1.5 0 013.5 14H6v1.5A1.5 1.5 0 014.5 17H3a1 1 0 01-1-1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  title="Eliminar usuario"
                  className="p-2 rounded-full hover:bg-pink-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v11a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 5a.5.5 0 011 0v8a.5.5 0 01-1 0V7zm4 0a.5.5 0 011 0v8a.5.5 0 01-1 0V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Toast animado */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 bg-pink-500 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
