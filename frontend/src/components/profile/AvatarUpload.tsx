import { useState, useRef, useCallback } from "react";
import AvatarEditor from "react-avatar-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface AvatarUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

export const AvatarUpload = ({ isOpen, onClose, onUploadComplete, currentImage }: AvatarUploadProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef<AvatarEditor>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (!editorRef.current || !image) return;

    setIsUploading(true);
    try {
      const canvas = editorRef.current.getImageScaledToCanvas();
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Failed to create image blob");
        }

        const croppedFile = new File([blob], image.name, {
          type: "image/png",
          lastModified: Date.now(),
        });

        const { avatarService } = await import("@/services/avatarService");
        const response = await avatarService.uploadAvatar(croppedFile);

        if (response.success && response.data?.url) {
          onUploadComplete(response.data.url);
          toast({
            title: "Success",
            description: "Avatar uploaded successfully",
          });
          handleClose();
        } else {
          throw new Error(response.message || "Upload failed");
        }
      }, "image/png");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setImage(null);
    setScale(1);
    setRotate(0);
    onClose();
  };

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!image ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="avatar-upload-input"
              />
              <label
                htmlFor="avatar-upload-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Click to upload image</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={250}
                  height={250}
                  border={50}
                  borderRadius={125}
                  color={[0, 0, 0, 0.6]}
                  scale={scale}
                  rotate={rotate}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-gray-500" />
                  <Slider
                    value={[scale]}
                    onValueChange={(value) => setScale(value[0])}
                    min={1}
                    max={3}
                    step={0.01}
                    className="flex-1"
                  />
                  <ZoomIn className="w-4 h-4 text-gray-500" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="w-full"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate 90°
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImage(null)}
                  className="w-full"
                >
                  Choose Different Image
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!image || isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};