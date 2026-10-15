# Mini Sistema de Inventario

Aplicación web Full Stack para la administración de un inventario de productos.

Desarrollada como prueba técnica para el puesto de **Desarrollador Full Stack Junior** de Technology Factory Consulting.

## 1. Descripción del proyecto

El Mini Sistema de Inventario permite administrar un catálogo de productos mediante una interfaz web conectada a una API REST.

Los usuarios pueden registrar, consultar, modificar y eliminar productos. La información se almacena en PostgreSQL y se mantiene disponible entre reinicios gracias a un volumen persistente de Docker.

La aplicación utiliza una arquitectura cliente-servidor con separación de responsabilidades entre frontend, backend y base de datos.

## 2. Tecnologías utilizadas

| Área                 | Tecnología                 |
| -------------------- | -------------------------- |
| Backend              | Java 21, Spring Boot 3.5   |
| Frontend             | React, Vite, JavaScript    |
| Base de datos        | PostgreSQL 16              |
| Persistencia         | Spring Data JPA, Hibernate |
| Validaciones         | Jakarta Bean Validation    |
| Pruebas              | JUnit 5, Mockito           |
| Servidor web         | Nginx                      |
| Contenedores         | Docker, Docker Compose     |
| Control de versiones | Git, GitHub                |

## 3. Funcionalidades implementadas

- Registrar nuevos productos.
- Consultar el listado de productos.
- Consultar productos individuales mediante la API.
- Editar productos existentes.
- Eliminar productos previa confirmación.
- Validar campos obligatorios y valores numéricos.
- Mostrar mensajes de error cuando una operación falla.
- Actualizar la tabla automáticamente después de crear, editar o eliminar.
- Almacenar los productos en PostgreSQL.
- Ejecutar los tres servicios mediante Docker Compose.

## 4. Modelo de datos

Cada producto contiene los siguientes campos:

| Campo       | Tipo       | Restricción                        |
| ----------- | ---------- | ---------------------------------- |
| ID          | Long       | Identificador autogenerado         |
| Nombre      | String     | Obligatorio, máximo 120 caracteres |
| Descripción | String     | Opcional                           |
| Precio      | BigDecimal | Obligatorio, mayor a cero          |
| Stock       | Integer    | Obligatorio, mayor o igual a cero  |
| Categoría   | String     | Opcional                           |

El modelo se implementa mediante una entidad JPA.

Hibernate gestiona la actualización del esquema utilizando `ddl-auto=update`.

## 5. Arquitectura

El sistema está organizado en tres servicios:

1. **Frontend:** aplicación React compilada con Vite y servida por Nginx.
2. **Backend:** API REST desarrollada con Spring Boot.
3. **Base de datos:** PostgreSQL 16 con almacenamiento persistente.

Flujo de comunicación:

```text
Navegador
    |
    v
Frontend - React / Nginx
    |
    | HTTP /api/products
    v
Backend - Spring Boot
    |
    | Spring Data JPA / Hibernate
    v
PostgreSQL
```

Nginx redirige las peticiones `/api/` hacia el servicio `backend`.

Dentro de la red de Docker, Spring Boot utiliza el nombre del servicio `db` para conectarse a PostgreSQL.

## 6. Estructura del proyecto

```text
inventory-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── components/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

El backend está dividido en capas de controlador, servicio, repositorio, entidad, DTO, mapper y manejo de excepciones.

El frontend utiliza componentes reutilizables para la interfaz y el formulario de productos.

## 7. Requisitos previos

Para ejecutar la aplicación completa con Docker se necesita:

- Git para clonar el repositorio.
- Docker Desktop o Docker Engine.
- Docker Compose V2.
- Docker Desktop en ejecución, si se utiliza Windows.

No es necesario instalar Java, Maven, Node.js o PostgreSQL en la computadora para ejecutar la solución mediante Docker Compose.

Docker construye las imágenes y administra las dependencias necesarias.

## 8. Instalación y ejecución con Docker

### Paso 1. Clonar el repositorio

```bash
git clone https://github.com/Houruss/inventory-management-system.git
cd inventory-management-system
```

### Paso 2. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto, utilizando como referencia `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Este comando solo es necesario si el archivo `.env` todavía no existe.

Verificar que el archivo contenga estas variables:

```dotenv
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASSWORD=coloca_aqui_una_contrasena_segura
```

Los valores anteriores son un ejemplo. Se debe configurar una contraseña propia.

**Importante:** el archivo `.env` contiene credenciales y no debe subirse al repositorio público.

### Paso 3. Construir y ejecutar los servicios

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Este comando construye las imágenes de frontend y backend e inicia los tres servicios:

- `db`: PostgreSQL.
- `backend`: Spring Boot.
- `frontend`: React servido por Nginx.

El backend espera a que PostgreSQL esté disponible antes de iniciar.

La primera ejecución puede tardar varios minutos debido a la descarga de imágenes y la instalación de dependencias.

### Paso 4. Acceder a la aplicación

Una vez que los servicios estén funcionando:

| Servicio   | Dirección                          |
| ---------- | ---------------------------------- |
| Frontend   | http://localhost:3000              |
| API REST   | http://localhost:8080/api/products |
| PostgreSQL | localhost:5433                     |

PostgreSQL utiliza el puerto `5432` dentro de Docker, expuesto en el puerto `5433` de la máquina anfitriona.

### Paso 5. Verificar los contenedores

En otra terminal:

```bash
docker compose ps
```

Para consultar los registros:

```bash
docker compose logs -f
```

También se pueden consultar los registros de un servicio:

```bash
docker compose logs -f backend
```

### Paso 6. Detener la aplicación

Si Docker Compose está ejecutándose en primer plano, presionar `Ctrl + C`.

Para detener y eliminar los contenedores:

```bash
docker compose down
```

El volumen de PostgreSQL se conserva, por lo que los productos registrados permanecen almacenados.

No utilizar `docker compose down -v` si se desea conservar la información, ya que ese comando elimina los volúmenes administrados por Compose.

## 9. API REST

La API utiliza el prefijo `/api/products`.

| Método | Endpoint           | Descripción         | Respuesta exitosa |
| ------ | ------------------ | ------------------- | ----------------- |
| GET    | /api/products      | Listar productos    | 200 OK            |
| GET    | /api/products/{id} | Consultar producto  | 200 OK            |
| POST   | /api/products      | Crear producto      | 201 Created       |
| PUT    | /api/products/{id} | Actualizar producto | 200 OK            |
| DELETE | /api/products/{id} | Eliminar producto   | 204 No Content    |

### Ejemplo de creación de producto

Solicitud:

```http
POST /api/products
Content-Type: application/json
```

Cuerpo JSON:

```json
{
  "name": "Monitor Samsung",
  "description": "Monitor Full HD de 24 pulgadas",
  "price": 1250.0,
  "stock": 8,
  "category": "Monitores"
}
```

El backend asigna automáticamente el identificador del producto.

### Validaciones

El servidor valida las siguientes reglas:

- El nombre no puede estar vacío.
- El nombre permite un máximo de 120 caracteres.
- El precio debe ser mayor que cero.
- El precio permite hasta dos decimales.
- El stock debe ser un número entero mayor o igual a cero.

Cuando los datos son inválidos, la API devuelve `400 Bad Request` con información del error.

Cuando se solicita un producto inexistente, devuelve `404 Not Found`.

## 10. Pruebas

El backend incluye pruebas unitarias con JUnit 5 y Mockito.

Entre los casos implementados están:

- Consultar un producto inexistente y verificar la excepción correspondiente.
- Eliminar un producto existente y verificar la operación del repositorio.

Para ejecutar la clase de pruebas del servicio desde PowerShell:

```powershell
cd backend
.\mvnw.cmd "-Dtest=ProductServiceTest" test
```

También se han comprobado manualmente las operaciones CRUD mediante la interfaz React y la API REST.

## 11. Decisiones técnicas

### Separación de responsabilidades

El backend utiliza una arquitectura en capas para mantener separadas las solicitudes HTTP, la lógica de negocio y el acceso a los datos.

### DTO y Mapper

Se utilizan objetos DTO para definir los datos de entrada y salida de la API.

Un componente Mapper convierte entre los DTO y las entidades JPA.

### Validaciones

Jakarta Bean Validation permite validar los datos recibidos antes de ejecutar operaciones sobre la base de datos.

### Manejo global de excepciones

Un manejador global centraliza las respuestas de errores de validación y productos inexistentes.

### Persistencia de datos

PostgreSQL utiliza un volumen de Docker para conservar los registros entre reinicios de contenedores.

### Comunicación entre frontend y backend

En desarrollo, Vite utiliza un proxy para las peticiones `/api`.

En Docker, Nginx realiza la misma función y redirige las solicitudes hacia Spring Boot.

De esta manera, el navegador realiza las peticiones a través del mismo origen del frontend.

### Construcción multietapa

Los Dockerfiles separan la compilación y la ejecución.

El backend se compila mediante Maven y se ejecuta con Java 21.

El frontend se compila con Node.js y se sirve mediante Nginx.

## 12. Estado del proyecto

Las funcionalidades principales del sistema de inventario se encuentran implementadas.

Se ha comprobado el funcionamiento conjunto de React, Spring Boot y PostgreSQL mediante Docker Compose, incluyendo creación, consulta, edición y eliminación de productos.

## 13. Autor

**Antony López**

Prueba técnica para el puesto de Desarrollador Full Stack Junior.

Technology Factory Consulting.
