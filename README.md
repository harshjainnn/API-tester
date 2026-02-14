# API Tester - Postman-like REST Client

A modern, full-stack REST client application built with Next.js, MikroORM, and SQLite.

## Features

-   **Request Builder**: Send GET, POST, PUT, DELETE, PATCH requests.
-   **Dynamic Response**: View status, time, size, headers, and JSON body without page reload.
-   **History**: Automatically saves all requests. View history, reload requests, and delete items.
-   **Persistence**: Uses SQLite with MikroORM for robust data storage.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database**: SQLite
-   **ORM**: MikroORM
-   **HTTP Client**: Axios

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Initialize Database**:
    The application uses MikroORM with SQLite. You need to run migrations to create the database file (`database.sqlite`) and tables.
    ```bash
    npx mikro-orm migration:create # Create initial migration
    npx mikro-orm migration:up     # Apply migration
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open Application**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

-   `src/app/api`: Backend API routes for proxying requests and managing history.
-   `src/components`: React components (RequestPanel, ResponsePanel, HistoryPanel).
-   `src/entities`: Database entities (RequestLog).
-   `src/lib`: Utilities (MikroORM singleton, types).

## Database

The application supports:
-   **Local Development**: Uses `database.sqlite` (SQLite).
-   **Production (Vercel)**: Uses PostgreSQL (e.g., Vercel Postgres, Neon) via `DATABASE_URL` environment variable.

## Deployment on Vercel

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add a **Storage** integration (Vercel Postgres) to your project.
    -   This automatically sets the `POSTGRES_URL`, `POSTGRES_PRISMA_URL` etc.
    -   Ensure `DATABASE_URL` environment variable is set to the connection string (usually Vercel sets this or `POSTGRES_URL`).
    -   If utilizing Vercel Postgres, you might need to map `POSTGRES_URL` to `DATABASE_URL` in your project settings.
4.  Deploy.
5.  **Migrations**: You may need to run migrations against the production database. You can do this by connecting to the DB externally or adding a post-deploy script (advanced). For simplicity, you can run `npx mikro-orm migration:create` locally, commit the migration files, and then run `npx mikro-orm migration:up` locally pointing to the remote DB, or use a custom build script.

### Troubleshooting Local Development
If you encounter `MODULE_NOT_FOUND` or native binding errors with SQLite on Windows/Node 22:
1.  Create a PostgreSQL database (e.g. via Vercel or Neon).
2.  Create a `.env.local` file in the project root.
3.  Add `DATABASE_URL=postgres://...` (your connection string).
4.  Run `npm run dev`. The app will automatically switch to PostgreSQL driver which is more stable in this environment.

## Implementation 
<img width="1918" height="887" alt="image" src="https://github.com/user-attachments/assets/9737364c-eea4-41fb-9bc4-e56a55292c89" />

