# Mini Sistema de Inventario

## Descripción del proyecto

Este proyecto tiene como objetivo desarrollar una aplicación web Full Stack para la administración de un inventario de productos.

El sistema permitirá registrar, consultar, actualizar y eliminar productos mediante una interfaz web conectada a una API REST.

La solución se desarrollará utilizando una arquitectura que facilite la separación de responsabilidades, la organización del código y el mantenimiento de la aplicación.

## Tecnologías utilizadas

| Área                 | Tecnología                  |
| -------------------- | --------------------------- |
| Backend              | Java y Spring Boot 3.x      |
| Frontend             | React y Vite                |
| Base de datos        | PostgreSQL                  |
| Persistencia         | Spring Data JPA / Hibernate |
| Contenedores         | Docker y Docker Compose     |
| Control de versiones | Git y GitHub                |

## Funcionalidades previstas

- Registro de nuevos productos.
- Consulta del listado de productos.
- Consulta de información individual.
- Actualización de productos existentes.
- Eliminación de productos con confirmación previa.
- Validación de los datos ingresados.
- Persistencia de los registros en PostgreSQL.

## Modelo de datos

Cada producto contará con los siguientes atributos:

| Campo       | Descripción                               |
| ----------- | ----------------------------------------- |
| ID          | Identificador único                       |
| Nombre      | Nombre obligatorio                        |
| Descripción | Información adicional opcional            |
| Precio      | Valor monetario mayor a cero              |
| Stock       | Cantidad disponible, igual o mayor a cero |
| Categoría   | Clasificación opcional                    |

## Arquitectura del sistema

El proyecto seguirá una arquitectura cliente-servidor.

El frontend, desarrollado con React, será responsable de la presentación de información y la interacción con el usuario.

El backend, implementado con Spring Boot, expondrá servicios REST para gestionar las operaciones de inventario y comunicarse con PostgreSQL mediante Spring Data JPA.

La infraestructura se organizará mediante Docker Compose, permitiendo ejecutar los componentes del sistema en contenedores independientes.

## Estructura del proyecto

La estructura prevista será:

```text
inventory-management-system/
├── backend/
├── frontend/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Requisitos previos

Para ejecutar la aplicación mediante contenedores se requerirá Docker Desktop o una instalación compatible de Docker Engine con Docker Compose.

Para desarrollo local fuera de contenedores se utilizarán Java, Node.js y npm, según las versiones compatibles con el proyecto.

## Instalación y ejecución

**Pendiente de verificar al completar la integración con Docker.**

El procedimiento previsto para iniciar los servicios desde la raíz del repositorio es:

```bash
docker compose up --build
```

Las instrucciones definitivas, configuración de variables de entorno y pasos de verificación se incorporarán después de probar la aplicación completa.

## Acceso a los servicios

Los puertos definitivos se documentarán una vez configurados y comprobados los contenedores.

- Frontend: pendiente de configurar.
- API REST: pendiente de configurar.
- Base de datos: servicio PostgreSQL interno de Docker Compose.

## API REST

La API implementará las siguientes operaciones:

| Método | Endpoint           | Descripción            |
| ------ | ------------------ | ---------------------- |
| GET    | /api/products      | Listar productos       |
| GET    | /api/products/{id} | Consultar un producto  |
| POST   | /api/products      | Crear un producto      |
| PUT    | /api/products/{id} | Actualizar un producto |
| DELETE | /api/products/{id} | Eliminar un producto   |

## Decisiones técnicas

Se utilizará Spring Boot para organizar la lógica del backend en capas y facilitar la construcción de servicios REST.

React permitirá desarrollar una interfaz basada en componentes reutilizables.

PostgreSQL proporcionará almacenamiento relacional, mientras que Docker Compose permitirá organizar la ejecución de los servicios.

Las decisiones adicionales y los detalles de implementación se documentarán conforme avance el desarrollo.

## Estado de implementación

La aplicación se encuentra en su etapa inicial de configuración y organización. Las funcionalidades, los contenedores y sus pruebas se incorporarán progresivamente.

## Autor

Antony López

Prueba técnica para el puesto de Desarrollador Full Stack Junior.
