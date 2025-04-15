# Habit Tracker

A simple habit tracking application built with Next.js and Tailwind CSS.

## Features

- Track daily habit completion
- Add, edit, and delete habits (using Server Actions)
- View completion history on a contribution graph
- Import/Export data
- Dark mode support
- Data persistence using SQLite database

## Getting Started

### Prerequisites

- Node.js (version recommended by Next.js)
- pnpm (can be installed via `npm install -g pnpm`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dom-ant-nee/habit-tracker.git
   cd habit-tracker
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
   (This command creates the `prisma/dev.db` file and sets up the tables)

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js (App Router, Server Components, Server Actions)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma (ORM)
- SQLite (Database)
- date-fns
- framer-motion
- Lucide React (Icons)

## Database

The application uses an SQLite database (`prisma/dev.db`) managed via Prisma.

### Viewing/Editing Data

You can use Prisma Studio, a GUI tool, to interact directly with the database:

```bash
npx prisma studio
```

This will open a web interface where you can view and modify the `Habit` and `Completion` tables. 