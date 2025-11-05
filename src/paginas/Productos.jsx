import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Productos() {
  const [selected, setSelected] = useState(null);

  const productos = [
    {
      id: 1,
      nombre: "Rosa Encantada 🌹",
      descripcion:
        "Una rosa eterna conservada en vidrio. Ideal para regalar amor que nunca se marchita.",
descripcion2:
  "Rosa natural preservada dentro de una cúpula de cristal. Su proceso de conservación permite mantener su color y forma durante años, sin necesidad de agua ni cuidados especiales. Ideal como detalle romántico o decorativo.",
      precio: "S/25.00",
      imagen:
        "https://rosatelpe.vtexassets.com/arquivos/ids/157717/rosa-encantada-en-caja-roja.jpg?v=638851601450800000",
    },
    {
      id: 2,
      nombre: "Caja de Dulzura 🍬",
      descripcion:
        "Deliciosa caja sorpresa con golosinas artesanales y notas personalizadas.",
        descripcion2:
  "Incluye una selección variada de dulces y chocolates artesanales, presentados en una caja decorativa. Perfecta para regalar en cumpleaños, aniversarios o simplemente para endulzar el día.",

      precio: "S/55.00",
      imagen:
        "https://i.pinimg.com/736x/65/54/aa/6554aac0c2a4569a12cb864c082623b6.jpg",
    },
 {
    id: 3,
    nombre: "Perfume Floral 🌸",
    descripcion:
      "Fragancia inspirada en pétalos de primavera. Fresca, dulce y elegante.",
    descripcion2:
      "Fragancia suave con notas florales y toques de vainilla. Ideal para uso diario.",
    precio: "S/35.00",
    imagen: "https://i.pinimg.com/736x/c0/1f/e1/c01fe13d36047147e15b905b0b761fef.jpg"
  },
    {
      id: 4,
      nombre: "Taza Personalizada ☕",
      descripcion:
        "Taza cerámica con diseño romántico y tu nombre grabado. Perfecta para los días fríos.",
        descripcion2:
  "Taza de cerámica resistente con impresión personalizada. Apta para microondas y lavavajillas, perfecta para disfrutar tu café o té favorito con un toque único.",

      precio: "S/12.00",
      imagen:
        "https://i.pinimg.com/736x/0f/47/4d/0f474d80056c104c0d9a96bf27c07094.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-pink-600 mb-10 text-center"
      >
        🌷 Nuestros Productos 🌷
      </motion.h1>

      {/* GRID DE PRODUCTOS */}
      <motion.div
        layout
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl"
      >
        {productos.map((p, index) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-pink-200"
          >
            <div className="overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <h2 className="text-xl font-semibold text-pink-600 mb-2">
                {p.nombre}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-2">{p.descripcion}</p>
              <p className="font-bold text-pink-700 mb-4">{p.precio}</p>
              <button
                onClick={() => setSelected(p)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-transform duration-200 hover:scale-105"
              >
                💖 Ver Detalles
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* POPUP DETALLES */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full border border-pink-200 relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 transition"
              >
                ✖️
              </button>
              <motion.img
                src={selected.imagen}
                alt={selected.nombre}
                className="w-full h-60 object-cover rounded-2xl mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <h2 className="text-2xl font-bold text-pink-600 mb-2">
                {selected.nombre}
              </h2>
              <p className="text-gray-600 mb-4">{selected.descripcion2}</p>
              <p className="text-lg font-semibold text-pink-700">
                {selected.precio}
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-pink-500 text-white rounded-xl shadow-md hover:bg-pink-600 transition"
                >
                  💕 Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
