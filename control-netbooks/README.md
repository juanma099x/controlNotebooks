# Control de Netbooks - Escuela Industrial N°9

Sistema de gestión de inventario y préstamos de netbooks desarrollado para la Escuela Industrial N°9. Esta aplicación permite administrar el stock de computadoras escolares y llevar un registro detallado de los préstamos realizados a los alumnos y cursos.

## 🚀 Tecnologías Utilizadas

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Base de Datos:** SQLite (vía `better-sqlite3`)
-   **ORM:** Drizzle ORM
-   **Validación:** Zod
-   **Iconos:** Lucide React

## 📋 Características Principales

### 💻 Gestión de Inventario
-   **CRUD de Equipos:** Alta, baja, modificación y listado de netbooks.
-   **Control de Estado:** Seguimiento del estado de cada equipo (`Disponible`, `Prestado`, `En Mantenimiento`).
-   **Identificación:** Registro por marca, modelo y número de serie único.

### 📝 Registro de Préstamos
-   **Asignación Rápida:** Préstamo de equipos a alumnos filtrando por curso.
-   **Validación:** El sistema verifica automáticamente que la netbook esté disponible antes de prestarla.
-   **Historial:** Registro de fecha y hora de retiro.

### 🔄 Devoluciones y Seguimiento
-   **Historial Completo:** Visualización de todos los movimientos.
-   **Devolución Simple:** Al marcar un préstamo como "Devuelto", el sistema libera automáticamente la netbook en el inventario para que esté disponible nuevamente.
-   **Edición:** Posibilidad de corregir datos de préstamos pasados.

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd control-netbooks
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Inicializar la Base de Datos:**
    El proyecto utiliza SQLite. Asegúrate de generar el archivo de base de datos (`sqlite.db`) utilizando Drizzle Kit.

    ```bash
    npx drizzle-kit push
    ```

4.  **Cargar Datos de Prueba (Opcional):**
    Puedes poblar el inventario con datos iniciales ejecutando el script de seed incluido.

    ```bash
    npx tsx app/seed.ts
    ```

5.  **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    Abre http://localhost:3000 en tu navegador.

## 🔐 Acceso

El sistema cuenta con un inicio de sesión simple para administradores.
-   **Usuario:** `admin`
-   **Contraseña:** `admin`