import React, { useEffect, useState } from "react";
import { validateCreditApplication } from "../utils/creditValidation";
import { initializeDatabase, loadFromLocalStorage, saveToLocalStorage } from "../database/database";
import  { Database } from "sql.js";

interface FormData {
    nombre: string;
    rfc: string;
    fechaNacimiento: string;
    ingresosMensuales: number;
    montoSolicitado: number;
    historialCrediticio: boolean;
    solicitudEnProceso: boolean;
  }
  
  const CreditForm: React.FC = () => {
    // Estado para almacenar la instancia de la base de datos
    const [db, setDb] = useState<Database | null>(null);

    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        rfc: "",
        fechaNacimiento: "",
        ingresosMensuales: 0,
        montoSolicitado: 0,
        historialCrediticio: false,
        solicitudEnProceso: false,
    });

    // Estado para manejar el resultado de la validación
    const [result, setResult] = useState<{ aprobado: boolean; razon?: string; montoAprobado?: number } | null>(null);
  
    useEffect(() => {
        // Inicializa la base de datos al cargar el componente
      const initDb = async () => {
        const loadedDb = await loadFromLocalStorage();
        if (loadedDb) {
          setDb(loadedDb);
          console.log("Base de datos restaurada desde LocalStorage");
        } else {
          const newDb = await initializeDatabase();
          setDb(newDb);
          console.log("Nueva base de datos creada con datos predeterminados");
        }
      };
  
      initDb();
  
      window.addEventListener("beforeunload", saveDatabase);
      return () => {
        window.removeEventListener("beforeunload", saveDatabase);
      };
    }, []);
  
    const saveDatabase = () => {
      if (db) saveToLocalStorage(db);
    };

    // Maneja los cambios en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
      
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
        });
      };
      
    // Envía el formulario y valida la solicitud
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const age = calculateAge(new Date(formData.fechaNacimiento)); // Calcula la edad del solicitante
      const historialCrediticio = checkCreditHistory(formData.rfc); // Verifica si tiene historial crediticio
      const solicitudEnProceso = checkPendingRequest(formData.rfc); // Verifica si tiene una solicitud en proceso
  
      const validation = validateCreditApplication({
        edad: age,
        ingresosMensuales: formData.ingresosMensuales,
        montoSolicitado: formData.montoSolicitado,
        historialCrediticio,
        solicitudEnProceso,
      });
  
      setResult(validation);
  
      if (validation.aprobado) {
        registerClientAndRequest();
      }
    };
  
    const calculateAge = (birthDate: Date) => {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };
  
    const checkCreditHistory = (rfc: string): boolean => {
      if (!db) return false;
      const result = db.exec(`SELECT * FROM creditos WHERE rfc = '${rfc}' AND aprobado = 'Sí'`);
      return result.length > 0;
    };
  
    const checkPendingRequest = (rfc: string): boolean => {
      if (!db) return false;
      const result = db.exec(`SELECT * FROM solicitudes WHERE rfc = '${rfc}' AND estado = 'Pendiente'`);
      return result.length > 0;
    };
  
    const registerClientAndRequest = () => {
      if (!db) return;
  
      const clientExists = db.exec(`SELECT * FROM creditos WHERE rfc = '${formData.rfc}'`);
      if (clientExists.length === 0) {
        db.run(
          `INSERT INTO creditos (nombre, rfc, fecha, importe, aprobado) VALUES (
            '${formData.nombre}', 
            '${formData.rfc}', 
            DATE('now'), 
            ${formData.montoSolicitado}, 
            'Pendiente'
          )`
        );
        console.log("Cliente nuevo registrado.");
      }
  
      db.run(
        `INSERT INTO solicitudes (nombre, rfc, fechaNacimiento, ingresosMensuales, importeSolicitado, estado) VALUES (
          '${formData.nombre}', 
          '${formData.rfc}', 
          '${formData.fechaNacimiento}', 
          ${formData.ingresosMensuales}, 
          ${formData.montoSolicitado}, 
          'Pendiente'
        )`
      );
      console.log("Solicitud registrada.");
    };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">RFC:</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Fecha de nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Ingresos mensuales:</label>
          <input
            type="number"
            name="ingresosMensuales"
            value={formData.ingresosMensuales}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Monto solicitado:</label>
          <input
            type="number"
            name="montoSolicitado"
            value={formData.montoSolicitado}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">¿Tiene historial crediticio?</label>
          <input
            type="checkbox"
            name="historialCrediticio"
            checked={formData.historialCrediticio}
            onChange={handleChange}
            className="h-5 w-5 text-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">¿Tiene una solicitud en proceso?</label>
          <input
            type="checkbox"
            name="solicitudEnProceso"
            checked={formData.solicitudEnProceso}
            onChange={handleChange}
            className="h-5 w-5 text-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Validar Solicitud
        </button>
      </form>

      {/* Resultado */}
      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          {result.aprobado ? (
            <p className="text-green-600 font-medium">
              La solicitud ha sido aprobada. Se aprueba un monto de ${result.montoAprobado} al cliente.
            </p>
          ) : (
            <p className="text-red-600 font-medium">La solicitud ha sido rechazada. Razón: {result.razon}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreditForm;
