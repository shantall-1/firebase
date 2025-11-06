import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ⬅️ CAMBIO 1: Importación real del hook
import { LogIn, AtSign, Key, Send, AlertTriangle, CheckCircle } from "lucide-react";

// Función para traducir errores de Firebase (ajustada para el contexto real)
// Puedes necesitar una lógica de traducción más robusta si usas i18n
const traducirError = (code) => {
    switch (code) {
        case "auth/user-not-found":
        case "auth/invalid-credential": // Error más genérico de credenciales incorrectas en versiones recientes
            return "Usuario no encontrado o credenciales incorrectas. Verifica tu correo.";
        case "auth/wrong-password":
            return "Contraseña incorrecta. Intenta de nuevo.";
        case "auth/invalid-email":
            return "El formato del correo electrónico es inválido.";
        default:
            // Para errores de red, etc.
            return `Ocurrió un error inesperado. (${code || 'error desconocido'})`;
    }
};

export default function Login() {
    // ⬅️ CAMBIO 2: Usamos el hook useAuth real
    const { login, resetPassword, loginWithGoogle } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Estado para manejo de carga

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");
        setIsLoading(true);

        try {
            // Usando la función 'login' real de Firebase
            await login(email, password);
            setMensaje("¡Inicio de sesión exitoso! Serás redirigida pronto. 🎉");
            // Nota: La redirección se haría aquí o en un useEffect de tu Layout/App.
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            // Firebase puede devolver un objeto de error que puede o no tener un 'code'.
            const errorCode = err.code || 'unknown-error'; 
            setError(traducirError(errorCode));
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        setError("");
        setMensaje("");

        if (!email) {
            setError("💌 Por favor, escribe tu correo para enviarte el enlace de restablecimiento.");
            return;
        }
        setIsLoading(true);
        try {
            // Usando la función 'resetPassword' real de Firebase
            await resetPassword(email);
            setMensaje("🥳 ¡Enlace enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.");
            // Opcional: Limpiar el campo de email si deseas
            // setEmail(""); 
        } catch (err) {
            console.error("Error al restablecer contraseña:", err);
            const errorCode = err.code || 'unknown-error'; 
            setError(traducirError(errorCode));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setMensaje("");
        setIsLoading(true);
        try {
            // Usando la función 'loginWithGoogle' real de Firebase
            await loginWithGoogle();
            setMensaje("¡Inicio de sesión con Google exitoso! 🤩");
        } catch (err) {
            console.error("Error con Google Login:", err);
            const errorCode = err.code || 'unknown-error'; 
            setError(traducirError(errorCode));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Contenedor principal con gradiente suave y sutil
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
            
            {/* Tarjeta de Login mejorada: fondo blanco/rosita, blur, sombra suave y redondeada */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-[0_20px_50px_rgba(255,100,150,0.2)] rounded-4xl p-8 md:p-10 border border-pink-100/60 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(255,100,150,0.3)]">
                
                <h1 className="text-4xl font-extrabold mb-8 text-center text-pink-700 drop-shadow-md tracking-wider">
                    💖 ¡Bienvenida!
                </h1>

                {/* Mensajes de Alerta y Éxito estilizados */}
                {error && (
                    <div className="flex items-start mb-4 text-sm text-red-700 bg-red-100/70 border border-red-300 rounded-xl p-3 shadow-md">
                        <AlertTriangle size={18} className="mt-0.5 mr-2 shrink-0 text-red-500" />
                        <p>{error}</p>
                    </div>
                )}

                {mensaje && (
                    <div className="flex items-start mb-4 text-sm text-green-700 bg-green-100/70 border border-green-300 rounded-xl p-3 shadow-md">
                        <CheckCircle size={18} className="mt-0.5 mr-2 shrink-0 text-green-500" />
                        <p>{mensaje}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Campo Correo */}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-pink-800">
                            <AtSign size={14} className="inline mr-1 align-sub" />
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-inner transition-all duration-300
                                focus:outline-none focus:border-pink-400 focus:ring-3 focus:ring-pink-200/50 bg-white/90"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                            required
                            disabled={isLoading} // Desactivar durante la carga
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-pink-800">
                            <Key size={14} className="inline mr-1 align-sub" />
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-inner transition-all duration-300
                                focus:outline-none focus:border-pink-400 focus:ring-3 focus:ring-pink-200/50 bg-white/90"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña secreta"
                            required
                            disabled={isLoading} // Desactivar durante la carga
                        />
                    </div>

                    {/* Botón Principal (Login) con gradiente y animación */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-2 font-extrabold py-3 rounded-2xl transition-all duration-300 
                            shadow-lg active:scale-[0.98] ${
                                isLoading 
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                                : 'bg-linear-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-xl'
                            }`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Iniciar Sesión</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Opciones Adicionales: Olvidé Contraseña y Google */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-2">
                    
                    {/* Olvidé Contraseña */}
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline transition disabled:opacity-50 flex items-center"
                    >
                        <Send size={14} className="mr-1" /> ¿Olvidaste tu contraseña?
                    </button>

                    {/* Login con Google */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-white border border-pink-200 shadow-md px-4 py-2 rounded-xl text-gray-700 font-medium 
                        hover:bg-pink-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                            alt="Google logo"
                        />
                        Google
                    </button>
                </div>

                {/* Bloque de Registro con estilo de llamada a la acción */}
                <div className="mt-8 pt-6 border-t border-pink-100/80 text-center">
                    <p className="text-pink-700 font-semibold mb-3">¿Eres nueva por aquí? 🎀</p>

                    <a
                        href="/registro"
                        className="inline-block bg-pink-400 text-white font-extrabold px-6 py-2.5 rounded-full shadow-lg 
                            hover:bg-pink-500 transition-all duration-300 active:scale-95 hover:shadow-xl"
                    >
                        ¡Crea tu cuenta ahora!
                    </a>
                </div>
            </div>
        </div>
    );
}