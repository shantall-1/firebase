import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
    //cargar Auth
    const { register, loginWithGoogle } = useAuth();

    // Estados para el formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //Crea usuario con email and password
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(email, password); // Llama a createUserWithEmailAndPassword
            // Aquí podrías redirigir al dashboard o limpiar el formulario
        } catch (err) {
            console.log(err);
            setError(traducirError(err.code));
        }
    };

    // Opcional: login con Google
    const handleGoogle = async () => {
        setError("");
        try {
            await loginWithGoogle();
        } catch (err) {
            console.log(err);
            setError(traducirError(err.code));
        }
    };

    // Función simple para traducir códigos de error de Firebase a mensajes en español
    function traducirError(code) {
        switch (code) {
            case "auth/email-already-in-use":
                return "Este correo ya está registrado.";
            case "auth/invalid-email":
                return "El correo no es válido.";
            case "auth/weak-password":
                return "La contraseña es muy débil (mínimo 6 caracteres).";
            default:
                return "Ocurrió un error. Intenta nuevamente.";
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Crear cuenta
                </h1>

                {error && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                    >
                        Registrarse
                    </button>
                </form>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleGoogle}
                        className="w-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium py-2 rounded-lg transition text-sm"
                    >
                        Continuar con Google
                    </button>
                </div>
            </div>
        </div>
    )
}