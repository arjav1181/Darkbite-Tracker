import { Trash2, Clock, Camera, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FoodEntry } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface FoodLogEntryProps {
  entry: FoodEntry;
  onDelete: (id: string) => void;
}

export function FoodLogEntry({ entry, onDelete }: FoodLogEntryProps) {
  const timestamp = new Date(entry.timestamp);
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <Card className="hover-elevate">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {entry.imageUrl ? (
            <img
              src={entry.imageUrl}
              alt={entry.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              data-testid={`img-food-${entry.id}`}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Type className="w-6 h-6 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-base truncate" data-testid={`text-food-name-${entry.id}`}>
                {entry.name}
              </h4>
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0 h-8 w-8"
                onClick={() => onDelete(entry.id)}
                data-testid={`button-delete-${entry.id}`}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>

            {entry.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                {entry.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary" className="font-mono font-semibold" data-testid={`text-calories-${entry.id}`}>
                {entry.calories} cal
              </Badge>
              
              {(entry.protein || entry.carbs || entry.fat) && (
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {(entry.protein ?? 0) > 0 && <span>P: {entry.protein ?? 0}g</span>}
                  {(entry.carbs ?? 0) > 0 && <span>C: {entry.carbs ?? 0}g</span>}
                  {(entry.fat ?? 0) > 0 && <span>F: {entry.fat ?? 0}g</span>}
                </div>
              )}

              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                {entry.entryType === 'photo' ? (
                  <Camera className="w-3 h-3" />
                ) : (
                  <Type className="w-3 h-3" />
                )}
                <Clock className="w-3 h-3" />
                <span data-testid={`text-timestamp-${entry.id}`}>{timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
