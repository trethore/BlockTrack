# BlockTrack

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/NestJS-%23E0234E.svg?logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/-GraphQL-E10098?logo=graphql&logoColor=white" alt="GraphQL"/>
  <img src="https://img.shields.io/badge/Prisma-%232D3748.svg?logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/SQLite-%2307405E.svg?logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-%2338B2AC.svg?logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/TypeScript-%233178C6.svg?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-%23646CFF.svg?logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Apollo%20Client-%23311C87.svg?logo=apollo-graphql&logoColor=white" alt="Apollo Client"/>
  <img src="https://img.shields.io/badge/Architecture-Clean-blueviolet" alt="Clean Architecture"/>
</p>

BlockTrack is a web application designed to provide users with a real-time leaderboard of cryptocurrency tokens, sorted by market capitalization. Authenticated users can select and store their favorite tokens, explore detailed token information including historical price charts, and manage their user profile.

## 🎯 Core Objective
Build a “Leaderboard”—a list of crypto tokens sorted by market‑capitalization—and allow each authenticated user to select and store their favorite token(s).

## 🛠️ Tech Stack

**Frontend:**
*   **Framework:** React 19 (with Vite)
*   **UI Components:** Custom components, Shadcn/ui inspired primitives (Table, Card, Button, etc.)
*   **Styling:** Tailwind CSS
*   **State Management/API:** Apollo Client for GraphQL
*   **Routing:** React Router DOM
*   **Animations:** Framer Motion
*   **Charting:** Recharts
*   **Notifications:** Sonner
*   **Language:** TypeScript

**Backend:**
*   **Framework:** NestJS
*   **API:** GraphQL (Apollo Server)
*   **ORM:** Prisma
*   **Database:** SQLite
*   **Authentication:** JWT (Passport.js)
*   **Language:** TypeScript

**Architecture:**
*   Uncle Bob’s Clean Architecture (Domain → Use‑Cases → Interface Adapters → Frameworks/Drivers)

## ✨ Features

*   **Real-Time Leaderboard:** View a comprehensive list of crypto tokens, sortable by market cap, name, price, and various percentage change metrics (1h, 24h, 7d, 30d, 1y).
*   **Search & Filter:** Easily search for tokens by name or symbol on the leaderboard.
*   **Favorite Tokens:** Authenticated users can mark tokens as favorites and view them on a dedicated "Favorites" page.
*   **Token Details Page:** Access in-depth information for each token, including:
    *   Detailed price statistics.
    *   Market capitalization and supply information.
    *   Historical price charts with selectable timeframes (1h, 1d, 7d, 30d, 1y).
*   **User Authentication:**
    *   Secure user registration and login.
    *   Profile management (update username, email, password).
    *   Account deletion.
*   **Responsive Design:** Fully responsive UI, adapting to various screen sizes.
*   **Dark/Light Mode:** Switch between dark and light themes for comfortable viewing.
*   **Data Caching:** Leaderboard data is cached on the client-side with periodic refresh for improved performance and reduced API calls. Backend data is also refreshed periodically.
*   **Notifications:** User-friendly toast notifications for actions and errors.
*   **Engaging Landing Page:** A visually appealing landing page showcasing project features with animations.
*   **Not Found Page:** Graceful handling of invalid routes.

## 🏗️ Architecture Overview

The project follows Uncle Bob's Clean Architecture principles to promote separation of concerns, testability, and maintainability.

*   **Domain Layer:** Contains core business logic, entities, and interfaces (ports) for repositories and domain services. This layer is independent of any framework.
    *   *Backend example:* `backend/src/token/domain/`, `backend/src/user/domain/`
*   **Use Cases Layer (Application Layer):** Orchestrates the flow of data to and from the domain layer. It contains application-specific business rules and implements the core functionality of the application.
    *   *Backend example:* `backend/src/token/use-cases/`, `backend/src/user/use-cases/`
*   **Interface Adapters Layer:** Converts data from the format most convenient for use cases and entities to the format most convenient for external agencies such as the Database, the Web, or the UI. This includes Presenters, Controllers (Resolvers in GraphQL), and Gateways (Repositories implementations).
    *   *Backend example:* `backend/src/token/interface-adapters/graphql/`, `backend/src/infrastructure/repositories/`
    *   *Frontend example:* React components acting as presenters, Apollo Client hooks.
*   **Frameworks & Drivers Layer:** This is the outermost layer, generally composed of frameworks and tools suchs as the Database (Prisma, SQLite), Web Framework (NestJS, React), UI, etc.
    *   *Backend example:* NestJS framework, Prisma client, Apollo Server.
    *   *Frontend example:* React library, Vite, TailwindCSS.

## 📁 Project Structure


BlockTrack/
├── backend/
│ ├── prisma/ # Prisma schema, migrations, seed script
│ ├── src/
│ │ ├── app.module.ts # Root NestJS module
│ │ ├── main.ts # Application entry point
│ │ ├── config/ # Application configuration
│ │ ├── infrastructure/ # Repositories, auth services, GraphQL dataloaders
│ │ ├── token/ # Token feature module (domain, use-cases, adapters)
│ │ └── user/ # User feature module (domain, use-cases, adapters)
│ ├── .env.example # Example environment variables for backend
│ └── package.json
│
└── frontend/
├── public/ # Static assets
├── src/
│ ├── App.tsx # Main React application component
│ ├── main.tsx # React DOM entry point, providers
│ ├── assets/ # Images, SVGs etc.
│ ├── components/ # Reusable UI components (auth, layout, ui primitives)
│ ├── lib/ # Utilities, Apollo client, constants, custom hooks
│ ├── pages/ # Route-level components
│ └── types/ # TypeScript type definitions
├── .env.example # Example environment variables for frontend
└── package.json

## 🚀 Getting Started

### 📋 Prerequisites

*   **Node.js:** v18.x LTS or v20.x recommended.
*   **npm:** v9.x or v10.x (or yarn v1.22.x).
*   **Git:** For cloning the repository.
*   **Operating System:** Developed and tested on Arch Linux (as per user environment), but should work on other Linux distributions, macOS, and Windows (with WSL2 recommended for backend).
*   **IDE:** Visual Studio Code is recommended.

### ⚙️ Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd BlockTrack
    ```

2.  **Backend Setup:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file by copying `.env.example` (if it exists, otherwise create one based on the example below) and fill in the necessary environment variables. A typical `.env` for the backend would look like this:
        ```env
        # Backend Configuration
        DATABASE_URL="file:../dev.db" # Path relative to backend/prisma/

        # JWT Configuration - IMPORTANT: Change JWT_SECRET for production!
        JWT_SECRET="your-very-secure-and-long-jwt-secret-key"
        JWT_EXPIRES_IN="1h" # e.g., 1h, 7d, 30d

        # Server Configuration
        PORT=3000

        # Data Refresh Intervals (in milliseconds)
        ALL_TOKENS_REFRESH_INTERVAL_MS=3600000 # 1 hour by default
        DATA_POINTS_REFRESH_INTERVAL_MS=3600000 # 1 hour by default
        ```
    *   Apply database migrations:
        ```bash
        npx prisma migrate dev
        ```
    *   (Optional) Seed the database with initial data:
        ```bash
        npm run seed
        # or npx prisma db seed (if package.json script points to prisma/seed.ts)
        ```
    *   Start the backend development server:
        ```bash
        npm run start:dev
        ```
        The backend will be running on `http://localhost:3000` (or the port specified in `.env`).
        The GraphQL Playground will be available at `http://localhost:3000/graphql`.

3.  **Frontend Setup:**
    *   Navigate to the frontend directory (from the project root):
        ```bash
        cd ../frontend
        # or from backend directory: cd ../frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file by copying `.env.example` (if it exists, otherwise create one based on the example below) and set the GraphQL endpoint. A typical `.env` for the frontend would look like this:
        ```env
        # Frontend Configuration
        VITE_GRAPHQL_ENDPOINT="http://localhost:3000/graphql"
        ```
        Ensure the `VITE_GRAPHQL_ENDPOINT` matches your backend GraphQL server address.
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
        The frontend application will be accessible at `http://localhost:5173` (Vite's default port).

## 📜 Available Scripts

### 💻 Backend (`BlockTrack/backend`)

*   `npm run build`: Compiles the TypeScript code.
*   `npm run format`: Formats code using Prettier.
*   `npm run start`: Starts the application (requires a prior build).
*   `npm run start:dev`: Starts the application in development mode with hot-reloading.
*   `npm run start:debug`: Starts the application in debug mode.
*   `npm run start:prod`: Starts the application in production mode (requires a prior build).
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run test`: Runs unit tests.
*   `npm run test:watch`: Runs unit tests in watch mode.
*   `npm run test:cov`: Runs unit tests and generates a coverage report.
*   `npm run test:e2e`: Runs end-to-end tests.
*   `npm run seed`: Seeds the database using `prisma/seed.ts`.
*   `npx prisma migrate dev`: Applies database migrations.
*   `npx prisma generate`: Generates Prisma Client.

### 🖥️ Frontend (`BlockTrack/frontend`)

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally for preview.

## 🔗 API Overview (GraphQL)

The backend exposes a GraphQL API. You can explore the schema and test queries/mutations using the GraphQL Playground, typically available at `http://localhost:3000/graphql` when the backend server is running.

**Key Queries:**
*   `tokens`: Fetches the list of all cryptocurrency tokens for the leaderboard.
*   `token(input: GetTokenInput!)`: Fetches detailed information for a single token by its ID or symbol.
*   `me`: Fetches the profile of the currently authenticated user.
*   `isTokenValid`: Checks if the current JWT is valid.

**Key Mutations:**
*   `createUser(createUserData: CreateUserInput!)`: Registers a new user.
*   `login(loginData: LoginInput!)`: Logs in an existing user.
*   `updateUser(updateUserData: UpdateUserInput!)`: Updates the authenticated user's profile.
*   `deleteUser(id: ID!)`: Deletes the authenticated user's account.
*   `addFavoriteToken(input: FavoriteTokenInput!)`: Adds a token to the user's favorites.
*   `removeFavoriteToken(input: FavoriteTokenInput!)`: Removes a token from the user's favorites.

Refer to `backend/src/schema.gql` for the complete GraphQL schema.

## 🔮 Future Plans

While BlockTrack currently meets its core objectives, here are some potential areas for future development and improvement:

*   **🧪 Comprehensive Testing:**
    *   **Backend:** Implement unit tests for use cases, domain services, and resolvers. Add E2E tests for critical API flows.
    *   **Frontend:** Write unit tests for components and utility functions. Implement E2E tests for user flows using tools like Playwright or Cypress.
*   **🛡️ API Enhancements (Backend):**
    *   **Rate Limiting:** Implement rate limiting on GraphQL queries and mutations to prevent abuse and ensure fair usage.
    *   **Input Validation & Sanitization:** Further strengthen input validation across all layers.
    *   **Error Handling:** Refine error reporting for more specific and user-friendly error messages.
*   **📈 Advanced Features (Frontend & Backend):**
    *   **Portfolio Tracking:** Allow users to track their crypto holdings and performance.
    *   **Advanced Charting Options:** Introduce more charting tools, technical indicators, and comparison features on the Token Details page.
    *   **Price Alerts:** Enable users to set up price alerts for their favorite tokens.
    *   **More Data Sources:** Integrate additional data sources for news, social sentiment, or deeper on-chain analytics.
*   **⚙️ Infrastructure & Deployment:**
    *   **Containerization:** Dockerize the frontend and backend applications for easier deployment.
    *   **CI/CD Pipeline:** Set up a Continuous Integration/Continuous Deployment pipeline for automated testing and deployment.
*   **♿ Accessibility (a11y):**
    *   Conduct thorough accessibility audits and implement improvements to ensure WCAG compliance.
*   **📄 Documentation:**
    *   Expand API documentation with more examples and detailed explanations.
    *   Improve in-code documentation.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name` or `bugfix/issue-number`).
3.  Make your changes and commit them with clear, descriptive messages.
4.  Push your changes to your forked repository.
5.  Create a Pull Request (PR) to the main repository, detailing the changes you've made.

Please ensure your code adheres to the existing coding style and passes linting checks.

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE.md](LICENSE.md) file for more details (assuming a LICENSE.md file would be created, or link to `https://opensource.org/licenses/MIT`).

## 🙏 Acknowledgements

*   Token data and market information are powered by the [CoinGecko API](https://www.coingecko.com/en/api).
*   UI components are inspired by [Shadcn/ui](https://ui.shadcn.com/).
*   Built with the excellent NestJS and React ecosystems.
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END