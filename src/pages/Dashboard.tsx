import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardSidebar from "@/components/DashboardSidebar";
import { courses } from "@/data/courses";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseFilter = searchParams.get("course");

  const filteredCourses = courseFilter
    ? courses.filter((c) => c.id === courseFilter)
    : courses;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <header className="flex h-16 items-center border-b border-border px-8">
          <h1 className="text-lg font-semibold text-foreground">
            {courseFilter
              ? courses.find((c) => c.id === courseFilter)?.title + " Course"
              : "Dashboard"}
          </h1>
        </header>

        <div className="p-8">
          {/* Stats */}
          {!courseFilter && (
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {courses.map((course) => {
                const avg = Math.round(
                  course.levels.reduce((s, l) => s + l.progress, 0) / course.levels.length
                );
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-2xl">{course.icon}</span>
                      <span className="text-sm font-medium text-primary">{avg}%</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <Progress value={avg} className="mt-2 h-1.5 bg-secondary [&>div]:bg-primary" />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Course sections */}
          {filteredCourses.map((course) => (
            <div key={course.id} className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span>{course.icon}</span> {course.title}
              </h2>

              {course.levels.map((level) => (
                <div key={level.name} className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {level.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{level.progress}% complete</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {level.lessons.map((lesson, i) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="group cursor-pointer rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40"
                        onClick={() => navigate(`/workspace/${lesson.id}`)}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{lesson.title}</span>
                        </div>
                        <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                          {lesson.description}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 gap-1 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                        >
                          {lesson.completed ? "Review" : "Start"}
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
