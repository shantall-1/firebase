import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Usuarios } from "./paginas/Usuarios";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-pink-50">
        <Navbar />

        <main className="max-w-6xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/post" element={<Post />} />
            <Route path="/productos" element={<Productos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
