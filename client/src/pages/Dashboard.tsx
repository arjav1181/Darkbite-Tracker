import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalorieProgress } from "@/components/CalorieProgress";
import { PhotoUpload } from "@/components/PhotoUpload";
import { TextDescriptionForm } from "@/components/TextDescriptionForm";
import { AIAnalysisResult } from "@/components/AIAnalysisResult";
import { FoodLogEntry } from "@/components/FoodLogEntry";
import { MacroBreakdown } from "@/components/MacroBreakdown";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { FoodEntry, AIAnalysis } from "@shared/schema";

export default function Dashboard() {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysis | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [pendingEntryType, setPendingEntryType] = useState<"photo" | "text">("photo");
  const { toast } = useToast();

  const DAILY_CALORIE_GOAL = 2000;

  const { data: entries = [], isLoading } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries"],
  });

  const analyzePhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to analyze photo");
      }
      return response.json();
    },
    onSuccess: (data: { analysis: AIAnalysis; imageUrl: string }) => {
      setAnalysisResult(data.analysis);
      setPendingImageUrl(data.imageUrl);
      setPendingEntryType("photo");
      toast({
        title: "Photo analyzed!",
        description: "Review the results and add to your log",
      });
    },
    onError: () => {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeTextMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await apiRequest("POST", "/api/analyze-text", { description });
      return await response.json();
    },
    onSuccess: (data: AIAnalysis) => {
      setAnalysisResult(data);
      setPendingImageUrl(null);
      setPendingEntryType("text");
      toast({
        title: "Description analyzed!",
        description: "Review the results and add to your log",
      });
    },
    onError: () => {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the description. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: async (data: AIAnalysis) => {
      return await apiRequest("POST", "/api/food-entries", {
        name: data.name,
        description: data.description,
        calories: Math.round(data.calories),
        protein: Math.round(data.protein || 0),
        carbs: Math.round(data.carbs || 0),
        fat: Math.round(data.fat || 0),
        imageUrl: pendingImageUrl,
        entryType: pendingEntryType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
      setAnalysisResult(null);
      setPendingImageUrl(null);
      toast({
        title: "Added to log!",
        description: "Your food entry has been saved",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/food-entries/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
      toast({
        title: "Entry deleted",
        description: "Food entry removed from your log",
      });
    },
  });

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = entries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = entries.reduce((sum, entry) => sum + (entry.fat || 0), 0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CalorieAI</h1>
                <p className="text-sm text-muted-foreground">Smart Food Tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground hidden sm:inline">{today}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <CalorieProgress consumed={totalCalories} goal={DAILY_CALORIE_GOAL} />
              </CardContent>
            </Card>

            <MacroBreakdown protein={totalProtein} carbs={totalCarbs} fat={totalFat} />

            <Tabs defaultValue="photo" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="photo" data-testid="tab-photo">Upload Photo</TabsTrigger>
                <TabsTrigger value="text" data-testid="tab-text">Describe Food</TabsTrigger>
              </TabsList>
              <TabsContent value="photo" className="mt-4">
                <PhotoUpload
                  onAnalyze={(file) => analyzePhotoMutation.mutateAsync(file)}
                  isAnalyzing={analyzePhotoMutation.isPending}
                />
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <TextDescriptionForm
                  onAnalyze={(description) => analyzeTextMutation.mutateAsync(description)}
                  isAnalyzing={analyzeTextMutation.isPending}
                />
              </TabsContent>
            </Tabs>

            {analysisResult && (
              <AIAnalysisResult
                analysis={analysisResult}
                imageUrl={pendingImageUrl || undefined}
                onSave={(data) => addEntryMutation.mutateAsync(data)}
              />
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Today's Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading entries...
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-muted inline-flex p-4 mb-3">
                      <Utensils className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No entries yet. Add your first meal!
                    </p>
                  </div>
                ) : (
                  entries
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((entry) => (
                      <FoodLogEntry
                        key={entry.id}
                        entry={entry}
                        onDelete={deleteEntryMutation.mutate}
                      />
                    ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
