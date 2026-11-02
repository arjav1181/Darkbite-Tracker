import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MacroBreakdownProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroBreakdown({ protein, carbs, fat }: MacroBreakdownProps) {
  const total = protein + carbs + fat;
  const proteinPercent = total > 0 ? (protein / total) * 100 : 0;
  const carbsPercent = total > 0 ? (carbs / total) * 100 : 0;
  const fatPercent = total > 0 ? (fat / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Macronutrients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
          {proteinPercent > 0 && (
            <div
              className="bg-blue-500"
              style={{ width: `${proteinPercent}%` }}
              data-testid="bar-protein"
            />
          )}
          {carbsPercent > 0 && (
            <div
              className="bg-green-500"
              style={{ width: `${carbsPercent}%` }}
              data-testid="bar-carbs"
            />
          )}
          {fatPercent > 0 && (
            <div
              className="bg-yellow-500"
              style={{ width: `${fatPercent}%` }}
              data-testid="bar-fat"
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">Protein</span>
            </div>
            <p className="text-2xl font-bold font-mono" data-testid="text-protein-total">
              {protein}g
            </p>
            <p className="text-xs text-muted-foreground">
              {proteinPercent.toFixed(0)}%
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Carbs</span>
            </div>
            <p className="text-2xl font-bold font-mono" data-testid="text-carbs-total">
              {carbs}g
            </p>
            <p className="text-xs text-muted-foreground">
              {carbsPercent.toFixed(0)}%
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-muted-foreground">Fat</span>
            </div>
            <p className="text-2xl font-bold font-mono" data-testid="text-fat-total">
              {fat}g
            </p>
            <p className="text-xs text-muted-foreground">
              {fatPercent.toFixed(0)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
