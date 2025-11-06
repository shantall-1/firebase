import { Home, Users, FileText, ShoppingBag, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import { NavLink } from "react-router-dom";

// Componente auxiliar para mostrar el Avatar
function UserAvatar({ user, logout }) {
  // 1. Obtener la primera letra del nombre o email
  const getInitials = (user) => {
    // Usar displayName si existe, si no, usar el email (parte antes de @)
    const name = user.displayName || user.email.split('@')[0];
    return name ? name[0].toUpperCase() : 'U'; // 'U' de Usuario como fallback final
  };

  // El nombre a mostrar (usando el displayName si existe)
  const name = user.displayName || user.email.split('@')[0];
  const initials = getInitials(user);
  
  return (
    <div className="flex items-center gap-3 ml-2 border-l border-pink-200 pl-4">
      {/* 🧑‍💻 Zona del Avatar */}
      <div className="group relative">
        {/* AQUÍ ESTÁ EL CAMBIO CLAVE:
          Si NO hay photoURL, se aplican las clases bg-pink-700 (fondo rosa oscuro)
          y text-white (letra blanca).
        */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-300 transform group-hover:scale-105 ${
            user.photoURL 
                ? 'bg-transparent text-gray-800' // Si hay foto, fondo transparente, texto irrelevante (por si la foto falla)
                : 'bg-pink-700 text-white' // ⬅️ COLOR REQUERIDO: Fondo rosa oscuro, letra blanca
        }`}>
          {user.photoURL ? (
            // Si hay URL de foto, la mostramos
            <img 
              src={user.photoURL} 
              alt={name} 
              className="w-full h-full object-cover rounded-full border-2 border-pink-400"
              onError={(e) => { // En caso de error en la carga de la imagen
                  e.target.style.display = 'none'; // Oculta la imagen rota
                  e.target.parentElement.innerHTML = initials; // Muestra las iniciales
                  e.target.parentElement.classList.remove('bg-transparent', 'text-gray-800'); // Quita las clases de foto
                  e.target.parentElement.classList.add('bg-pink-700', 'text-white'); // Aplica las clases de iniciales
              }}
            />
          ) : (
            // Si no hay foto, mostramos las iniciales
            initials
          )}
        </div>

        {/* 📝 Popup/Tooltip con nombre y Cerrar Sesión (Visible al hacer hover) */}
        <div className="absolute right-0 top-12 w-48 bg-white border border-pink-100 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
          <div className="p-3">
            <p className="text-sm font-bold text-pink-700 truncate">{name}</p>
            <p className="text-xs text-gray-500 mb-2 truncate">{user.email}</p>
            <hr className="my-1 border-pink-100" />
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-pink-600 font-semibold hover:bg-red-50 transition-all active:scale-98"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-pink-50/90 backdrop-blur-sm border-b border-pink-200 shadow-xl sticky top-0 z-50 font-sans-body"> 
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <NavLink to="/" className="text-3xl font-extrabold text-pink-700 tracking-wider transition-all duration-500 ease-in-out hover:text-pink-900 hover:scale-105 active:scale-95">
          <span className="text-4xl mr-1 drop-shadow-md">🎀</span>
          <span className="font-logo">SweetApp</span>
        </NavLink>

        {/* Links de navegación y Zona de Usuario */}
        <div className="flex items-center">
            <ul className="flex gap-4 text-pink-600 font-semibold items-center">
                <NavItem to="/" icon={<Home size={20} />} label="Inicio" />
                <NavItem to="/usuarios" icon={<Users size={20} />} label="Usuarios" />
                <NavItem to="/post" icon={<FileText size={20} />} label="Post" />
                <NavItem to="/productos" icon={<ShoppingBag size={20} />} label="Productos" />
            </ul>

            {/* Renderizado condicional */}
            {!user ? (
                // ➡️ Opción 1: No logueado, mostrar botón de Login
                <NavLink
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-pink-300 text-pink-700 font-bold hover:bg-pink-100 hover:shadow-lg transition-all duration-300 ease-out shadow-md ml-4"
                >
                <LogIn size={20} />
                <span className="hidden sm:inline">Iniciar sesión</span>
                </NavLink>
            ) : (
                // ➡️ Opción 2: Logueado, mostrar el perfil del usuario
                <UserAvatar user={user} logout={logout} />
            )}

        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-1.5 px-3 py-2 rounded-full font-medium text-base transition-all duration-300 ease-out
          hover:bg-pink-100 hover:text-pink-800 hover:shadow-md 
          active:scale-95
          ${
            isActive
              ? "bg-pink-300 text-pink-900 shadow-lg font-bold"
              : "text-pink-600"
          }`
        }
      >
        {icon}
        <span className="hidden md:inline">{label}</span>
      </NavLink>
    </li>
  );
}