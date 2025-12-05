import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, CheckCircle2, Circle, ClipboardList, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";
import { cn } from "@/lib/utils";

function TaskItem({ 
  task, 
  onToggle, 
  onDelete,
  isToggling,
  isDeleting
}: { 
  task: Task; 
  onToggle: () => void; 
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card 
      className={cn(
        "group p-4 transition-all duration-300 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        isDeleting && "opacity-50 scale-95",
        task.completed && "opacity-70"
      )}
      data-testid={`card-task-${task.id}`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          disabled={isToggling}
          className={cn(
            "flex-shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full",
            isToggling && "opacity-50"
          )}
          data-testid={`button-toggle-${task.id}`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground transition-all duration-200 hover:text-primary hover:scale-110" />
          )}
        </button>
        
        <span 
          className={cn(
            "flex-1 text-base font-medium transition-all duration-200 truncate",
            task.completed && "line-through text-muted-foreground"
          )}
          data-testid={`text-task-title-${task.id}`}
        >
          {task.title}
        </span>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 visible"
          data-testid={`button-delete-${task.id}`}
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <ClipboardList className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">No tasks yet</h3>
      <p className="text-muted-foreground text-center max-w-sm" data-testid="text-empty-description">
        Add your first task above to get started. Stay organized and boost your productivity!
      </p>
    </div>
  );
}

function ProgressSection({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Progress</span>
        </div>
        <span className="text-2xl font-bold text-primary" data-testid="text-progress-percentage">
          {percentage}%
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-3 bg-muted"
          data-testid="progress-bar"
        />
        <div 
          className="absolute inset-0 rounded-full opacity-30 blur-sm bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span data-testid="text-completed-count">{completed} completed</span>
        <span data-testid="text-total-count">{total} total</span>
      </div>
    </div>
  );
}

function TaskInputSection({ 
  onAdd, 
  isPending 
}: { 
  onAdd: (title: string) => void; 
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-12 text-base pr-24"
          data-testid="input-task-title"
          disabled={isPending}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none hidden sm:block">
          Press Enter
        </span>
      </div>
      <Button 
        type="submit" 
        disabled={!title.trim() || isPending}
        className="h-12 px-6 gap-2"
        data-testid="button-add-task"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">Add Task</span>
      </Button>
    </form>
  );
}

function StatsDisplay({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-testid="text-active-count">
          {active} Active
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-chart-2" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-testid="text-done-count">
          {completed} Done
        </span>
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/tasks", { title });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task added",
        description: "Your new task has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      setTogglingId(id);
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setTogglingId(null);
      toast({
        title: variables.completed ? "Task completed" : "Task reopened",
        description: variables.completed 
          ? "Great job! Keep up the momentum." 
          : "Task marked as incomplete.",
      });
    },
    onError: () => {
      setTogglingId(null);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setDeletingId(null);
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    },
    onError: () => {
      setDeletingId(null);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">We couldn't load your tasks. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} data-testid="button-refresh">
            Refresh Page
          </Button>
        </Card>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const sortedTasks = [...activeTasks, ...completedTasks];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3" data-testid="text-app-title">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                </div>
                TaskFlow
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Stay organized, get things done
              </p>
            </div>
            <StatsDisplay tasks={tasks} />
          </div>
        </header>

        <div className="space-y-6">
          <Card className="p-6">
            <TaskInputSection 
              onAdd={(title) => addTaskMutation.mutate(title)} 
              isPending={addTaskMutation.isPending}
            />
          </Card>

          {tasks.length > 0 && (
            <Card className="p-6">
              <ProgressSection tasks={tasks} />
            </Card>
          )}

          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-muted" />
                      <div className="flex-1 h-5 bg-muted rounded" />
                      <div className="w-9 h-9 bg-muted rounded" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <Card>
                <EmptyState />
              </Card>
            ) : (
              sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTaskMutation.mutate({ 
                    id: task.id, 
                    completed: !task.completed 
                  })}
                  onDelete={() => deleteTaskMutation.mutate(task.id)}
                  isToggling={togglingId === task.id}
                  isDeleting={deletingId === task.id}
                />
              ))
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>Built with care. Stay productive!</p>
        </footer>
      </div>
    </div>
  );
}
