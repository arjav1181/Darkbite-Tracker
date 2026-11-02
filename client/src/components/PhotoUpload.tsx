import { useCallback, useState } from "react";
import { Upload, Camera, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onAnalyze: (file: File) => Promise<void>;
  isAnalyzing?: boolean;
}

export function PhotoUpload({ onAnalyze, isAnalyzing = false }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    await onAnalyze(file);
  }, [onAnalyze, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Food preview"
              className="w-full h-64 object-cover"
              data-testid="img-food-preview"
            />
            {!isAnalyzing && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={clearPreview}
                data-testid="button-clear-preview"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm font-medium">Analyzing your food...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`min-h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-colors ${
              isDragging
                ? "border-primary bg-accent"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            data-testid="dropzone-photo"
          >
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Food Photo</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
              Drag and drop your food image here, or click to browse
            </p>
            <label htmlFor="photo-upload">
              <Button variant="outline" asChild data-testid="button-browse-photo">
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </span>
              </Button>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
              data-testid="input-photo-file"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supported: JPG, PNG, WebP
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
