import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap, BookOpen } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  userIdentifier: string;
  userRole: "student" | "faculty";
  onLogout: () => void;
}

export function DashboardHeader({
  userName,
  userIdentifier,
  userRole,
  onLogout,
}: DashboardHeaderProps) {
  const isStudent = userRole === "student";
  const Icon = isStudent ? GraduationCap : BookOpen;
  const roleLabel = isStudent ? "Student" : "Faculty";
  const idLabel = isStudent ? "Roll Number" : "Faculty ID";

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-bold text-foreground">
                Welcome back, {userName}
              </h1>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                {roleLabel}
              </span>
              <span>{idLabel}: {userIdentifier}</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="self-start sm:self-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
