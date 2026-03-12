import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResultPanelProps {
  submitted: boolean;
}

const ResultPanel = ({ submitted }: ResultPanelProps) => {
  if (!submitted) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground text-center">
          Click <strong className="text-foreground">Submit</strong> to evaluate your code.
        </p>
      </div>
    );
  }

  const score = 65;
  const passed = 4;
  const failed = 2;

  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-foreground font-medium">Score</span>
          <span className="font-mono text-primary font-bold">{score}/100</span>
        </div>
        <Progress value={score} className="h-2 bg-secondary [&>div]:bg-primary" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-success/5 p-3 text-center">
          <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-success" />
          <p className="text-lg font-bold text-foreground">{passed}</p>
          <p className="text-xs text-muted-foreground">Passed</p>
        </div>
        <div className="rounded-lg border border-border bg-destructive/5 p-3 text-center">
          <XCircle className="mx-auto mb-1 h-5 w-5 text-destructive" />
          <p className="text-lg font-bold text-foreground">{failed}</p>
          <p className="text-xs text-muted-foreground">Failed</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <MessageSquare className="h-4 w-4 text-primary" />
          AI Feedback
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="rounded-lg border border-border bg-card p-3">
            ✅ Good document structure with proper semantic HTML.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            ⚠️ Missing background color on the body element. Add a CSS rule for better styling.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            💡 Consider using CSS Grid for the layout to match the reference design more closely.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
