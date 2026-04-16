# App Facturación

## Descripción

`App Facturación` es una API REST desarrollada en Python con FastAPI para la gestión de usuarios y productos dentro de un sistema básico de facturación. La aplicación está preparada para integrarse con una base de datos PostgreSQL y utiliza SQLAlchemy/Alembic para la persistencia y migraciones.

## Tecnologías y dependencias principales

- Python
- FastAPI
- SQLAlchemy
- SQLModel
- Alembic
- PostgreSQL
- Uvicorn
- Pydantic

## Estructura del proyecto

```
requirements.txt
README.md
facturation/
  main.py
  alembic.ini
  alembic/
    env.py
    README
    script.py.mako
    versions/
      2bb7f62fe711_add_new_columns_update_user_table.py
  database/
    base.py
    connection.py
    database_session.py
    dependencies/
      dependencie_session.py
  products/
    routers/
      products.py
  users/
    dependencies/
      user_dependencie.py
    models/
      user_model.py
    routers/
      users.py
    schemas/
      user_schema.py
    services/
      user_service.py
```

## Módulos principales

### `facturation/main.py`

- Crea una instancia de FastAPI.
- Incluye los routers de `products` y `users`.
- Define la ruta raíz `/` que devuelve `{"message": "Hello World"}`.

### `facturation/database/connection.py`

- Configura la conexión a PostgreSQL.
- Cadena de conexión usada:
  `postgresql://postgres:postgres123@localhost:5432/facturation_db`

### `facturation/database/database_session.py`

- Define `SessionLocal` con SQLAlchemy para crear sesiones de base de datos.

### `facturation/database/dependencies/dependencie_session.py`

- Provee la dependencia `get_session` para inyectar la sesión en los endpoints de FastAPI.

### `facturation/users/models/user_model.py`

- Define el modelo `User` con SQLAlchemy.
- Campos:
  - `id`
  - `email`
  - `password`
  - `created_at`
  - `updated_at`

### `facturation/users/schemas/user_schema.py`

- Define los esquemas Pydantic para creación y respuesta de usuarios:
  - `UserCreate`
  - `UserResponse`

### `facturation/users/services/user_service.py`

- Implementa la lógica de negocio para crear un usuario.
- Inserta el usuario en la base de datos y retorna la entidad creada.

### `facturation/users/routers/users.py`

- Define el endpoint `POST /users/` para crear usuarios.
- Usa la dependencia de sesión y el servicio de creación.

### `facturation/products/routers/products.py`

- Define el endpoint `GET /products`.
- Actualmente responde con un mensaje de prueba y no contiene lógica de producto completa.

## Endpoints disponibles

- `GET /` - Verifica el servicio y devuelve un mensaje de bienvenida.
- `POST /users/` - Crea un nuevo usuario con correo y contraseña.
- `GET /products` - Endpoint de productos básico con respuesta de prueba.

## Base de datos y migraciones

- Se usa PostgreSQL como base de datos principal.
- Existe soporte de Alembic para migraciones en `facturation/alembic/`.
- El modelo `User` se mapea a la tabla `users`.

## Cómo ejecutar el proyecto

1. Crear un entorno virtual:

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Ejecutar la aplicación:

```bash
uvicorn facturation.main:app --reload
```

4. Abrir en el navegador:

- Documentación automática de FastAPI: `http://127.0.0.1:8000/docs`

## Notas importantes

- El campo `password` se almacena actualmente en texto plano. Para un entorno productivo es obligatorio usar hashing seguro.
- El endpoint de productos está aún en una fase inicial / demostrativa.
- La configuración de base de datos está codificada en `facturation/database/connection.py`.

## Mejoras recomendadas

- Agregar validación y hashing de contraseñas.
- Completar la lógica de productos y creación de facturas.
- Externalizar la configuración sensible en variables de entorno.
- Añadir pruebas unitarias y de integración.
- Usar migraciones Alembic de forma estructurada para el esquema de la base de datos.
