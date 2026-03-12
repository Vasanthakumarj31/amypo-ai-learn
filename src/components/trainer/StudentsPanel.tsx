import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getStudents,
  getSubmissionsForStudent,
  studentAvgScore,
  studentWeakTopic,
  type Student,
  type Topic,
} from "@/lib/trainerStore";
import StudentDetail from "./StudentDetail";

const TOPIC_COLOR: Record<Topic, string> = {
  HTML: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  CSS: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  JavaScript: "text-yellow-300 bg-yellow-300/10 border-yellow-300/30",
};

const SCORE_COLOR = (s: number) =>
  s >= 80 ? "text-emerald-400" : s >= 60 ? "text-yellow-400" : "text-red-400";

const StudentsPanel = () => {
  const students = useMemo(() => getStudents(), []);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);

  const rows = useMemo(
    () =>
      students
        .filter((s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
        )
        .map((s) => ({
          ...s,
          attempted: getSubmissionsForStudent(s.id).length,
          avg: studentAvgScore(s.id),
          weak: studentWeakTopic(s.id),
        })),
    [students, search]
  );

  if (selected)
    return <StudentDetail student={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Students</h2>
        <p className="text-sm text-muted-foreground">{students.length} enrolled students</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-border/50 bg-secondary/30"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/30">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Student</th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Attempted</th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Avg Score</th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Weak Topic</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(s)}
                className="cursor-pointer border-b border-border/30 bg-card/30 hover:bg-secondary/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                      {s.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-foreground">{s.attempted}</td>
                <td className={cn("px-4 py-3 text-center font-semibold", SCORE_COLOR(s.avg))}>
                  {s.avg}%
                </td>
                <td className="px-4 py-3 text-center">
                  {s.weak ? (
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", TOPIC_COLOR[s.weak])}>
                      <AlertTriangle className="h-3 w-3" />
                      {s.weak}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No students found.</div>
        )}
      </div>
    </div>
  );
};

export default StudentsPanel;
