import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Sparkles } from "lucide-react";
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
        <header className="flex h-16 items-center border-b border-border/50 px-8 bg-card/30 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-foreground">
            {courseFilter
              ? courses.find((c) => c.id === courseFilter)?.title + " Course"
              : "Dashboard"}
          </h1>
        </header>

        <div className="p-8">
          {/* Stats */}
          {!courseFilter && (
            <div className="mb-10 grid gap-5 sm:grid-cols-3">
              {courses.map((course, idx) => {
                const avg = Math.round(
                  course.levels.reduce((s, l) => s + l.progress, 0) / course.levels.length
                );
                const gradients = [
                  "from-orange-500 to-red-500",
                  "from-blue-500 to-purple-500",
                  "from-yellow-400 to-orange-500",
                ];
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="rounded-2xl border border-border/50 bg-card/50 p-6 card-hover backdrop-blur-sm"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-2xl">{course.icon}</span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${gradients[idx]} bg-clip-text text-transparent`}>{avg}%</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <Progress value={avg} className="mt-3 h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Course sections */}
          {filteredCourses.map((course) => (
            <div key={course.id} className="mb-10">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-5 flex items-center gap-2 text-xl font-bold text-foreground"
              >
                <span>{course.icon}</span> {course.title}
              </motion.h2>

              {course.levels.map((level) => (
                <div key={level.name} className="mb-8">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                      {level.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{level.progress}% complete</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {level.lessons.map((lesson, i) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.4 }}
                        className="group cursor-pointer rounded-xl border border-border/50 bg-card/50 p-5 card-hover backdrop-blur-sm"
                        onClick={() => navigate(`/workspace/${lesson.id}`)}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{lesson.title}</span>
                        </div>
                        <p className="mb-4 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {lesson.description}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5 px-3 text-xs text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
                        >
                          {lesson.completed ? (
                            <>
                              <Sparkles className="h-3 w-3" />
                              Review
                            </>
                          ) : (
                            <>
                              Start
                              <ChevronRight className="h-3 w-3" />
                            </>
                          )}
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
