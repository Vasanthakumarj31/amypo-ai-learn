import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Code2,
  Play,
  Send,
  RotateCcw,
  ChevronLeft,
  FileCode,
  Folder,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EditorTabs from "@/components/workspace/EditorTabs";
import ProblemPanel from "@/components/workspace/ProblemPanel";
import TestCasePanel from "@/components/workspace/TestCasePanel";
import ResultPanel from "@/components/workspace/ResultPanel";
import PreviewFrame from "@/components/workspace/PreviewFrame";
import { courses } from "@/data/courses";

const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello, AMYPO!</h1>
  <p>Start coding here.</p>
</body>
</html>`;

const defaultCSS = `body {
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  background: #1e293b;
  color: #f1f5f9;
}

h1 {
  font-size: 2rem;
}`;

const defaultJS = `// JavaScript code here
document.querySelector('h1')?.addEventListener('click', () => {
  alert('Hello from AMYPO!');
});`;

const rightTabs = ["Problem", "Tests", "Results"] as const;
type RightTab = (typeof rightTabs)[number];

const fileTree = [
  { name: "index.html", tab: "html" },
  { name: "style.css", tab: "css" },
  { name: "script.js", tab: "js" },
];

const Workspace = () => {
  const { lessonId } = useParams();
  const [activeTab, setActiveTab] = useState("html");
  const [rightTab, setRightTab] = useState<RightTab>("Problem");
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [explorerOpen, setExplorerOpen] = useState(true);

  const [htmlCode, setHtmlCode] = useState(defaultHTML);
  const [cssCode, setCssCode] = useState(defaultCSS);
  const [jsCode, setJsCode] = useState(defaultJS);

  const [previewHtml, setPreviewHtml] = useState(defaultHTML);
  const [previewCss, setPreviewCss] = useState(defaultCSS);
  const [previewJs, setPreviewJs] = useState(defaultJS);

  // Find lesson title
  let lessonTitle = "Lesson";
  for (const course of courses) {
    for (const level of course.levels) {
      const found = level.lessons.find((l) => l.id === lessonId);
      if (found) {
        lessonTitle = found.title;
        break;
      }
    }
  }

  const currentCode = activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : jsCode;
  const setCurrentCode = useCallback(
    (val: string | undefined) => {
      if (!val) return;
      if (activeTab === "html") setHtmlCode(val);
      else if (activeTab === "css") setCssCode(val);
      else setJsCode(val);
    },
    [activeTab]
  );

  const language = activeTab === "html" ? "html" : activeTab === "css" ? "css" : "javascript";

  const handleRun = () => {
    setPreviewHtml(htmlCode);
    setPreviewCss(cssCode);
    setPreviewJs(jsCode);
    setShowPreview(true);
  };

  const handleSubmit = () => {
    handleRun();
    setSubmitted(true);
    setRightTab("Results");
  };

  const handleReset = () => {
    setHtmlCode(defaultHTML);
    setCssCode(defaultCSS);
    setJsCode(defaultJS);
    setSubmitted(false);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-12 items-center justify-between border-b border-border bg-card/50 px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Code2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">AMYPO</span>
          </Link>
          <span className="text-xs text-muted-foreground">/ {lessonTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleReset} className="gap-1.5 border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button size="sm" onClick={handleRun} className="gap-1.5 bg-success text-success-foreground hover:bg-success/90">
            <Play className="h-3.5 w-3.5" />
            Run
          </Button>
          <Button size="sm" onClick={handleSubmit} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="h-3.5 w-3.5" />
            Submit
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Explorer */}
        <div className={cn("border-r border-border bg-card/30 transition-all", explorerOpen ? "w-48" : "w-10")}>
          <button
            onClick={() => setExplorerOpen(!explorerOpen)}
            className="flex h-8 w-full items-center gap-1 px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className={cn("h-3 w-3 transition-transform", explorerOpen && "rotate-90")} />
            {explorerOpen && <span className="uppercase tracking-wider font-semibold">Explorer</span>}
          </button>

          {explorerOpen && (
            <div className="px-2">
              <div className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground">
                <Folder className="h-3 w-3" />
                <span>src</span>
              </div>
              {fileTree.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveTab(file.tab)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-4 py-1.5 text-xs transition-colors",
                    activeTab === file.tab
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <FileCode className="h-3 w-3" />
                  {file.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Editor */}
        <div className="flex flex-1 flex-col">
          <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1">
            <Editor
              theme="vs-dark"
              language={language}
              value={currentCode}
              onChange={setCurrentCode}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                renderWhitespace: "selection",
                tabSize: 2,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* Right: Evaluation */}
        <div className="flex w-80 flex-col border-l border-border bg-card/30">
          <div className="flex border-b border-border">
            {rightTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={cn(
                  "flex-1 px-3 py-2.5 text-xs font-medium transition-colors border-b-2",
                  rightTab === tab
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto">
            {rightTab === "Problem" && <ProblemPanel lessonTitle={lessonTitle} />}
            {rightTab === "Tests" && <TestCasePanel />}
            {rightTab === "Results" && <ResultPanel submitted={submitted} />}
          </div>
        </div>
      </div>

      {/* Bottom: Preview */}
      {showPreview && (
        <div className="h-64 border-t border-border">
          <div className="flex h-8 items-center border-b border-border bg-card/50 px-4">
            <span className="text-xs font-medium text-muted-foreground">Live Preview</span>
          </div>
          <div className="h-[calc(100%-2rem)]">
            <PreviewFrame html={previewHtml} css={previewCss} js={previewJs} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
