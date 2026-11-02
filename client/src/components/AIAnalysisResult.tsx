import { useState, useEffect } from "react";
import { Check, Edit2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { AIAnalysis } from "@shared/schema";

interface AIAnalysisResultProps {
  analysis: AIAnalysis;
  onSave: (data: AIAnalysis) => Promise<void>;
  imageUrl?: string;
}

export function AIAnalysisResult({ analysis, onSave, imageUrl }: AIAnalysisResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(analysis);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedData(analysis);
    setIsEditing(false);
  }, [analysis]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(editedData);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">AI Analysis Result</CardTitle>
        {analysis.confidence && (
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            {Math.round(analysis.confidence * 100)}% confident
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={analysis.name}
            className="w-full h-48 object-cover rounded-lg"
            data-testid="img-analysis-preview"
          />
        )}

        <div className="space-y-3">
          <div>
            <Label htmlFor="food-name">Food Name</Label>
            {isEditing ? (
              <Input
                id="food-name"
                value={editedData.name}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                data-testid="input-edit-name"
              />
            ) : (
              <p className="text-lg font-semibold mt-1" data-testid="text-food-name">
                {editedData.name}
              </p>
            )}
          </div>

          {analysis.description && (
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-food-description">
                {analysis.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="calories">Calories</Label>
              {isEditing ? (
                <Input
                  id="calories"
                  type="number"
                  value={editedData.calories}
                  onChange={(e) => setEditedData({ ...editedData, calories: parseInt(e.target.value) || 0 })}
                  data-testid="input-edit-calories"
                />
              ) : (
                <p className="text-2xl font-bold font-mono" data-testid="text-analysis-calories">
                  {editedData.calories}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="protein">Protein (g)</Label>
              {isEditing ? (
                <Input
                  id="protein"
                  type="number"
                  value={editedData.protein || 0}
                  onChange={(e) => setEditedData({ ...editedData, protein: parseInt(e.target.value) || 0 })}
                  data-testid="input-edit-protein"
                />
              ) : (
                <p className="text-2xl font-bold font-mono" data-testid="text-analysis-protein">
                  {editedData.protein || 0}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="carbs">Carbs (g)</Label>
              {isEditing ? (
                <Input
                  id="carbs"
                  type="number"
                  value={editedData.carbs || 0}
                  onChange={(e) => setEditedData({ ...editedData, carbs: parseInt(e.target.value) || 0 })}
                  data-testid="input-edit-carbs"
                />
              ) : (
                <p className="text-2xl font-bold font-mono" data-testid="text-analysis-carbs">
                  {editedData.carbs || 0}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="fat">Fat (g)</Label>
              {isEditing ? (
                <Input
                  id="fat"
                  type="number"
                  value={editedData.fat || 0}
                  onChange={(e) => setEditedData({ ...editedData, fat: parseInt(e.target.value) || 0 })}
                  data-testid="input-edit-fat"
                />
              ) : (
                <p className="text-2xl font-bold font-mono" data-testid="text-analysis-fat">
                  {editedData.fat || 0}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isEditing ? (
          <>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1" data-testid="button-save-analysis">
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedData(analysis);
              }}
              disabled={isSaving}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1" data-testid="button-add-to-log">
              Add to Log
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              data-testid="button-edit-analysis"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
