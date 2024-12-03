import initSqlJs, { Database } from "sql.js";

// Datos iniciales para la tabla "creditos"
const initialData = [
  { nombre: "Juan", rfc: "GOTJ950101", fecha: "25/08/2020", importe: 18500, aprobado: "Sí" },
  { nombre: "María", rfc: "LOVM901015", fecha: "15/04/2021", importe: 25000, aprobado: "No" },
  { nombre: "Andrés", rfc: "SIMA961201", fecha: "12/02/2019", importe: 13800, aprobado: "Sí" },
  { nombre: "Sofía", rfc: "ZARS861218", fecha: "15/05/2018", importe: 40000, aprobado: "No" },
];

export const initializeDatabase = async (): Promise<Database> => {
    const SQL = await initSqlJs({ locateFile: () => `/sql-wasm.wasm` });
    const db = new SQL.Database();
  
    // Crear tabla creditos
    db.run(`
      CREATE TABLE IF NOT EXISTS creditos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        rfc TEXT UNIQUE,
        fecha TEXT,
        importe REAL,
        aprobado TEXT
      );
    `);
  
    // Crear tabla solicitudes
    db.run(`
      CREATE TABLE IF NOT EXISTS solicitudes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        rfc TEXT,
        fechaNacimiento TEXT,
        ingresosMensuales REAL,
        importeSolicitado REAL,
        estado TEXT
      );
    `);
  
    // Insertar datos iniciales en la tabla creditos
    for (const row of initialData) {
      db.run(`
        INSERT OR IGNORE INTO creditos (nombre, rfc, fecha, importe, aprobado)
        VALUES ('${row.nombre}', '${row.rfc}', '${row.fecha}', ${row.importe}, '${row.aprobado}');
      `);
    }
  
    return db;
  };

// Función para guardar la base de datos en LocalStorage
export const saveToLocalStorage = (db: Database) => {
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  localStorage.setItem("sqliteDatabase", base64);
  console.log("Base de datos guardada en LocalStorage");
};

// Función para cargar la base de datos desde LocalStorage
export const loadFromLocalStorage = async (): Promise<Database | null> => {
  const base64 = localStorage.getItem("sqliteDatabase");
  if (!base64) return null;

  const binaryString = atob(base64);
  const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  const SQL = await initSqlJs({ locateFile: () => `/sql-wasm.wasm` });
  return new SQL.Database(bytes);
};
