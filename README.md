# POD Finder

A modern, interactive survey web application that helps consultants discover which POD (team) best fits their interests and skills.

## Overview

POD Finder is a single-page React application that guides users through a multi-step survey to determine their optimal POD assignment based on:
- Interest ratings in different POD activities
- Time commitment capacity
- Personal priorities

### The 4 PODs

1. **Training Programs** - Build internal capability through training and mentoring
2. **Pursuit/Sales GTM Support** - Support sales with thought leadership and materials
3. **Culture & Community** - Foster team culture and create connections
4. **Delivery Support & Enablement** - Create tools and standards for delivery excellence

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Supabase (Postgres)** for shared submission storage

## Prerequisites

- Node.js 18+ (recommended: use the latest LTS version)
- npm or yarn

## Setup Instructions

1. **Clone or navigate to the project directory**

   ```bash
   cd pod-finder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Copy `.env.example` to `.env.local` and fill in the two Supabase values
   (see the Database setup section below).

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Database setup

Submissions are stored in a shared Supabase Postgres table. Setup:

1. In the Vercel dashboard for this project, open **Integrations → Marketplace**
   and provision a **Supabase** project. This auto-injects
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into Production, Preview,
   and Development environments.
2. In the Supabase project, open the **SQL editor** and run the migration at
   `supabase/migrations/0001_init.sql` once. It creates the `submissions`
   table, the `person_key` unique constraint, and RLS policies.
3. For local development, copy the same two env vars into `.env.local`
   (from Supabase → Project Settings → API):
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   ```

**Known limitation:** the admin UI still uses a hardcoded password
(`AdminLogin.tsx`) and the RLS policies let anon clients insert, select, and
delete rows. This is intentional for now and is called out in a comment at
the top of `AdminLogin.tsx`. Before exposing the app more broadly, migrate
admin to Supabase Auth and restrict the `select` and `delete` policies to
authenticated users.

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
pod-finder/
├── src/
│   ├── components/          # React components
│   │   ├── IntroScreen.tsx        # Welcome screen
│   │   ├── TopLevelInterest.tsx   # Initial POD interest ratings
│   │   ├── DetailedQuestions.tsx  # Detailed activity ratings
│   │   ├── TimeCommitment.tsx     # Time availability selection
│   │   ├── TopTwoPriorities.tsx   # Priority selection
│   │   ├── Results.tsx            # Final POD assignment & breakdown
│   │   ├── LikertScale.tsx        # Reusable 1-5 rating component
│   │   ├── ProgressBar.tsx        # Progress indicator
│   │   └── Button.tsx             # Reusable button component
│   ├── config/
│   │   └── pods.ts               # POD definitions and questions
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── scoring.ts            # Scoring algorithm
│   ├── App.tsx                   # Main app component with state management
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles with Tailwind
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Survey Flow

1. **Intro Screen** - Explains the PODs and rating scale
2. **Top-Level Interest** - Rate interest in each of the 4 PODs (1-5 scale)
3. **Detailed Questions** - Answer specific questions for PODs rated 3+ (skip logic applies)
4. **Time Commitment** - Select realistic time availability per quarter
5. **Top 2 Priorities** - Choose #1 and #2 POD preferences
6. **Results** - View assigned POD with detailed scoring breakdown

## Scoring Algorithm

For each POD, the final score is calculated as:

```
BaseScore = TopLevelInterest × 2
DetailScore = Average(DetailedAnswers) × 3  (if answered)
PriorityBonus = 6 (if #1 choice) or 4 (if #2 choice) or 0

CommitmentMultiplier:
  - 0-5%: 0.9
  - 5-10%: 1.0
  - 10-20%: 1.1
  - 20%+: 1.2

FinalScore = (BaseScore + DetailScore + PriorityBonus) × CommitmentMultiplier
```

**Tie-breakers:**
1. Higher #1 priority wins
2. Higher top-level interest
3. Higher detail score

The POD with the highest FinalScore is assigned to the user.

## Features

- ✅ **Responsive Design** - Works beautifully on desktop and mobile
- ✅ **Smooth Animations** - Polished transitions using Framer Motion
- ✅ **Progress Tracking** - Visual progress indicator throughout survey
- ✅ **Skip Logic** - Automatically skips detailed questions for low-interest PODs
- ✅ **Validation** - Prevents advancing without completing required fields
- ✅ **Detailed Breakdown** - Shows transparent scoring for all PODs
- ✅ **Accessible** - Keyboard navigation and semantic HTML
- ✅ **Shared Database** - Submissions persist to Supabase Postgres so admins see everyone's data

## Customization

### Adding or Modifying PODs

Edit `src/config/pods.ts` to change POD names, descriptions, or questions.

### Adjusting Scoring Weights

Modify the scoring algorithm in `src/utils/scoring.ts`.

### Styling

The app uses Tailwind CSS. Customize colors and theme in `tailwind.config.js`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This is a proof-of-concept application created for internal use.

## Support

For questions or issues, please contact the development team.
