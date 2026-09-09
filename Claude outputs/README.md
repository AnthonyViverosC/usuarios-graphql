# usuarios-graphql

API GraphQL para la gestión de usuarios (CRUD completo), construida con Node.js, Express y MySQL.

## Requisitos

- Node.js 18 o superior
- MySQL 8 o superior en ejecución
- npm

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repositorio>
cd usuarios-graphql
npm install
```

## Configuración

### 1. Variables de entorno

El archivo de configuración se lee desde `src/.env`. Crea el tuyo a partir de la plantilla:

```bash
# Windows (PowerShell)
copy src\.env.example src\.env

# Linux / macOS / Git Bash
cp src/.env.example src/.env
```

Luego ajusta los valores según tu instalación de MySQL:

| Variable      | Descripción                        | Ejemplo       |
| ------------- | ---------------------------------- | ------------- |
| `PORT`        | Puerto del servidor HTTP           | `4000`        |
| `DB_HOST`     | Host del servidor MySQL            | `localhost`   |
| `DB_PORT`     | Puerto de MySQL                    | `3306`        |
| `DB_USER`     | Usuario de la base de datos        | `root`        |
| `DB_PASSWORD` | Contraseña del usuario             | `admin`       |
| `DB_NAME`     | Nombre de la base de datos         | `graphql_db`  |

> El archivo `src/.env` contiene credenciales y **no debe subirse al repositorio**.

### 2. Base de datos

Crea la base de datos y la tabla `users`:

```sql
CREATE DATABASE IF NOT EXISTS graphql_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE graphql_db;

CREATE TABLE IF NOT EXISTS users (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE
);
```

Puedes guardar este script en `src/database.sql` y ejecutarlo con:

```bash
mysql -u root -p < src/database.sql
```

## Ejecución

| Comando         | Descripción                                          |
| --------------- | ---------------------------------------------------- |
| `npm start`     | Inicia el servidor en modo producción                |
| `npm run dev`   | Inicia el servidor con nodemon (recarga automática)  |
| `npm test`      | Ejecuta las pruebas con el runner nativo de Node     |

```bash
npm run dev
```

Si la conexión con MySQL es correcta, verás en consola:

```
Servicio en http://localhost:4000/graphql
```

Si las credenciales fallan, el proceso termina mostrando `No fue posible conectar con MySQL`.

## Endpoints

| Método    | Ruta       | Descripción                        |
| --------- | ---------- | ---------------------------------- |
| `GET`     | `/health`  | Verificación del estado del servicio |
| `POST`    | `/graphql` | Punto de entrada de la API GraphQL |

## Esquema GraphQL

```graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(input: UserInput!): User!
  updateUser(id: ID!, input: UserInput!): User!
  deleteUser(id: ID!): DeleteResult!
}
```

## Ejemplos de uso

Listar todos los usuarios:

```graphql
query {
  users {
    id
    name
    email
  }
}
```

Consultar un usuario por su identificador:

```graphql
query {
  user(id: 1) {
    id
    name
    email
  }
}
```

Crear un usuario:

```graphql
mutation {
  createUser(input: { name: "Ana Torres", email: "ana@ejemplo.com" }) {
    id
    name
    email
  }
}
```

Actualizar un usuario:

```graphql
mutation {
  updateUser(id: 1, input: { name: "Ana T.", email: "ana.t@ejemplo.com" }) {
    id
    name
    email
  }
}
```

Eliminar un usuario:

```graphql
mutation {
  deleteUser(id: 1) {
    success
    message
  }
}
```

Petición equivalente con `curl`:

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name email } }"}'
```

## Estructura del proyecto

```
usuarios-graphql/
├── package.json
├── README.md
└── src/
    ├── index.js              # Configuración de Express y arranque del servidor
    ├── database.sql          # Script de creación de la base de datos
    ├── .env                  # Variables de entorno (no versionado)
    ├── .env.example          # Plantilla de variables de entorno
    ├── config/
    │   └── db.js             # Pool de conexiones a MySQL
    └── graphql/
        ├── schemas.js        # Definición del esquema GraphQL
        └── resolvers.js      # Lógica de las consultas y mutaciones
```

## Tecnologías

- **Express 5** — servidor HTTP
- **graphql** y **graphql-http** — capa GraphQL
- **mysql2** — cliente MySQL con soporte de promesas y pool de conexiones
- **dotenv** — carga de variables de entorno
- **cors** — control de acceso entre orígenes
- **nodemon** — recarga automática en desarrollo

## Licencia

ISC
