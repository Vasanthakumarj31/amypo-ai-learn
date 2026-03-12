import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestCase {
  id: string;
  name: string;
  category: string;
  status: "passed" | "failed" | "pending";
}

const mockTests: TestCase[] = [
  { id: "1", name: "Document has <!DOCTYPE html>", category: "DOM Tests", status: "passed" },
  { id: "2", name: "Contains <h1> element", category: "DOM Tests", status: "passed" },
  { id: "3", name: "Has valid <head> with <title>", category: "DOM Tests", status: "pending" },
  { id: "4", name: "Body background color is set", category: "CSS Style Tests", status: "failed" },
  { id: "5", name: "Font size is at least 16px", category: "CSS Style Tests", status: "pending" },
  { id: "6", name: "Uses flexbox or grid layout", category: "CSS Style Tests", status: "pending" },
  { id: "7", name: "Button click handler works", category: "Interaction Tests", status: "pending" },
  { id: "8", name: "Layout matches reference", category: "Visual Tests", status: "pending" },
];

const statusIcon = {
  passed: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
  failed: <XCircle className="h-3.5 w-3.5 text-destructive" />,
  pending: <Circle className="h-3.5 w-3.5 text-muted-foreground" />,
};

const TestCasePanel = () => {
  const categories = [...new Set(mockTests.map((t) => t.category))];

  return (
    <div className="p-4 space-y-4">
      {categories.map((cat) => (
        <div key={cat}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {cat}
          </h4>
          <div className="space-y-1">
            {mockTests
              .filter((t) => t.category === cat)
              .map((test) => (
                <div
                  key={test.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-xs",
                    test.status === "passed" && "bg-success/5",
                    test.status === "failed" && "bg-destructive/5",
                    test.status === "pending" && "bg-secondary/30"
                  )}
                >
                  {statusIcon[test.status]}
                  <span className="text-foreground">{test.name}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCasePanel;
