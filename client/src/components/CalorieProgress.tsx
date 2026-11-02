import { Progress } from "@/components/ui/progress";

interface CalorieProgressProps {
  consumed: number;
  goal: number;
}

export function CalorieProgress({ consumed, goal }: CalorieProgressProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const isOverGoal = consumed > goal;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={isOverGoal ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold font-mono" data-testid="text-calories-remaining">
              {remaining.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {isOverGoal ? "calories over" : "calories left"}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Consumed</span>
            <span className="font-semibold font-mono" data-testid="text-calories-consumed">
              {consumed.toLocaleString()} cal
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Goal</span>
            <span className="font-semibold font-mono" data-testid="text-calories-goal">
              {goal.toLocaleString()} cal
            </span>
          </div>
          <Progress value={percentage} className="h-2" data-testid="progress-calories" />
        </div>
      </div>
    </div>
  );
}
