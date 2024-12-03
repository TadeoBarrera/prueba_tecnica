interface CreditApplication {
    edad: number;
    ingresosMensuales: number;
    montoSolicitado: number;
    historialCrediticio: boolean;
    solicitudEnProceso: boolean;
  }
  
  export const validateCreditApplication = (application: CreditApplication) => {
    if (application.edad < 18) {
      return { aprobado: false, razon: "El cliente es menor de edad." };
    }
  
    if (application.solicitudEnProceso) {
      return { aprobado: false, razon: "Ya tiene una solicitud en proceso." };
    }
  
    let importeMaximo = 0;
    if (application.ingresosMensuales < 10000) {
      importeMaximo = application.historialCrediticio ? 15000 : 7500;
    } else if (application.ingresosMensuales < 20000) {
      importeMaximo = application.historialCrediticio ? 25000 : 12000;
    } else if (application.ingresosMensuales < 40000) {
      importeMaximo = application.historialCrediticio ? 50000 : 30000;
    } else {
      importeMaximo = application.historialCrediticio ? 100000 : 50000;
    }
  
    if (application.montoSolicitado > importeMaximo) {
      return {
        aprobado: false,
        razon: `No cuenta con historial de crédito suficiente y el importe máximo permitido es $${importeMaximo.toFixed(2)}.`,
      };
    }
  
    return { aprobado: true, montoAprobado: application.montoSolicitado };
  };
  