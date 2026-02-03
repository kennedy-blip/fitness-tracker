# Fitness Tracker

A comprehensive fitness tracking web application built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Step Chart** - Visualize daily step counts with goal comparison
- **Calories Burned** - Track daily calorie expenditure with interactive charts
- **Heart Rate Zones** - Monitor time spent in different heart rate zones
- **Workout History** - View detailed history of your exercise sessions
- **Weekly Progress** - Track your fitness goals with progress indicators

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
fitness-tracker/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind directives
├── public/
│   └── index.html       # HTML template
├── dist/                # Production build output
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## Features Overview

### Today's Stats
Quick overview of your current day's metrics including:
- Current steps and goal percentage
- Calories burned
- Distance traveled
- Active minutes
- Average heart rate

### Step Chart
Interactive bar chart showing daily steps for the past week with:
- Color-coded bars (emerald for days exceeding goal, indigo for days below goal)
- Goal threshold line
- Hover tooltips with detailed information

### Heart Rate Zones
Visual breakdown of time spent in different heart rate zones:
- Peak (red)
- Cardio (orange)
- Fat Burn (amber)
- Light (green)

### Weekly Progress
Track your weekly goals with progress indicators for:
- Steps
- Calories burned
- Workout sessions
- Active minutes

### Workout History
Detailed list of your recent workouts including:
- Workout type with emoji icons
- Date and duration
- Calories burned
- Interactive cards with hover effects

## Customization

### Colors
You can customize the color scheme by editing `tailwind.config.js`.

### Sample Data
The application comes pre-populated with sample data. You can modify the data arrays in `App.tsx` to use your own data.

### Adding Features
The component-based architecture makes it easy to add new features or modify existing ones.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## Author

Fitness Tracker App