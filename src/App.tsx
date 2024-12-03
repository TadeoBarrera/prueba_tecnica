import { useEffect } from "react";
import CreditForm from "./components/CreditForm";
import { initializeDatabase } from "./database/database";

function App() {
  useEffect(() => {
    const initDb = async () => {
      const database = await initializeDatabase();
  
      // Revizar datos iniciales
      const creditosData = database.exec("SELECT * FROM creditos");
      const solicitudesData = database.exec("SELECT * FROM solicitudes");
  
      console.log("Tabla Créditos:", creditosData);
      console.log("Tabla Solicitudes:", solicitudesData);
    };
    initDb();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Sistema de Aprobación de Créditos</h1>
        <p className="text-gray-600 text-center mb-6">
          Ingresa los datos necesarios para validar tu solicitud de crédito.
        </p>
        <CreditForm />
      </div>
    </div>
  );
}

export default App;
