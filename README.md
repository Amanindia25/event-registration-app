# Event Registration Web App

A web application for event registration built with React, Vite, Shadcn UI, and Supabase.

## Features

- Event listing and registration
- User authentication
- Admin dashboard for managing registrations
- Modern UI with Shadcn components

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## Supabase Setup

1. Create a new Supabase project
2. Enable Email/Password authentication in Authentication > Providers
3. Run the SQL commands from `src/lib/supabase/schema.sql` in the Supabase SQL editor
4. Get your project URL and anon key from Project Settings > API

## Environment Setup

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase project credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
├── src/
│   ├── components/     # Reusable components
│   ├── lib/           # Utilities and configurations
│   │   └── supabase/  # Supabase client and types
│   ├── pages/         # Page components
│   └── types/         # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
