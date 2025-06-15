
export const exportToText = (toolData: any, filename: string = 'accessibility-tool') => {
  const content = `
Accessibility Tool: ${toolData.toolName}

Features:
${toolData.features?.map((feature: string, index: number) => `${index + 1}. ${feature}`).join('\n') || 'No features listed'}

Implementation Steps:
${toolData.implementation?.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n') || 'No implementation steps listed'}

UI Components:
${toolData.uiComponents?.map((component: string, index: number) => `${index + 1}. ${component}`).join('\n') || 'No UI components listed'}

Generated on: ${new Date().toLocaleDateString()}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = (toolData: any, filename: string = 'accessibility-tool') => {
  // Simple PDF export using HTML to PDF conversion
  const content = `
    <html>
      <head>
        <title>${toolData.toolName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { color: #666; margin-top: 30px; }
          ul { margin: 10px 0; }
          li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h1>${toolData.toolName}</h1>
        
        <h2>Features</h2>
        <ul>
          ${toolData.features?.map((feature: string) => `<li>${feature}</li>`).join('') || '<li>No features listed</li>'}
        </ul>
        
        <h2>Implementation Steps</h2>
        <ul>
          ${toolData.implementation?.map((step: string) => `<li>${step}</li>`).join('') || '<li>No implementation steps listed</li>'}
        </ul>
        
        <h2>UI Components</h2>
        <ul>
          ${toolData.uiComponents?.map((component: string) => `<li>${component}</li>`).join('') || '<li>No UI components listed</li>'}
        </ul>
        
        <p><small>Generated on: ${new Date().toLocaleDateString()}</small></p>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
};
