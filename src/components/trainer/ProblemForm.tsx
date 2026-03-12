import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Save, Loader2, Upload, Trash2, ImageIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type Topic, type Difficulty } from "@/lib/trainerStore";
import { hybridSaveProblem, type NormalizedProblem } from "@/hooks/useBackendData";

const TOPICS: Topic[] = ["HTML", "CSS", "JavaScript"];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

interface Props {
  initial?: NormalizedProblem;
  onSaved: () => void;
  onCancel: () => void;
}

const emptyProblem: Omit<NormalizedProblem, "id" | "createdAt"> = {
  title: "",
  description: "",
  topic: "HTML",
  difficulty: "Easy",
  expectedOutput: "",
  starterHtml: "<!DOCTYPE html>\n<html lang=\"en\">\n<head><meta charset=\"UTF-8\"><title>Starter</title></head>\n<body>\n  <!-- Your HTML here -->\n</body>\n</html>",
  starterCss: "/* Your CSS here */",
  starterJs: "// Your JavaScript here",
  referenceHtml: "",
  referenceCss: "",
  referenceJs: "",
  referenceImageUrl: "",
};

const ProblemForm = ({ initial, onSaved, onCancel }: Props) => {
  const [form, setForm] = useState<Omit<NormalizedProblem, "id" | "createdAt">>(
    initial ? { ...initial } : { ...emptyProblem }
  );
  const [codeTab, setCodeTab] = useState<"html" | "css" | "js">("html");
  const [refCodeTab, setRefCodeTab] = useState<"html" | "css" | "js">("html");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    try {
      await hybridSaveProblem(
        {
          ...form,
          id: initial?.id ?? "",
          createdAt: initial?.createdAt ?? new Date().toISOString(),
        },
        !initial,
      );
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const currentCode =
    codeTab === "html" ? form.starterHtml : codeTab === "css" ? form.starterCss : form.starterJs;
  const setCode = (val: string | undefined) => {
    if (val === undefined) return;
    if (codeTab === "html") set("starterHtml", val);
    else if (codeTab === "css") set("starterCss", val);
    else set("starterJs", val);
  };

  const currentRefCode =
    refCodeTab === "html" ? form.referenceHtml : refCodeTab === "css" ? form.referenceCss : form.referenceJs;
  const setRefCode = (val: string | undefined) => {
    if (val === undefined) return;
    if (refCodeTab === "html") set("referenceHtml", val);
    else if (refCodeTab === "css") set("referenceCss", val);
    else set("referenceJs", val);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set("referenceImageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    set("referenceImageUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h2 className="font-bold text-foreground">{initial ? "Edit Problem" : "Add New Problem"}</h2>
          <button onClick={onCancel} className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Problem Title</Label>
            <Input
              placeholder="e.g. Build a Navigation Bar"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="border-border/50 bg-secondary/30"
            />
          </div>

          {/* Topic + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Topic</Label>
              <div className="flex gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => set("topic", t)}
                    className={cn(
                      "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors",
                      form.topic === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => set("difficulty", d)}
                    className={cn(
                      "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors",
                      form.difficulty === d
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Explain what the student should build..."
              className="w-full resize-none rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Expected Output */}
          <div className="space-y-1.5">
            <Label>Expected Output</Label>
            <Input
              placeholder="Describe what a correct solution looks like"
              value={form.expectedOutput}
              onChange={(e) => set("expectedOutput", e.target.value)}
              className="border-border/50 bg-secondary/30"
            />
          </div>

          {/* Starter Code */}
          <div className="space-y-1.5">
            <Label>Starter Code</Label>
            <div className="flex gap-1 rounded-t-lg border-x border-t border-border/50 bg-secondary/30 px-2 pt-2">
              {(["html", "css", "js"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCodeTab(t)}
                  className={cn(
                    "rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors",
                    codeTab === t
                      ? "bg-card text-foreground border-x border-t border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="h-48 overflow-hidden rounded-b-lg border border-border/50">
              <Editor
                theme="vs-dark"
                language={codeTab === "js" ? "javascript" : codeTab}
                value={currentCode}
                onChange={setCode}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 8 },
                }}
              />
            </div>
          </div>

          {/* Reference Solution Code */}
          <div className="space-y-1.5">
            <Label>Reference Solution Code (used for evaluation)</Label>
            <p className="text-xs text-muted-foreground">
              Provide the correct solution. Puppeteer will render this and compare it visually against student submissions.
            </p>
            <div className="flex gap-1 rounded-t-lg border-x border-t border-border/50 bg-secondary/30 px-2 pt-2">
              {(["html", "css", "js"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setRefCodeTab(t)}
                  className={cn(
                    "rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors",
                    refCodeTab === t
                      ? "bg-card text-foreground border-x border-t border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="h-48 overflow-hidden rounded-b-lg border border-border/50">
              <Editor
                theme="vs-dark"
                language={refCodeTab === "js" ? "javascript" : refCodeTab}
                value={currentRefCode}
                onChange={setRefCode}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 8 },
                }}
              />
            </div>
          </div>

          {/* Reference Webpage Image Upload */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              Reference Webpage Image (optional)
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload a screenshot of the expected webpage output. This will be used for visual comparison during evaluation.
            </p>

            {form.referenceImageUrl ? (
              <div className="relative rounded-lg border border-border/50 overflow-hidden">
                <img
                  src={form.referenceImageUrl}
                  alt="Reference webpage"
                  className="w-full max-h-64 object-contain bg-secondary/20"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 bg-secondary/10 px-4 py-8 text-sm text-muted-foreground hover:border-primary/40 hover:bg-secondary/20 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Click to upload reference image (PNG, JPG)</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border/50 px-6 py-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {initial ? "Save Changes" : "Create Problem"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProblemForm;
