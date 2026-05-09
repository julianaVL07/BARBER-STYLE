/* ══════════════════════════════════════════════
   BARBER STYLE — Lógica principal (app.js)
   Pantalla 1: Agendar Cita (formulario)
   Pantalla 2: CRUD Clientes
══════════════════════════════════════════════ */

/* URL base de la API del backend.
   Todas las peticiones HTTP se construyen a partir de esta dirección. */
const API = 'http://localhost:8080/api';

/* ── CONSTANTES ──
   Datos fijos que no cambian durante la ejecución de la app. */

/* Lista de horarios disponibles para agendar citas (de 9am a 5pm, cada hora) */
const HORARIOS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

/* Lista de barberos del negocio con su información y los horarios que ya tienen ocupados */
const BARBEROS = [
  { id: 1, nombre: 'Andrés Gil',   especialidad: 'Cortes clásicos',    color: '#2D4A7A', inicial: 'AG', ocupados: ['09:00','12:00'] },
  { id: 2, nombre: 'Marco Ríos',   especialidad: 'Barba & degradado',  color: '#5A3535', inicial: 'MR', ocupados: ['10:00','14:00'] },
  { id: 3, nombre: 'Felipe Soto',  especialidad: 'Diseños modernos',   color: '#2D4A3A', inicial: 'FS', ocupados: ['11:00','15:00'] },
];

/* Catálogo de servicios disponibles con su precio en pesos colombianos */
const SERVICIOS = [
  { id: 1, nombre: 'Corte de cabello',    precio: 20000 },
  { id: 2, nombre: 'Arreglo de barba',    precio: 15000 },
  { id: 3, nombre: 'Afeitado navaja',     precio: 25000 },
  { id: 4, nombre: 'Degradado',           precio: 22000 },
  { id: 5, nombre: 'Tratamiento capilar', precio: 30000 },
  { id: 6, nombre: 'Cejas',               precio:  8000 },
];

/* ── DATOS DE PRUEBA (15 clientes) ──
   Arreglo inicial de clientes para poblar la tabla mientras no hay backend activo.
   En producción, estos datos vendrían de la API. */
let clientes = [
  { id:  1, documento: '1094900001', nombre: 'Carlos Alberto Pérez',    telefono: '3001234567', email: 'carlos@email.com'   },
  { id:  2, documento: '1094900002', nombre: 'Juan Esteban López',       telefono: '3109876543', email: 'juan@email.com'     },
  { id:  3, documento: '1094900003', nombre: 'Miguel Ángel Torres',      telefono: '3157654321', email: 'miguel@email.com'   },
  { id:  4, documento: '1094900004', nombre: 'Sebastián Díaz Gómez',     telefono: '3204561237', email: 'sebastian@mail.com' },
  { id:  5, documento: '1094900005', nombre: 'Andrés Felipe Ruiz',       telefono: '3002345678', email: 'andres@mail.com'    },
  { id:  6, documento: '1094900006', nombre: 'Diego Alejandro Moreno',   telefono: '3118765432', email: 'diego@email.com'    },
  { id:  7, documento: '1094900007', nombre: 'Julián David Vargas',      telefono: '3163456789', email: 'julian@email.com'   },
  { id:  8, documento: '1094900008', nombre: 'Camilo Ernesto Sánchez',   telefono: '3055678901', email: 'camilo@email.com'   },
  { id:  9, documento: '1094900009', nombre: 'Nicolás Herrera Castillo', telefono: '3177890123', email: 'nicolas@mail.com'   },
  { id: 10, documento: '1094900010', nombre: 'Felipe Andrés Ospina',     telefono: '3209012345', email: 'felipe@email.com'   },
  { id: 11, documento: '1094900011', nombre: 'Santiago Cárdenas Ríos',   telefono: '3001112223', email: 'santiago@mail.com'  },
  { id: 12, documento: '1094900012', nombre: 'David Mauricio Palomino',  telefono: '3133334445', email: 'david@email.com'    },
  { id: 13, documento: '1094900013', nombre: 'Steven Alexander Molina',  telefono: '3165556667', email: 'steven@mail.com'    },
  { id: 14, documento: '1094900014', nombre: 'Cristian Camilo Duque',    telefono: '3197778889', email: 'cristian@email.com' },
  { id: 15, documento: '1094900015', nombre: 'Jonatan Estiven Ramos',    telefono: '3029990001', email: 'jonatan@mail.com'   },
];
