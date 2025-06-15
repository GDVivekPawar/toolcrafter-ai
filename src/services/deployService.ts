
import { ToolTemplate } from '@/types/template';

export const deployTool = (template: ToolTemplate): void => {
  // Create a new window with the tool
  const deployWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  
  if (!deployWindow) {
    alert('Please allow popups to deploy your tool');
    return;
  }

  // Generate the HTML for the deployed tool
  const deployedHTML = generateToolHTML(template);
  
  // Write the HTML to the new window
  deployWindow.document.open();
  deployWindow.document.write(deployedHTML);
  deployWindow.document.close();
  
  // Set the window title
  deployWindow.document.title = `${template.name} - ToolCrafter.AI`;
};

const generateToolHTML = (template: ToolTemplate): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name} - ToolCrafter.AI</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .tool-container { max-width: 800px; margin: 0 auto; }
        .tool-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
        .tool-content { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="tool-container">
        <div class="tool-header">
            <h1 class="text-2xl font-bold">${template.name}</h1>
            <p class="text-blue-100 mt-2">${template.description}</p>
            <div class="text-sm text-blue-200 mt-4">
                <strong>Features:</strong> ${template.features.join(', ')}
            </div>
        </div>
        <div class="tool-content">
            <div id="tool-root"></div>
        </div>
    </div>
    
    <script>
        // This would normally render the actual React component
        // For now, we'll show a placeholder that demonstrates the tool is deployed
        const toolRoot = document.getElementById('tool-root');
        toolRoot.innerHTML = \`
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🚀</div>
                <h2 style="color: #4f46e5; margin-bottom: 10px;">Tool Successfully Deployed!</h2>
                <p style="color: #6b7280; margin-bottom: 20px;">Your ${template.name} is now running in its own window.</p>
                <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #374151; margin-bottom: 10px;">Available Features:</h3>
                    <ul style="list-style: none; padding: 0; color: #6b7280;">
                        ${template.features.map(feature => `<li style="padding: 5px 0;">✓ ${feature}</li>`).join('')}
                    </ul>
                </div>
                <p style="color: #9ca3af; font-size: 14px;">
                    This is a demo deployment. In a real implementation, the full interactive tool would be rendered here.
                </p>
            </div>
        \`;
    </script>
</body>
</html>`;
};
