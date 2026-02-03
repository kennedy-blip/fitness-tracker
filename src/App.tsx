// Sample data for the fitness tracker
const sampleData = {
  dailySteps: [
    { date: 'Mon', steps: 8432, goal: 10000 },
    { date: 'Tue', steps: 11250, goal: 10000 },
    { date: 'Wed', steps: 6890, goal: 10000 },
    { date: 'Thu', steps: 14520, goal: 10000 },
    { date: 'Fri', steps: 9875, goal: 10000 },
    { date: 'Sat', steps: 15680, goal: 10000 },
    { date: 'Sun', steps: 7240, goal: 10000 },
  ],
  weeklyProgress: {
    steps: { current: 73887, goal: 70000 },
    calories: { current: 2850, goal: 2500 },
    workouts: { current: 5, goal: 7 },
    activeMinutes: { current: 320, goal: 350 },
  },
  caloriesBurned: [
    { day: 'Mon', calories: 320 },
    { day: 'Tue', calories: 450 },
    { day: 'Wed', calories: 280 },
    { day: 'Thu', calories: 520 },
    { day: 'Fri', calories: 380 },
    { day: 'Sat', calories: 680 },
    { day: 'Sun', calories: 220 },
  ],
  heartRateZones: [
    { name: 'Peak', duration: 45, color: 'bg-red-500', percent: 15 },
    { name: 'Cardio', duration: 95, color: 'bg-orange-500', percent: 32 },
    { name: 'Fat Burn', duration: 110, color: 'bg-yellow-500', percent: 37 },
    { name: 'Light', duration: 40, color: 'bg-green-500', percent: 13 },
  ],
  workoutHistory: [
    { id: 1, type: 'Running', duration: 45, calories: 520, date: 'Today, 7:30 AM', icon: '🏃' },
    { id: 2, type: 'HIIT', duration: 30, calories: 380, date: 'Yesterday, 6:00 PM', icon: '💪' },
    { id: 3, type: 'Cycling', duration: 60, calories: 450, date: 'Mar 15, 5:30 PM', icon: '🚴' },
    { id: 4, type: 'Yoga', duration: 40, calories: 150, date: 'Mar 14, 7:00 AM', icon: '🧘' },
    { id: 5, type: 'Swimming', duration: 50, calories: 420, date: 'Mar 13, 6:00 PM', icon: '🏊' },
  ],
  todayStats: {
    steps: 8432,
    calories: 320,
    distance: 6.2,
    activeMinutes: 45,
    heartRate: 72,
  },
};

// Step Chart Component
function StepChart() {
  const data = sampleData.dailySteps;
  const maxGoal = Math.max(...data.map(d => d.goal));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Steps</h3>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((day, index) => {
          const stepHeight = (day.steps / maxGoal) * 100;
          const goalHeight = (day.goal / maxGoal) * 100;
          const isOverGoal = day.steps >= day.goal;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full h-36 flex items-end">
                {/* Goal line */}
                <div 
                  className="absolute w-full border-t-2 border-dashed border-slate-300"
                  style={{ bottom: `${goalHeight}%` }}
                />
                {/* Step bar */}
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 ${isOverGoal ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' : 'bg-gradient-to-t from-indigo-500 to-indigo-400'}`}
                  style={{ height: `${stepHeight}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">{day.date}</span>
              <span className={`text-xs font-bold ${isOverGoal ? 'text-emerald-600' : 'text-indigo-600'}`}>
                {(day.steps / 1000).toFixed(1)}k
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <span>Steps</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-dashed border-slate-300" />
          <span>Goal</span>
        </div>
      </div>
    </div>
  );
}

// Calories Burned Chart
function CaloriesChart() {
  const data = sampleData.caloriesBurned;
  const maxCalories = Math.max(...data.map(d => d.calories));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Calories Burned</h3>
      <div className="flex items-end justify-between h-40 gap-2">
        {data.map((day, index) => {
          const height = (day.calories / maxCalories) * 100;
          const isHigh = day.calories > 450;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full h-32 flex items-end">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 ${isHigh ? 'bg-gradient-to-t from-orange-500 to-orange-400' : 'bg-gradient-to-t from-amber-500 to-amber-400'}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">{day.day}</span>
              <span className="text-xs font-bold text-amber-700">{day.calories}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Heart Rate Zones
function HeartRateZones() {
  const data = sampleData.heartRateZones;
  const totalDuration = data.reduce((sum, zone) => sum + zone.duration, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Heart Rate Zones</h3>
      <div className="space-y-4">
        {data.map((zone, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{zone.name}</span>
              <span className="text-slate-500">{zone.duration} min</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${zone.color} transition-all duration-500`}
                style={{ width: `${zone.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Total Time</span>
          <span className="font-semibold text-slate-800">{totalDuration} min</span>
        </div>
      </div>
    </div>
  );
}

// Workout History
function WorkoutHistory() {
  const workouts = sampleData.workoutHistory;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Workout History</h3>
      <div className="space-y-3">
        {workouts.map((workout) => (
          <div key={workout.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="text-2xl">{workout.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-slate-800">{workout.type}</div>
              <div className="text-sm text-slate-500">{workout.date}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800">{workout.duration} min</div>
              <div className="text-sm text-orange-600">{workout.calories} cal</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Weekly Progress Cards
function WeeklyProgress() {
  const progress = sampleData.weeklyProgress;

  const Card = ({ title, current, goal, unit, color, icon }: {
    title: string;
    current: number;
    goal: number;
    unit: string;
    color: string;
    icon: string;
  }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const isComplete = current >= goal;

    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600">{title}</span>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-2xl font-bold ${isComplete ? 'text-emerald-600' : 'text-slate-800'}`}>
            {current.toLocaleString()}
          </span>
          <span className="text-sm text-slate-500 mb-1">/ {goal.toLocaleString()} {unit}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card 
        title="Steps" 
        current={progress.steps.current} 
        goal={progress.steps.goal} 
        unit="steps"
        color="bg-indigo-500"
        icon="👟"
      />
      <Card 
        title="Calories" 
        current={progress.calories.current} 
        goal={progress.calories.goal} 
        unit="cal"
        color="bg-orange-500"
        icon="🔥"
      />
      <Card 
        title="Workouts" 
        current={progress.workouts.current} 
        goal={progress.workouts.goal} 
        unit="sessions"
        color="bg-blue-500"
        icon="💪"
      />
      <Card 
        title="Active Min" 
        current={progress.activeMinutes.current} 
        goal={progress.activeMinutes.goal} 
        unit="min"
        color="bg-purple-500"
        icon="⏱️"
      />
    </div>
  );
}

// Today's Stats Header
function TodayStats() {
  const stats = sampleData.todayStats;

  const StatCard = ({ label, value, unit, icon, color }: {
    label: string;
    value: number;
    unit: string;
    icon: string;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-lg ${color}`}>{icon}</span>
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold text-slate-800">
        {value.toLocaleString()}
        <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard label="Steps" value={stats.steps} unit="" icon="👟" color="text-indigo-500" />
      <StatCard label="Calories" value={stats.calories} unit="cal" icon="🔥" color="text-orange-500" />
      <StatCard label="Distance" value={stats.distance} unit="km" icon="📍" color="text-emerald-500" />
      <StatCard label="Active" value={stats.activeMinutes} unit="min" icon="⏱️" color="text-purple-500" />
      <StatCard label="Heart Rate" value={stats.heartRate} unit="bpm" icon="❤️" color="text-red-500" />
    </div>
  );
}

// Main App Component
export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">FitTrack</h1>
                <p className="text-xs text-slate-500">Your daily fitness companion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-slate-800">Welcome back!</div>
                <div className="text-xs text-slate-500">March 16, 2025</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Today's Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Today's Stats</h2>
          <TodayStats />
        </section>

        {/* Weekly Progress */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Weekly Progress</h2>
          <WeeklyProgress />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StepChart />
          <CaloriesChart />
        </section>

        {/* Heart Rate & Workout History */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HeartRateZones />
          <WorkoutHistory />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          <p>FitTrack © 2025 - Your fitness journey starts here</p>
        </div>
      </footer>
    </div>
  );
}
