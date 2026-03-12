import { useMemo } from "react";
import { FileText, Target, Tag, Zap, ImageIcon, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { getProblems, getLessonContent } from "@/lib/trainerStore";
import { cn } from "@/lib/utils";

interface ProblemPanelProps {
  lessonTitle: string;
  lessonId?: string;
}

const DIFF_COLOR: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Hard: "text-red-400 bg-red-400/10 border-red-400/30",
};

const TOPIC_COLOR: Record<string, string> = {
  HTML: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  CSS: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  JavaScript: "text-yellow-300 bg-yellow-300/10 border-yellow-300/30",
};

const ProblemPanel = ({ lessonTitle, lessonId }: ProblemPanelProps) => {
  // 1. Check for trainer problem bank item (standalone problems)
  const trainerProblem = useMemo(() => {
    if (!lessonId) return null;
    return getProblems().find((p) => p.id === lessonId) ?? null;
  }, [lessonId]);

  // 2. Check for trainer syllabus lesson override (curriculum content)
  const lessonContent = useMemo(() => {
    if (!lessonId) return null;
    return getLessonContent(lessonId);
  }, [lessonId]);

  // ── Standalone trainer problem ─────────────────────────────────────────
  if (trainerProblem) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <h3 className="font-semibold text-sm text-foreground leading-snug">
            {trainerProblem.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", TOPIC_COLOR[trainerProblem.topic])}>
            <Tag className="h-2.5 w-2.5" />{trainerProblem.topic}
          </span>
          <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", DIFF_COLOR[trainerProblem.difficulty])}>
            <Zap className="h-2.5 w-2.5" />{trainerProblem.difficulty}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{trainerProblem.description}</p>

        {trainerProblem.expectedOutput && (
          <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Target className="h-3 w-3" />Expected Output
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{trainerProblem.expectedOutput}</p>
          </div>
        )}
      </div>
    );
  }

  // ── Syllabus lesson with trainer override ──────────────────────────────
  if (lessonContent && (lessonContent.task || lessonContent.referenceImageUrl)) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">{lessonTitle}</h3>
        </div>

        {/* Trainer task description */}
        {lessonContent.task && (
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p className="whitespace-pre-wrap">{lessonContent.task}</p>
          </div>
        )}

        {/* Reference image */}
        {lessonContent.referenceImageUrl && (
          <div className="rounded-xl border border-border/50 bg-secondary/20 overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-border/30 px-3 py-1.5 text-xs text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              Reference Image
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer bg-black/5">
                  <img
                    src={lessonContent.referenceImageUrl}
                    alt="Reference"
                    className="max-h-56 w-full object-contain p-2 transition-opacity group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="bg-background/90 text-foreground px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                      <ZoomIn className="h-3.5 w-3.5" />
                      Click to expand
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-fit max-h-[95vh] h-fit p-1 bg-transparent border-none shadow-none [&>button]:bg-background/80 [&>button]:hover:bg-background [&>button]:p-2 [&>button]:rounded-full">
                <DialogTitle className="sr-only">Reference Image Focus</DialogTitle>
                <img
                  src={lessonContent.referenceImageUrl}
                  alt="Reference"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl bg-black/50"
                />
              </DialogContent>
            </Dialog>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground italic">
          Content provided by your trainer
        </p>
      </div>
    );
  }

  // ── Default fallback (no trainer content yet) ──────────────────────────
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{lessonTitle}</h3>
      </div>

      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          Create a webpage that demonstrates the concept of{" "}
          <strong className="text-foreground">{lessonTitle}</strong>.
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
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer flex h-28 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground flex-col gap-1 transition-colors hover:bg-black/5">
              <ImageIcon className="h-5 w-5 opacity-40 transition-opacity group-hover:opacity-10" />
              <span className="transition-opacity group-hover:opacity-10">No reference image yet</span>
              <span className="text-[10px] opacity-60 transition-opacity group-hover:opacity-10">Trainer can upload one via Curriculum Manager</span>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-background/90 text-foreground px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                  <ZoomIn className="h-3.5 w-3.5" />
                  Click to expand
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] w-fit max-h-[95vh] h-[95vh] p-1 bg-transparent border-none shadow-none [&>button]:bg-background/80 [&>button]:hover:bg-background [&>button]:p-2 [&>button]:rounded-full flex items-center justify-center">
            <DialogTitle className="sr-only">No Reference Image</DialogTitle>
            <div className="flex h-1/2 w-[80vw] mx-auto items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-black/50 text-muted-foreground flex-col gap-4 shadow-2xl backdrop-blur-sm">
              <ImageIcon className="h-16 w-16 opacity-40" />
              <span className="text-xl font-medium">No reference image yet</span>
              <span className="text-sm opacity-60">The trainer has not uploaded a reference image for this lesson.</span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProblemPanel;
