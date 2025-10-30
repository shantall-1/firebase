
import { NavLink } from "react-router-dom";
import { Home, Users, FileText, ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-pink-100/70 backdrop-blur-md border-b border-pink-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-pink-600 tracking-tight hover:scale-105 transition-transform">
          🌸 CuteApp
        </h1>

        <ul className="flex gap-6 text-pink-700 font-medium">
          <NavItem to="/" icon={<Home size={18} />} label="Inicio" />
          <NavItem to="/usuarios" icon={<Users size={18} />} label="Usuarios" />
          <NavItem to="/post" icon={<FileText size={18} />} label="Post" />
          <NavItem
            to="/productos"
            icon={<ShoppingBag size={18} />}
            label="Productos"
          />
        </ul>
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
          `flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300
          ${
            isActive
              ? "bg-pink-300 text-white shadow-sm"
              : "hover:bg-pink-200 hover:text-pink-900"
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </li>
  );
}
