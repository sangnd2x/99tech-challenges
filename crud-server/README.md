# CRUD Server - TypeScript Express API

A RESTful CRUD API built with Express.js, TypeScript, and SQLite for managing items.

## Features

- **Create** new items
- **Read** items with advanced filtering options
- **Update** existing items
- **Delete** items
- SQLite database for data persistence
- TypeScript for type safety
- Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory:

```bash
cd crud-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (optional):

```bash
cp .env.example .env
```

You can modify the PORT in the `.env` file if needed (default is 3000).

## Running the Application

### Development Mode

Run the application with hot reload:

```bash
npm run dev
```

### Production Mode

1. Build the TypeScript code:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

The server will start at `http://localhost:3000` (or the port specified in your `.env` file).
