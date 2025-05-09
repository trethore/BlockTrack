# BlockTrack Backend

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-11.0.1-brightgreen.svg)
![GraphQL](https://img.shields.io/badge/GraphQL-16.11.0-magenta.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.7.0-teal.svg)
![SQLite](https://img.shields.io/badge/SQLite-3.x-blue.svg)

## Real-time Crypto Token Leaderboard & Favorites Tracker

BlockTrack is a full-stack application designed to provide a real-time leaderboard of cryptocurrency tokens sorted by market capitalization. Authenticated users can select and store their favorite tokens, view historical price data, and manage their profiles. The project emphasizes a clean architecture for maintainability and scalability.

This README focuses on the **Backend** part of the BlockTrack application.

---

## Frontend

*(The frontend is a React application. Refer to the frontend directory's README for more details.)*

---

## Backend

### 🌟 Key Features

-   **Token Leaderboard**: Displays a list of crypto tokens fetched from CoinGecko, sorted by market cap, and refreshed periodically based on configured intervals.
-   **Token Details**: View detailed information for individual tokens, including comprehensive historical price data (data points) aggregated from various granularities (1-day, 90-days, 365-days).
-   **User Authentication**: Secure account creation, login, and session management using JWT (JSON Web Tokens).
-   **User Profile Management**: Authenticated users can view, update (username, email, password), and delete their profiles.
-   **Favorite Token Management**: Users can add tokens to their favorites list and remove them. Favorite tokens are associated with the user's account.
-   **GraphQL API**: A modern and efficient API for data retrieval and mutations, with a schema automatically generated and sortable.
-   **Data Persistence**: Utilizes SQLite via Prisma ORM for storing user data, favorites, token information, historical data points, and refresh logs.
-   **Scheduled Data Refresh Logic**:
    -   **All Tokens**: Market data for all tokens (top 100 by market cap) is refreshed if the data is older than the `ALL_TOKENS_REFRESH_INTERVAL_MS`.
    -   **Data Points**: Historical price data for a specific token is refreshed if its data points are older than the `DATA_POINTS_REFRESH_INTERVAL_MS` when a user requests that token's details.
-   **Efficient Data Loading**: Implements DataLoader pattern (e.g., `DataPointLoader`) to mitigate N+1 problems in GraphQL resolvers.

### 🔧 Tech Stack

-   **Framework**: NestJS v11.0.1 (Node.js)
-   **API**: GraphQL with Apollo Server (via `@nestjs/graphql` and `@nestjs/apollo`)
-   **Database**: SQLite (managed via Prisma)
-   **ORM**: Prisma v6.7.0
-   **Authentication**: JWT (JSON Web Tokens) using `@nestjs/jwt` v11.0.0 and Passport.js (`@nestjs/passport` v11.0.5)
-   **Data Fetching (External API)**: CoinGecko API via `@nestjs/axios` v4.0.0
-   **Configuration**: `@nestjs/config` v4.0.2 for environment-based settings
-   **Validation**: `class-validator` and `class-transformer` for DTOs
-   **HTTP Client**: Axios (wrapped by `@nestjs/axios`)
-   **Architecture**: Uncle Bob’s Clean Architecture
-   **Development Tooling**: TypeScript, ESLint, Prettier

### 🏗️ Architecture

The backend follows Clean Architecture principles to ensure a separation of concerns, testability, and maintainability:

1.  **Domain Layer**:
    -   Contains core business logic, entities (e.g., `Token`, `User`, `DataPoint`), and repository interfaces (e.g., `ITokenRepository`, `IUserRepository`).
    -   This layer is independent of any framework or external dependency.
    -   Example: `src/token/domain/`, `src/user/domain/`

2.  **Use Cases Layer (Application Business Rules)**:
    -   Orchestrates the flow of data to and from the domain layer.
    -   Implements specific application functionalities by combining domain entities and services.
    -   Depends on domain layer interfaces, not implementations.
    -   Example: `src/token/use-cases/`, `src/user/use-cases/`

3.  **Interface Adapters Layer**:
    -   Connects use cases to external frameworks and tools.
    -   Handles data transformation (e.g., DTOs to domain entities and vice-versa).
    -   Includes GraphQL Resolvers, DTOs (Data Transfer Objects), and potentially controllers for other API types.
    -   Example: `src/token/interface-adapters/graphql/`, `src/user/interface-adapters/graphql/`

4.  **Frameworks & Drivers Layer**:
    -   The outermost layer, consisting of specific implementations and external tools.
    -   Includes the database (Prisma/SQLite), web framework (NestJS), external APIs (CoinGecko client logic in `TokenDataService`), authentication mechanisms (JWT strategy).
    -   Implements repository interfaces defined in the domain layer.
    -   Example: `src/infrastructure/repositories/` (Prisma implementations), `src/infrastructure/auth/`, `src/prisma/`

This layered approach ensures that business logic is decoupled from infrastructure concerns, making the system more robust and easier to adapt to changes.

### 📚 API Documentation (GraphQL)

The GraphQL API is the primary interface for the backend. It can be explored using any GraphQL client (e.g., Apollo Studio, Insomnia, Postman) or the built-in GraphQL Playground when the server is running in development mode.

-   **GraphQL Endpoint**: `http://localhost:3000/graphql` (default port, can be configured in `.env`)
-   **GraphQL Playground**: Accessible at the same URL in a browser during development. This provides an interactive way to explore the schema and test queries/mutations.
-   **Schema Definition**: The full, auto-generated GraphQL schema can be found in `src/schema.gql`.

#### Authentication
Most mutations and some queries (like `me` or `isTokenValid`) require authentication. Include a JWT Bearer token in the `Authorization` header:
`Authorization: Bearer <YOUR_JWT_TOKEN>`

Tokens are obtained via the `login` or `createUser` mutations.

#### Main Queries & Mutations
(Refer to `src/schema.gql` for the complete and most up-to-date schema details, including field descriptions and nullability.)

**Queries:**
-   `tokens: [TokenEntity!]!`: Get the list of all tokens (top 100 from CoinGecko), ordered by market cap rank.
-   `token(input: GetTokenInput!): TokenEntity`: Get details for a specific token by its CoinGecko ID (e.g., "bitcoin") or symbol (e.g., "BTC"). This query will also trigger a refresh of historical data points if they are stale.
-   `me: UserEntity!`: (Authenticated) Get the profile of the currently logged-in user, including their favorite tokens.
-   `isTokenValid: Boolean!`: (Authenticated) Checks if the current authentication token is valid (not expired and correctly signed). Useful for client-side session validation.

**Mutations:**
-   `createUser(createUserData: CreateUserInput!): AuthPayload!`: Create a new user account and returns an authentication payload (JWT).
-   `login(loginData: LoginInput!): AuthPayload!`: Log in an existing user using email/username and password, returns an authentication payload (JWT).
-   `updateUser(updateUserData: UpdateUserInput!): UserEntity!`: (Authenticated) Update the current user's profile (email, username, password).
-   `deleteUser(id: ID!): ID!`: (Authenticated) Delete the current user's profile. The `id` argument must match the authenticated user's ID.
-   `addFavoriteToken(input: FavoriteTokenInput!): TokenEntity!`: (Authenticated) Add a token (by its CoinGecko ID) to the user's favorites list.
-   `removeFavoriteToken(input: FavoriteTokenInput!): TokenEntity!`: (Authenticated) Remove a token (by its CoinGecko ID) from the user's favorites list.

### 🚀 Getting Started

#### Prerequisites
-   Node.js (v18.x LTS or later recommended)
-   npm (v9.x or later) or yarn
-   Git (for cloning the repository)
-   (User's Development Environment: Arch Linux, Visual Studio Code - Note: These are not strict requirements; the project should run on other OSes like macOS or Windows with WSL.)

#### Setup & Installation

1.  **Clone the repository (if you haven't already):**
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
    Create a `.env` file in the `backend` directory. You can copy `backend/.env.example` if provided, or create it manually with the following content:
    ```env
    # Application Port
    PORT=3000

    # Database URL (for Prisma with SQLite)
    DATABASE_URL="file:./dev.db"

    # JWT Configuration
    # IMPORTANT: Change this to a strong, random, and private secret for production!
    JWT_SECRET="aVerySecureSecretKeyPleaseChangeMeForProductionBlockTrack123!@#"
    JWT_EXPIRES_IN="1h" # How long tokens are valid (e.g., 1h, 7d, 30m)

    # Data Refresh Intervals (in milliseconds)
    # Default: 1 hour (1 * 60 * 60 * 1000 = 3600000)
    ALL_TOKENS_REFRESH_INTERVAL_MS=3600000
    DATA_POINTS_REFRESH_INTERVAL_MS=3600000
    ```
    **Security Note:** The `JWT_SECRET` is crucial for security. Use a cryptographically strong random string and keep it confidential, especially in production environments.

4.  **Database Setup (Prisma):**
    Prisma uses migrations to manage the database schema.
    -   To apply existing migrations and create/update your `dev.db` SQLite file:
        ```bash
        npx prisma migrate dev --name init
        ```
        (If you're setting up for the first time, `init` is a good name. If migrations already exist, Prisma will apply them. If you make schema changes, you'll create new migrations.)

5.  **Seed the Database (Optional but Recommended for Development):**
    Populate the database with initial data (e.g., sample users, tokens) using the seed script.
    ```bash
    npm run seed
    ```
    This helps in having some data to work with immediately after setup.

#### Running the Application

-   **Development Mode (with hot-reloading):**
    ```bash
    npm run start:dev
    ```
    The application will typically be available at `http://localhost:3000` (or the port specified in your `.env` file). The GraphQL Playground will be accessible at `http://localhost:3000/graphql`.

-   **Production Mode:**
    1.  Build the application:
        ```bash
        npm run build
        ```
    2.  Start the application:
        ```bash
        npm run start:prod
        ```
        Ensure `NODE_ENV=production` is set in your production environment for optimal performance and security (this often influences how NestJS handles errors and logging).

### 🌲 Project Structure Overview


backend/
├── prisma/ # Prisma schema, migrations, and seed script
│ ├── migrations/ # Database migration files
│ ├── schema.prisma # Prisma schema definition
│ └── seed.ts # Database seeding script
├── src/ # Main application source code
│ ├── app.controller.ts # Basic app controller
│ ├── app.module.ts # Root NestJS module
│ ├── app.service.ts # Basic app service
│ ├── config/ # Application configuration (e.g., app-config.ts)
│ ├── infrastructure/ # Implementations for external concerns
│ │ ├── auth/ # Authentication (JWT strategy, service, guards)
│ │ └── repositories/ # Prisma-based repository implementations
│ ├── token/ # Token feature module
│ │ ├── domain/ # Token domain logic (entities, ports, services like TokenDataService)
│ │ ├── interface-adapters/ # Adapters for Token (GraphQL DTOs, Resolvers)
│ │ ├── use-cases/ # Token use cases (e.g., GetAllTokensUseCase)
│ │ └── token.module.ts # Token NestJS module
│ ├── user/ # User feature module
│ │ ├── domain/ # User domain logic (entities, ports)
│ │ ├── interface-adapters/ # Adapters for User (GraphQL DTOs, Resolvers)
│ │ ├── use-cases/ # User use cases (e.g., CreateUserUseCase)
│ │ └── user.module.ts # User NestJS module
│ ├── main.ts # Application entry point
│ └── schema.gql # Auto-generated GraphQL schema (do not edit manually)
├── .env # Environment variables (ignored by Git)
├── .eslintrc.js # ESLint configuration
├── .prettierrc # Prettier configuration
├── nest-cli.json # NestJS CLI configuration
├── package.json # Project dependencies and scripts
├── tsconfig.build.json # TypeScript configuration for building
└── tsconfig.json # TypeScript configuration

### ⚙️ Available Scripts

-   `npm run start`: Start application in development mode (alias for `nest start`).
-   `npm run start:dev`: Start application in development mode with hot-reloading using `ts-node`.
-   `npm run start:debug`: Start application in debug mode with watch.
-   `npm run start:prod`: Start the built application (for production).
-   `npm run build`: Build the application for production (compiles TypeScript to JavaScript).
-   `npm run format`: Format the codebase using Prettier.
-   `npm run lint`: Lint the codebase using ESLint.
-   `npm run test`: Run unit tests with Jest.
-   `npm run test:watch`: Run unit tests in watch mode.
-   `npm run test:cov`: Run unit tests and generate a coverage report.
-   `npm run test:e2e`: Run end-to-end tests.
-   `npm run seed`: Execute the Prisma seed script (`prisma/seed.ts`) to populate the database.
-   `npx prisma migrate dev`: Create and apply database migrations during development.
-   `npx prisma studio`: Open Prisma Studio, a GUI for your database.
-   `npx prisma generate`: Regenerate Prisma Client based on `schema.prisma`.

### Future Enhancements & Next Steps

This section outlines potential improvements and areas for future development.

#### 1. Rate Limiting
-   **CoinGecko API Rate Limits**:
    -   The current implementation fetches a significant amount of data (top 100 tokens, multiple historical ranges per token). This can hit CoinGecko's public API rate limits if not managed carefully.
    -   **Mitigation Strategies**:
        -   Implement more robust error handling for API requests, including exponential backoff on 429 (Too Many Requests) errors.
        -   Consider distributing data fetching tasks over time, especially for historical data points of many tokens.
        -   Investigate if CoinGecko offers API keys for higher rate limits if the application scales.
        -   Adjust refresh intervals (`ALL_TOKENS_REFRESH_INTERVAL_MS`, `DATA_POINTS_REFRESH_INTERVAL_MS`) based on actual usage and CoinGecko's policies. Currently, they are both set to 1 hour.
-   **Application API Rate Limiting**:
    -   Implement rate limiting on the NestJS GraphQL API endpoints to prevent abuse from clients. The `@nestjs/throttler` module is suitable for this.

#### 2. Optimizations
-   **Caching**:
    -   **External API Responses**: Cache responses from CoinGecko more effectively. While Prisma acts as a database cache, an in-memory cache (like `cache-manager` in NestJS) or a distributed cache (like Redis) could be used for CoinGecko responses to reduce API calls.
    -   **Internal Data**: Cache results of frequently accessed data or computationally intensive operations.
-   **Database Performance**:
    -   Regularly review Prisma query performance.
    -   Ensure appropriate database indexes are in place for all common query patterns (Prisma's `@@index` is used, but custom needs might arise).
    -   For very large datasets (especially `DataPoint` table), consider database-specific optimizations or partitioning if SQLite limitations are hit (though SQLite is generally fine for moderate loads).
-   **GraphQL Query Optimization**:
    -   Ensure DataLoaders are used for all relevant N+1 scenarios (currently used for `DataPointEntity`).
    -   Consider implementing query complexity analysis to prevent overly demanding queries from clients.
-   **Data Point Granularity**:
    -   The `fetchComprehensiveHistoricalData` in `TokenDataService` fetches 3 ranges (1d, 90d, 365d). This could be optimized to fetch only the necessary range based on user request or context, or to fetch more data points for shorter timeframes to provide richer charts.
    -   The current merging strategy for data points is effective but could be further refined if specific display requirements change.

#### 3. New Features
-   **Real-time Updates**: Implement WebSockets (e.g., using `@nestjs/websockets`) to push real-time price updates to connected clients for tokens on their leaderboard or favorites page.
-   **Advanced Charting**: Allow users to select different chart types, indicators, or comparison features on the token details page.
-   **User Notifications**: Implement a system for users to set price alerts or receive notifications about significant events for their favorite tokens.
-   **Admin Panel**: If the application grows, an admin panel might be needed for user management, system monitoring, or manual data overrides.
-   **Expanded Token Data**: Fetch and display more detailed information about tokens (e.g., project descriptions, social links, contract addresses) if available from CoinGecko or other sources.

#### 4. Enhanced Error Handling & Logging
-   Implement more granular error handling and provide more user-friendly error messages in the GraphQL API.
-   Enhance logging with more context and structured logging for easier debugging and monitoring in production environments.

#### 5. Testing
-   Expand test coverage with more comprehensive unit tests for use cases and domain services.
-   Add integration tests to cover interactions between different parts of the system (e.g., API endpoint to database).
-   Write end-to-end tests to simulate user flows.

#### 6. Security Hardening
-   Regularly update dependencies to patch security vulnerabilities.
-   Conduct security audits and implement best practices for web application security (e.g., input validation, output encoding, protection against common GraphQL vulnerabilities).
-   Implement stricter validation for all user inputs.

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/my-new-feature`).
3.  Commit your changes (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/my-new-feature`).
5.  Open a Pull Request.

### 📄 License

This project is licensed under the MIT License.
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END