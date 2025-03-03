import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface CodeEditorProps {
  initialCode: string;
  language?: "javascript" | "python";
}

export function CodeEditor({ initialCode, language = "javascript" }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    try {
      if (selectedLanguage === "javascript") {
        // Create a secure iframe environment for running JavaScript
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        
        const iframeWindow = iframe.contentWindow;
        if (!iframeWindow) throw new Error("Failed to create iframe");
        
        // Capture console.log output
        let output = "";
        iframeWindow.console.log = (...args) => {
          output += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(" ") + "\n";
        };

        // Run the code
        try {
          iframeWindow.eval(code);
          setOutput(output || "Code executed successfully!");
        } catch (error) {
          setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        document.body.removeChild(iframe);
      } else {
        // For Python, we'll need to implement server-side execution
        // This will be implemented when we add backend support
        setOutput("Python execution coming soon!");
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    setIsRunning(false);
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Select
            value={selectedLanguage}
            onValueChange={(value: "javascript" | "python") => setSelectedLanguage(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>
        
        <div className="min-h-[300px] border rounded-md overflow-hidden mb-4">
          <Editor
            height="300px"
            language={selectedLanguage}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 10 },
            }}
          />
        </div>

        <div className="bg-slate-900 text-slate-50 p-4 rounded-md font-mono text-sm">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
