
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { GeneratedTool } from '@/types/tool';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: GeneratedTool | null;
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose, tool }) => {
  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{tool.toolName} - Generated Code</DialogTitle>
          <DialogDescription>
            This is the auto-generated code for your tool. Dynamic rendering will be implemented next!
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow border-t pt-4 mt-4 overflow-auto bg-gray-900 text-white font-mono text-sm rounded-md p-4">
          <pre>
            <code>
              {tool.componentCode}
            </code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LivePreviewModal;
