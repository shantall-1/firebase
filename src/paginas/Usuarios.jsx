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
import { User, Phone, Mail, Edit, Trash2, X, Save, PlusCircle } from "lucide-react"; // Nuevos iconos para más detalle
import { db } from "../lib/firebase"; // Asume que esta importación es correcta

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
      setErrorMsg("⚠️ ¡Oops! Debes completar todos los campos.");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "usuarios", editingId), formUsuario);
        showToast("✏️ Usuario actualizado con éxito!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, "usuarios"), formUsuario);
        showToast("✨ Nuevo usuario registrado.");
      }
      setFormUsuario({ nombre: "", celular: "", correo: "" });
      setErrorMsg("");
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrorMsg("❌ Error al procesar la solicitud.");
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
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este usuario? ¡Es permanente! 💔");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "usuarios", id));
      showToast("🗑️ Usuario eliminado correctamente.");
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
      className="min-h-screen bg-linear-to-br from-rose-50 to-pink-100 flex flex-col items-center py-12 px-4 relative overflow-hidden"
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
        👑 Gestión de Usuarios
      </motion.h1>

      {/* Formulario de Creación/Edición */}
      <motion.form
        id="user-form"
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl p-8 w-full max-w-lg border border-rose-200/50 transition-shadow duration-300 hover:shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "tween", duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
          {editingId ? "✏️ Editar Usuario" : " Nuevo Registro"}
        </h2>
        
        {/* Campo Nombre */}
        <div className="mb-4">
          <label className="flex items-center text-rose-500 font-semibold mb-1 text-sm"><User size={14} className="mr-2"/> Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            value={formUsuario.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-rose-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200/50 transition-all text-gray-700 placeholder-gray-400"
            placeholder="Ej: Isabella Castro"
            disabled={loading}
          />
        </div>

        {/* Campo Celular */}
        <div className="mb-4">
          <label className="flex items-center text-rose-500 font-semibold mb-1 text-sm"><Phone size={14} className="mr-2"/> Teléfono Celular</label>
          <input
            type="text"
            name="celular"
            value={formUsuario.celular}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-rose-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200/50 transition-all text-gray-700 placeholder-gray-400"
            placeholder="+57 300 123 4567"
            disabled={loading}
          />
        </div>

        {/* Campo Correo */}
        <div className="mb-6">
          <label className="flex items-center text-rose-500 font-semibold mb-1 text-sm"><Mail size={14} className="mr-2"/> Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            value={formUsuario.correo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-rose-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200/50 transition-all text-gray-700 placeholder-gray-400"
            placeholder="tu.correo@ejemplo.com"
            disabled={loading}
          />
        </div>

        {errorMsg && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm mb-4 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {errorMsg}
          </motion.div>
        )}

        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className={`flex-1 inline-flex items-center justify-center font-bold py-3 rounded-xl shadow-lg transition-all duration-300 
              ${editingId 
                ? 'bg-indigo-400 hover:bg-indigo-500 text-white' 
                : 'bg-pink-500 hover:bg-pink-600 text-white'
              } disabled:opacity-50 disabled:shadow-none`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : editingId ? (
              <> <Save size={20} className="mr-2" /> Guardar Cambios </>
            ) : (
              <> <PlusCircle size={20} className="mr-2" /> Agregar Usuario </>
            )}
          </motion.button>

          {editingId && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border-2 border-rose-300 bg-white text-rose-600 font-semibold shadow-md hover:bg-rose-50 transition disabled:opacity-50"
            >
              <X size={20} className="mr-1" /> Cancelar
            </motion.button>
          )}
        </div>
      </motion.form>

      <motion.div
        className="mt-12 w-full max-w-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-pink-700 mb-5 text-center">
          Lista de Contactos
        </h2>

        <ul className="space-y-4">
          <AnimatePresence>
            {usuarios.map((user) => (
              <motion.li
                key={user.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 8px 25px rgba(255, 100, 150, 0.15)",
                }}
                className="bg-white/80 backdrop-blur-sm border border-rose-200/50 rounded-2xl shadow-md p-5 flex items-center justify-between transition-transform"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-lg text-pink-700 truncate">{user.nombre}</p>
                  <div className="text-sm text-gray-600 space-y-0.5 mt-1">
                    <div className="flex items-center"><Phone size={12} className="mr-1 text-rose-400"/> {user.celular}</div>
                    <div className="flex items-center truncate"><Mail size={12} className="mr-1 text-rose-400"/> {user.correo}</div>
                  </div>
                </div>

                <div className="ml-4 flex items-center space-x-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ rotate: 10 }}
                    onClick={() => handleEdit(user)}
                    title="Editar usuario"
                    className="p-2 rounded-full bg-rose-100 hover:bg-rose-200 text-pink-500 transition-all shadow-sm"
                  >
                    <Edit size={18} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ rotate: -10 }}
                    onClick={() => handleDelete(user.id)}
                    title="Eliminar usuario"
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        
        {/* Mensaje si no hay usuarios */}
        {!usuarios.length && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 italic mt-8 p-4 bg-white/70 rounded-xl"
          >
            Aún no tienes usuarios registrados. ¡Sé la primera! 🥳
          </motion.p>
        )}
      </motion.div>

      {/* Toast animado (estilizado) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-2xl shadow-pink-500/50 text-base font-semibold z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

