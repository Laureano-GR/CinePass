# CinePass

**Sistema web completo de venta de entradas para cines**, desarrollado como proyecto final de la cátedra **Seminario Integrador** (2024).

CinePass cubre el ciclo completo del negocio de un cine: desde la exploración de cartelera y la compra de entradas online por parte del cliente, hasta la gestión administrativa de películas, funciones, ventas y reportes gerenciales por parte del personal del cine.

---

## Tabla de contenidos

- [Características principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Modelo de datos](#modelo-de-datos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Vistas principales](#vistas-principales)
- [API principal (cinepass-api)](#api-principal-cinepass-api)
- [Servicio de autenticación (admin-auth)](#servicio-de-autenticación-admin-auth)
- [Proyecto académico](#proyecto-académico)
- [Mejoras futuras](#mejoras-futuras)
- [Equipo](#equipo)

---

## Características principales

### Lado cliente (público)

- **Selección de sucursal**: el usuario elige la sucursal del cine antes de navegar.
- **Cartelera y búsqueda**: carrusel de banners, listado de películas en cartelera con filtros por nombre, género, clasificación, duración, idioma y tipo de función.
- **Detalle de película y funciones**: ficha de la película y horarios de funciones con sala, idioma y tipo de función.
- **Compra de entradas**:
  - Flujo completo de compra con selección de cantidad de entradas y datos del comprador (nombre, email, tipo y número de documento, método de pago).
  - Validación de disponibilidad de butacas en tiempo real (por capacidad de sala).
  - Generación de **código QR** de entrada y **comprobante de compra**.
  - Compra **online**: envío automático de email con el detalle de la compra y el QR adjunto.
  - Compra **en boletería**: emisión de comprobante en formato de recibo ASCII.

### Lado administrativo (panel de gestión)

- **Autenticación de administradores** con JWT y sistema de **permisos por rol**.
- **ABM de películas**: alta, edición y listado con imagen (póster), descripción, duración, género, clasificación, idiomas y tipos de función.
- **ABM de funciones**: creación y edición de funciones vinculadas a película, sala, sucursal, idioma y tipo de función.
- **Gestión de ventas**:
  - Búsqueda avanzada de ventas por código de compra, número de documento o rango de fechas, con paginación.
  - **Cancelación de ventas** con liberación automática de entradas.
- **Reportes gerenciales** con visualización en tablas y gráficos (Chart.js) y **exportación a Excel (.xlsx)**:
  - Reporte mensual por sucursal: total recaudado, entradas, funciones y ventas; ventas por película; resumen por método de pago.
  - Reporte anual de la cadena: totales generales, top 10 películas y meses con mayor venta.

---

## Arquitectura

El proyecto es un **monorepo** con arquitectura de **frontend y backend desacoplados**, organizado en tres componentes independientes:

1. **Frontend (Angular)** — corre en el puerto `4200` y es una SPA con dos zonas: la cartelera y la compra de entradas (lado cliente) y el panel de administración.
2. **cinepass-api (NestJS + SQLite)** — corre en el puerto `3001` y concentra toda la lógica de negocio: películas, funciones, salas, sucursales, ventas, tickets, envío de emails, generación de QR y reportes. Es consumido directamente por el frontend.
3. **admin-auth (NestJS + SQLite)** — corre en el puerto `3000` y es el servicio encargado de la autenticación de administradores (JWT) y la gestión de permisos.

Ambos servicios backend usan **SQLite** como base de datos, por lo que el proyecto es 100% autocontenido y no requiere de una base de datos externa. Para el envío de comprobantes online, `cinepass-api` se apoya en el servicio de correo **Gmail SMTP (nodemailer)**.

---

## Tecnologías

### Frontend

| Tecnología | Versión | Uso |
| --- | --- | --- |
| Angular | 18.2 | Framework principal (SPA) |
| TypeScript | 5.5 | Lenguaje |
| Bootstrap | 5.3 | Estilos y componentes UI |
| Chart.js | 4.x | Gráficos de reportes |
| Swiper | 11.x | Carrusel de banners |
| Axios | 1.7 | Cliente HTTP |

### Backend (cinepass-api)

| Tecnología | Versión | Uso |
| --- | --- | --- |
| NestJS | 10/11 | Framework principal |
| TypeORM | 0.3 | ORM |
| SQLite | 3.x | Base de datos |
| qrcode | 1.5 | Generación de códigos QR |
| nodemailer | 6.10 | Envío de emails (SMTP Gmail) |
| exceljs | 4.4 | Exportación de reportes a Excel |
| multer | 1.4 | Carga de archivos (pósters/banners) |
| bcrypt | 5.1 | Hashing de contraseñas |

### Backend (admin-auth)

| Tecnología | Versión | Uso |
| --- | --- | --- |
| NestJS | 10 | Framework |
| TypeORM | 0.3 | ORM |
| SQLite | 3.x | Base de datos |
| jsonwebtoken | 9 | Autenticación con JWT |
| bcrypt | 5.1 | Hashing de contraseñas |

---

## Estructura del repositorio

```
CinePass/
├── cinepass-backend/
│   ├── cinepass-api/          # API principal (puerto 3001)
│   │   └── src/
│   │       ├── cinema/        # Sucursales, salas, ciudades, direcciones
│   │       ├── movie/         # Películas, géneros, clasificaciones, idiomas
│   │       ├── show/          # Funciones y tipos de función
│   │       ├── sale/          # Ventas, tickets, pagos y métodos de pago
│   │       ├── email-manager/ # Envío de emails (comprobantes con QR)
│   │       ├── file-upload/   # Carga de pósters y banners
│   │       ├── reports-generator/ # Reportes y exportación a Excel
│   │       ├── _entities/     # Entidades del modelo de datos
│   │       └── _interfaces/   # DTOs y contratos
│   └── admin-auth/            # Servicio de autenticación (puerto 3000)
│       └── src/
│           ├── admin/         # Gestión de administradores
│           ├── jwt/           # Emisión y validación de tokens
│           ├── permissions/   # Permisos por rol
│           └── middlewares/   # AuthGuard
└── cinepass-frontend/
    └── angular-front/         # Frontend Angular (puerto 4200)
        └── src/app/
            ├── home/          # Cartelera y búsqueda de películas
            ├── movie-details/ # Detalle de película
            ├── show-details/  # Detalle de función
            ├── process-sale/  # Flujo de compra de entradas
            ├── select-subsidiary/ # Selección de sucursal
            ├── admin-components/   # Panel de administración
            │   ├── admin-login/    # Login de administradores
            │   ├── admin-dashboard/
            │   ├── movies-crud/    # ABM de películas
            │   ├── shows-crud/     # ABM de funciones
            │   ├── sales-admin/    # Búsqueda y gestión de ventas
            │   └── reports-visualizer/ # Reportes y gráficos
            └── shared-components/  # Modales y pantalla de carga
```

---

## Modelo de datos

La API principal modela el dominio del negocio con las siguientes entidades:

- **City** y **Address**: ubicaciones y domicilios.
- **Subsidiary**: sucursales del cine (cada una con sus salas).
- **Room**: salas, con su **capacidad** de butacas.
- **Movie**: películas con póster, descripción, duración, género y clasificación.
- **Genre**, **ContentRating**, **Language**, **ShowType**: catálogos de clasificación.
- **Show**: funciones, uniendo película + sala + sucursal + idioma + tipo de función + fecha/hora.
- **Sale**: ventas con monto total, cantidad de entradas y estado de cancelación.
- **Ticket**: entradas individuales de cada venta, numeradas por función.
- **PaymentData**, **PaymentMethod**, **IDType**: datos del comprador y método de pago.

---

## Instalación y puesta en marcha

Requisitos previos: **Node.js 18+** y **npm**.

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/CinePass.git
cd CinePass
```

### 2. Instalar dependencias

Instalar las dependencias de cada módulo:

```bash
cd cinepass-backend/cinepass-api && npm install
cd ../../cinepass-backend/admin-auth && npm install
cd ../../cinepass-frontend/angular-front && npm install
```

### 3. Configurar el servicio de email (opcional)

Para que el envío de comprobantes online funcione, se necesita una cuenta SMTP. El servicio de email se configura en `cinepass-backend/cinepass-api/src/email-manager/email-manager.service.ts`. En un entorno de producción las credenciales deben moverse a variables de entorno y nunca quedar en el código.

### 4. Levantar los servicios

Cada módulo se ejecuta en una terminal distinta:

**Backend - servicio de autenticación** (puerto 3000):

```bash
cd cinepass-backend/admin-auth
npm run start:dev
```

**Backend - API principal** (puerto 3001):

```bash
cd cinepass-backend/cinepass-api
npm run start:dev
```

**Frontend** (puerto 4200):

```bash
cd cinepass-frontend/angular-front
npm start
```

Luego abrir la aplicación en **http://localhost:4200**.

> Las bases de datos SQLite (`cinepass.db` y `admins.db`) se crean automáticamente en el primer arranque. La carpeta `uploads/` contiene los banners y pósters que se sirven estáticamente en `/banners`.

### Scripts útiles

- **Backends** (NestJS): `npm run start` (producción), `npm run start:dev` (watch), `npm run build`, `npm run lint`, `npm test`.
- **Frontend** (Angular): `npm start`, `npm run build`, `npm test`.

---

## Vistas principales

| Vista | Ruta | Descripción |
| --- | --- | --- |
| Selección de sucursal | `/select-subsidiary` | Elección de la sucursal para operar |
| Inicio / Cartelera | `/` | Banners y películas en cartelera con filtros |
| Detalle de película | `/movie-details/:id` | Ficha de la película y sus funciones |
| Detalle de función | `/show-details/:id` | Horario, sala, idioma y tipo de función |
| Compra de entradas | `/purchase/:showId` | Flujo completo de compra |
| Login admin | `/admin-login` | Ingreso de administradores |
| Dashboard | `/admin/dashboard` | Panel principal de gestión |
| Películas (ABM) | `/admin/movies/*` | Alta, edición y listado de películas |
| Funciones (ABM) | `/admin/shows/*` | Alta, edición y listado de funciones |
| Ventas | `/admin/sales/*` | Búsqueda, cancelación y alta de ventas |
| Reportes | `/admin/reports/:report` | Reportes mensuales/anuales con gráficos y exportación |

---

## API principal (cinepass-api)

Todos los endpoints responden en **http://localhost:3001**.

### Ventas

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/sales` | Procesa una venta (valida disponibilidad, crea entradas, genera QR y envía email si es online) |
| `GET` | `/sales` | Lista todas las ventas |
| `GET` | `/sales/:id` | Obtiene una venta por id |
| `POST` | `/sales/find` | Búsqueda avanzada (código, documento, rango de fechas, paginación) |
| `PUT` | `/sales/update/:id` | Actualiza una venta |
| `PUT` | `/sales/cancel/:id` | Cancela una venta y libera sus entradas |

### Reportes

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/reports-generator/subsidiary-monthly-report` | Reporte mensual de una sucursal (`subsidiaryId`, `month` MM, `year` YYYY) |
| `GET` | `/reports-generator/cinema-yearly-report` | Reporte anual de la cadena (`year` YYYY) |
| `POST` | `/reports-generator/export` | Exporta los datos del reporte a un archivo Excel |

### Películas, funciones y catálogos

El servicio expone CRUDs para las entidades del dominio: películas, géneros, clasificaciones, idiomas, tipos de función, funciones, salas, sucursales, ciudades, direcciones, tipos de documento, métodos de pago y tickets.

---

## Servicio de autenticación (admin-auth)

Todos los endpoints responden en **http://localhost:3000**.

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/admins/register` | Registro de un administrador |
| `POST` | `/admins/login` | Inicio de sesión (devuelve JWT) |
| `GET` | `/admins/me` | Datos del admin autenticado (protegido) |
| `GET` | `/admins/refresh-token` | Renovación del token |
| `GET` | `/admins/can-do/:permission` | Verifica un permiso del admin (protegido) |
| `GET` | `/admins` | Lista de administradores |
| `PUT` | `/admins/update/:id` | Actualiza un administrador |
| `DELETE` | `/admins/delete/:id` | Elimina un administrador |
| `POST` | `/admins/:id/permissions` | Asigna permisos a un administrador |

La autenticación usa **bcrypt** para hashear las contraseñas y **JWT** para las sesiones, con un guard (`AuthGuard`) que protege los recursos administrativos.

---

## Proyecto académico

CinePass nació como el **proyecto integrador final** de la cátedra **Seminario Integrador** (2024) de la carrera de **Analista de Sistemas**, desarrollado en conjunto por dos personas. El objetivo era poner en práctica el ciclo de vida completo de un desarrollo de software:

- Análisis y relevamiento de requerimientos de un caso real (venta de entradas de cine).
- Diseño del modelo de datos y de la arquitectura de la solución.
- Implementación de un sistema full-stack funcional.
- Manejo de funcionalidades complejas: concurrencia en la venta de entradas, envío de emails, generación de códigos QR y reportes gerenciales.

A lo largo del proyecto se aplicaron conocimientos de:

- Desarrollo **frontend** con Angular y TypeScript.
- Desarrollo **backend** con NestJS, TypeORM y bases de datos SQL.
- Autenticación, autorización y control de acceso por permisos.
- Manejo de **concurrencia** y consistencia transaccional.
- Integración con servicios externos (SMTP, generación de archivos).

---

## Mejoras futuras

- Migrar las bases de datos de SQLite a un motor de producción (PostgreSQL/MySQL).
- Mover credenciales y configuración a variables de entorno.
- Agregar pruebas unitarias y de integración más completas.
- Sección de "mis compras" para que el cliente consulte sus entradas.
- Pasarela de pagos real integrada.
- Sistema de manejo de butacas específicas (numeradas por asiento).
- Deploy automatizado (CI/CD) y contenedorización con Docker.

---

## Equipo

CinePass fue desarrollado por un equipo de dos personas durante el Seminario Integrador 2024.
