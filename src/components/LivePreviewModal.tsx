
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneratedTool } from '@/types/tool';
import DynamicComponentRenderer from './DynamicComponentRenderer';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: GeneratedTool | null;
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose, tool }) => {
  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{tool.toolName} - Live Preview & Code</DialogTitle>
          <DialogDescription>
            Interact with a live preview of your tool or view the generated code.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow border-t pt-4 mt-4 overflow-hidden">
          <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="code">Generated Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex-grow overflow-auto p-4 border rounded-md mt-2">
              <DynamicComponentRenderer code={tool.componentCode} />
            </TabsContent>
            <TabsContent value="code" className="flex-grow overflow-auto mt-2">
               <div className="h-full bg-gray-900 text-white font-mono text-sm rounded-md p-4 overflow-auto">
                <pre>
                  <code>
                    {tool.componentCode}
                  </code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LivePreviewModal;
