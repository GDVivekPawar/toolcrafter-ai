
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: {
    toolName: string;
    features: string[];
    implementation: string[];
    uiComponents: string[];
  } | null;
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose, tool }) => {
  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{tool.toolName} - Live Preview</DialogTitle>
          <DialogDescription>
            This is an interactive preview of your generated accessibility tool.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow border-t pt-4 mt-4 overflow-y-auto">
          <p className="text-center text-gray-500 italic">Dynamic tool rendering will be implemented here.</p>
          <p className="mt-4 font-semibold">Suggested UI Components:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {tool.uiComponents.map((component, index) => (
              <li key={index}>{component}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LivePreviewModal;
