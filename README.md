# BARBER-STYLE

Sistema de gestión para la barbería orientado al agendamiento de citas, que permite a los clientes reservar servicios de manera rápida y sencilla, y al negocio administrar horarios, barberos y disponibilidad.


# Características principales

- Agendamiento de citas.
- Selección de barbero y horario disponible.
- Selección de servicios de barbería.
- CRUD completo de clientes.
- Validaciones de formularios.
- Búsqueda y paginación de clientes.
- Interfaz moderna y responsive.
- ntegración con API REST.


# Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- API REST


# Estructura del proyecto

```bash
BARBER-STYLE/
│
├── app.js 
├── header-fondo.jpg
├── index.html  
├── logo.png 
├── README.md
└── styles.css
```

# Instrucciones para ejecutar el proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/julianaVL07/BARBER-STYLE.git
```

## 2. Abrir el proyecto

Abrir la carpeta del proyecto en Visual Studio Code o cualquier editor compatible.

## 3. Ejecutar el frontend

Abrir el archivo:

```bash
index.html
```

También puede ejecutarse usando la extensión **Live Server** de Visual Studio Code.

## 4. Ejecutar el backend

El sistema consume una API REST configurada en:

```bash
http://localhost:8080/api
```

Asegurarse de tener el backend ejecutándose antes de probar las operaciones de guardado y edición.


# Usuarios de prueba (Demo)

El sistema incluye registros precargados para pruebas del CRUD de clientes.

Documento	Nombre	                Teléfono	Email
1094900001	Carlos Alberto Pérez	3001234567	carlos@gmail.com
1094900002	Juan Esteban López	    3109876543	juan@gmail.com
1094900003	Miguel Ángel Torres	    3157654321	miguel@gmail.com
1094900004	Sebastián Díaz Gómez	3204561237	sebastian@gmail.com
1094900005	Andrés Felipe Ruiz	    3002345678	andres@gmail.com
1094900006	Felipe Castro Ramírez	3014567890	felipe@gmail.com
1094900007	Nicolás Herrera Gómez	3126547890	nicolas@gmail.com
1094900008	Santiago Ramírez López	3209871234	santiago@gmail.com
1094900009	Daniel Castaño Ríos	    3112349876	daniel@gmail.com
1094900010	Mateo Giraldo Vélez	    3154561230	mateo@gmail.com
1094900011	Esteban Martínez Ruiz	3187654321	esteban@gmail.com
1094900012	Kevin Andrés Salazar	3008765432	kevin@gmail.com
1094900013	Juan David Osorio	    3104567891	juandavid@gmail.com
1094900014	Cristian Velasco Gómez	3019876543	cristian@gmail.com
1094900015	Alejandro Franco Pérez	3201239876	alejandro@gmail.com


# Flujo principal del sistema

1. El usuario ingresa sus datos.
2. Selecciona un barbero.
3. Escoge un horario disponible.
4. Selecciona los servicios deseados.
5. Confirma la cita.
6. El sistema registra la información y muestra una notificación de éxito.


# Validaciones implementadas

- Documento obligatorio.
- Nombre obligatorio.
- Teléfono válido de 10 dígitos.
- Validación de correo electrónico.
- Selección obligatoria de:

  - barbero,
  - horario,
  - mínimo un servicio.


# Funcionalidades CRUD

El módulo de clientes permite:

- Crear clientes.
- Consultar clientes.
- Editar clientes.
- Eliminar clientes.
- Buscar clientes en tiempo real.
- Navegar mediante paginación.


# Accesibilidad

El sistema incluye:

- Etiquetas semánticas HTML.
- Uso de atributos ARIA.
- Navegación mediante teclado.
- Mensajes visuales de validación.


# Autores

Proyecto desarrollado por el equipo de trabajo para la gestión de barbería BARBER STYLE.


- Juliana Villota López
- Sara Sofia Bolaños Pelayo
- Santiago Arias Rodriguez
