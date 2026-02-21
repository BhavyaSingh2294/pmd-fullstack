import { cn } from "@/lib/utils";
import { DepartmentTags, Department } from "./DepartmentTag";
import { PhaseTimeline, ProjectPhase, PhaseBadge } from "./PhaseTimeline";
import { StatusBadge, ProjectStatus } from "./StatusBadge";
import { User, Users, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Project {
  _id: string;
  title: string;
  description?: string;
  mentor?: string;
  facultyName?: string;
  departments?: (Department | string)[];
  department?: string;
  currentPhase?: ProjectPhase;
  status?: ProjectStatus | string;
  appliedStudentIds?: string[];
  enrolledCount?: number;
  createdAt?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onApply?: () => void;
  showApplyButton?: boolean;
  variant?: "default" | "compact";
  className?: string;
}

export function ProjectCard({
  project,
  onClick,
  onApply,
  showApplyButton = false,
  variant = "default",
  className,
}: ProjectCardProps) {
  const departments = project.departments || (project.department ? [project.department] : []);
  const enrolledCount = project.enrolledCount || project.appliedStudentIds?.length || 0;
  const mentorName = project.mentor || project.facultyName || "Faculty Mentor";
  const currentPhase = project.currentPhase || "Problem Identification";
  const status = project.status || "Open";

  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "project-card p-4 cursor-pointer",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate font-sans">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="truncate">{mentorName}</span>
            </div>
          </div>
          <PhaseBadge phase={currentPhase} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "project-card cursor-pointer",
        className
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground line-clamp-1 font-sans">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate">{mentorName}</span>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* Department Tags */}
        {departments.length > 0 && (
          <div className="mb-4">
            <DepartmentTags departments={departments} max={3} />
          </div>
        )}

        {/* Phase Timeline */}
        <div className="mb-4 pt-2 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">Project Lifecycle</p>
          <PhaseTimeline currentPhase={currentPhase} compact showLabels={false} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{enrolledCount} enrolled</span>
          </div>
          {project.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {showApplyButton ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
          >
            Apply
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            View Details
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
