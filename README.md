# BlockTrack

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-11.x-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![GraphQL](https://img.shields.io/badge/GraphQL-16.x-magenta.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.x-teal.svg)
![SQLite](https://img.shields.io/badge/SQLite-3.x-blue.svg)

## Real-time Crypto Token Leaderboard & Favorites Tracker

BlockTrack is a full-stack application designed to provide a real-time leaderboard of cryptocurrency tokens sorted by market capitalization. Authenticated users can select and store their favorite tokens, view historical price data, and manage their profiles. The project emphasizes a clean architecture for maintainability and scalability.

---

## Frontend

*(This section will be updated once the frontend development is underway.)*

---

## Backend

### 🌟 Key Features

- **Token Leaderboard**: Displays a list of crypto tokens fetched from CoinGecko, sorted by market cap, and refreshed periodically.
- **Token Details**: View detailed information for individual tokens, including historical price data (data points).
- **User Authentication**: Secure account creation, login, and session management using JWT.
- **User Profile Management**: Authenticated users can view, update, and delete their profiles.
- **Favorite Token Management**: Users can add tokens to their favorites list and remove them.
- **GraphQL API**: Modern and efficient API for data retrieval and mutations.
- **Data Persistence**: Utilizes SQLite via Prisma ORM for storing user data, favorites, and cached token information.
- **Scheduled Data Refresh**: Automatic refresh of token market data and historical data points to ensure up-to-date information.

### 🔧 Tech Stack

- **Framework**: NestJS 11.x (Node.js)
- **API**: GraphQL with Apollo Server
- **Database**: SQLite
- **ORM**: Prisma 6.x
- **Authentication**: JWT (JSON Web Tokens) via `@nestjs/jwt` and Passport.js
- **Data Fetching (External)**: CoinGecko API via `@nestjs/axios`
- **Configuration**: `@nestjs/config` for environment-based settings
- **Architecture**: Uncle Bob’s Clean Architecture (Domain → Use Cases → Interface Adapters → Frameworks/Drivers)
- **Development Environment**: Arch Linux, Visual Studio Code

### 🏗️ Architecture

The backend follows Clean Architecture principles to ensure a separation of concerns, testability, and maintainability:
- **Domain**: Contains core business logic, entities, and repository interfaces.
- **Use Cases (Application Business Rules)**: Orchestrates the flow of data to and from the domain layer, implementing specific application functionalities.
- **Interface Adapters**: Connects use cases to external frameworks, handling data transformation (e.g., GraphQL Resolvers, DTOs).
- **Frameworks & Drivers**: The outermost layer, including the database (Prisma/SQLite), web framework (NestJS), and external APIs.

### 📚 API Documentation (GraphQL)

The GraphQL API is the primary interface for the backend. It can be explored using any GraphQL client (e.g., Apollo Studio, Insomnia, Postman) or the built-in GraphQL Playground.

- **GraphQL Endpoint**: `http://localhost:3000/graphql` (default port)
- **GraphQL Playground**: Accessible at the same URL in a browser during development.

#### Authentication
Most mutations and some queries (like `me`) require authentication. Include a JWT Bearer token in the `Authorization` header:
`Authorization: Bearer <YOUR_JWT_TOKEN>`

#### Main Queries & Mutations
(Refer to `src/schema.gql` for the full, auto-generated schema)

**Queries:**
- `tokens: [TokenEntity!]!`: Get the list of all tokens, ordered by rank.
- `token(input: GetTokenInput!): TokenEntity`: Get details for a specific token by ID or symbol.
- `me: UserEntity!`: (Authenticated) Get the profile of the currently logged-in user.
- `isTokenValid: Boolean!`: (Authenticated) Checks if the current authentication token is valid.

**Mutations:**
- `createUser(createUserData: CreateUserInput!): UserEntity!`: Create a new user account.
- `login(loginData: LoginInput!): AuthPayload!`: Log in an existing user and receive a JWT.
- `updateUser(updateUserData: UpdateUserInput!): UserEntity!`: (Authenticated) Update the current user's profile.
- `deleteUser(id: ID!): ID!`: (Authenticated) Delete the current user's profile.
- `addFavoriteToken(input: FavoriteTokenInput!): TokenEntity!`: (Authenticated) Add a token to the user's favorites.
- `removeFavoriteToken(input: FavoriteTokenInput!): TokenEntity!`: (Authenticated) Remove a token from the user's favorites.

### 🚀 Getting Started

#### Prerequisites
- Node.js (v18.x LTS or later recommended)
- npm (v9.x or later) or yarn
- (Optional but recommended for local dev) Git

#### Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd blocktrack/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `backend` directory by copying from a potential `.env.example` (if provided) or create it manually. Key variables:
    ```env
    DATABASE_URL="file:./dev.db" # Path to your SQLite database file
    PORT=3000                   # Port the backend server will run on

    # JWT Configuration
    JWT_SECRET="YOUR_VERY_SECRET_JWT_KEY_CHANGE_ME" # Change this to a strong, random secret
    JWT_EXPIRES_IN="1h"                             # How long tokens are valid

    # Data Refresh Intervals (in milliseconds)
    ALL_TOKENS_REFRESH_INTERVAL_MS=3600000  # e.g., 1 hour (1 * 60 * 60 * 1000)
    DATA_POINTS_REFRESH_INTERVAL_MS=3600000 # e.g., 1 hour
    ```
    **Important:** Ensure `JWT_SECRET` is strong and kept private in production.

4.  **Database Setup (Prisma):**
    Apply database migrations to set up the schema:
    ```bash
    npx prisma migrate dev --name init
    ```
    (You can choose a different migration name if `init` already exists from your previous setup).

5.  **Seed the Database (Optional but Recommended for Dev):**
    Populate the database with initial data (sample user, tokens):
    ```bash
    npm run seed
    ```

#### Running the Application

-   **Development Mode (with hot-reloading):**
    ```bash
    npm run start:dev
    ```
    The application will typically be available at `http://localhost:3000`.

-   **Production Mode:**
    1.  Build the application:
        ```bash
        npm run build
        ```
    2.  Start the application:
        ```bash
        npm run start:prod
        ```
        Ensure `NODE_ENV=production` is set in your production environment for optimal performance and security (e.g., to hide stack traces).

### 🌲 Project Structure Overview

- **`src/`**: Main application source code.
  - **`config/`**: Application configuration files (e.g., `app-config.ts`).
  - **`domain/`**: Core business logic, entities, and repository interfaces (organized by feature, e.g., `token/domain`, `user/domain`).
  - **`use-cases/`**: Application-specific business rules, orchestrating domain logic (organized by feature).
  - **`interface-adapters/`**: Connects use cases to external frameworks (e.g., GraphQL Resolvers, DTOs).
  - **`infrastructure/`**: Implementations for external concerns like databases (Prisma repositories), authentication services.
  - **`prisma/`**: Prisma schema (`schema.prisma`), migrations, and seeding scripts.
  - **`main.ts`**: Application entry point.
  - **`app.module.ts`**: Root application module.
  - **`schema.gql`**: Auto-generated GraphQL schema.
- **`.env`**: Environment variables (not committed to Git).
- **`package.json`**: Project dependencies and scripts.
- **`tsconfig.json`**: TypeScript configuration.

### ⚙️ Available Scripts

- `npm run start:dev`: Start the application in development mode with hot-reloading.
- `npm run build`: Build the application for production.
- `npm run start:prod`: Start the built application (production mode).
- `npm run lint`: Lint the codebase.
- `npm run format`: Format the codebase with Prettier.
- `npm run seed`: Seed the database with initial data.
- `npx prisma migrate dev`: Apply database migrations.
- `npx prisma studio`: Open Prisma Studio to view/edit database.

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-new-feature`).
5. Open a Pull Request.

### 📄 License

This project is licensed under the MIT License.