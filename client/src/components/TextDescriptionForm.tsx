import { useState } from "react";
import { PenSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TextDescriptionFormProps {
  onAnalyze: (description: string) => Promise<void>;
  isAnalyzing?: boolean;
}

export function TextDescriptionForm({ onAnalyze, isAnalyzing = false }: TextDescriptionFormProps) {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    await onAnalyze(description);
    setDescription("");
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2">
            <PenSquare className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl">Describe Your Meal</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="E.g., Grilled chicken breast with rice and vegetables, large apple, protein shake..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 resize-none"
              disabled={isAnalyzing}
              data-testid="input-food-description"
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible for better accuracy
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!description.trim() || isAnalyzing}
            data-testid="button-analyze-description"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze & Add to Log
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
