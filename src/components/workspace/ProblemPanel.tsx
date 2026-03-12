import { FileText, Image } from "lucide-react";

interface ProblemPanelProps {
  lessonTitle: string;
}

const ProblemPanel = ({ lessonTitle }: ProblemPanelProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{lessonTitle}</h3>
      </div>

      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          Create a webpage that demonstrates the concept of <strong className="text-foreground">{lessonTitle}</strong>.
        </p>
        <p>Your page should include:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Proper HTML document structure</li>
          <li>Appropriate semantic elements</li>
          <li>Clean CSS styling</li>
          <li>Interactive behavior with JavaScript (if applicable)</li>
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          <Image className="h-3 w-3" />
          Reference Preview
        </div>
        <div className="flex h-32 items-center justify-center rounded border border-border bg-background text-xs text-muted-foreground">
          Expected output preview
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;
