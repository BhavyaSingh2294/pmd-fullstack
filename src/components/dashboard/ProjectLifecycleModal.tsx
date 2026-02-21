import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhaseTimeline, ProjectPhase } from "./PhaseTimeline";
import { DepartmentTags } from "./DepartmentTag";
import { StatusBadge } from "./StatusBadge";
import { Project } from "./ProjectCard";
import { User, Users, Calendar, ExternalLink, X } from "lucide-react";

interface ProjectLifecycleModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
  showApplyButton?: boolean;
}

const phaseDescriptions: Record<ProjectPhase, { title: string; description: string }> = {
  "Problem Identification": {
    title: "Phase 1: Problem Identification",
    description: "Teams analyze real-world challenges, conduct research, and define the core problem statement. This phase involves stakeholder interviews, literature review, and problem scoping.",
  },
  "Solution Design": {
    title: "Phase 2: Solution Design",
    description: "Collaborative ideation and design of innovative solutions. Teams create prototypes, design specifications, and implementation plans using interdisciplinary approaches.",
  },
  "Testing & Evaluation": {
    title: "Phase 3: Testing & Evaluation",
    description: "Rigorous testing of proposed solutions through experiments, user testing, and iterative refinement. Data collection and analysis validate the solution effectiveness.",
  },
  "Final Presentation": {
    title: "Phase 4: Final Presentation",
    description: "Teams present their complete project to faculty panels, industry experts, and peers. Documentation, demonstration, and defense of the solution approach.",
  },
};

export function ProjectLifecycleModal({
  project,
  isOpen,
  onClose,
  onApply,
  showApplyButton = false,
}: ProjectLifecycleModalProps) {
  if (!project) return null;

  const departments = project.departments || (project.department ? [project.department] : []);
  const enrolledCount = project.enrolledCount || project.appliedStudentIds?.length || 0;
  const mentorName = project.mentor || project.facultyName || "Faculty Mentor";
  const currentPhase = project.currentPhase || "Problem Identification";
  const status = project.status || "Open";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-display">
                {project.title}
              </DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {mentorName}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {enrolledCount} enrolled
                </span>
              </DialogDescription>
            </div>
            <StatusBadge status={status} />
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Description */}
          {project.description && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          )}

          {/* Departments */}
          {departments.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Interdisciplinary Focus
              </h4>
              <DepartmentTags departments={departments} max={5} />
            </div>
          )}

          {/* Lifecycle Timeline */}
          <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Project Lifecycle Progress
            </h4>
            <PhaseTimeline
              currentPhase={currentPhase}
              variant="vertical"
              showLabels
            />
          </div>

          {/* Current Phase Details */}
          <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
            <h4 className="text-sm font-semibold text-primary mb-2">
              {phaseDescriptions[currentPhase].title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {phaseDescriptions[currentPhase].description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {showApplyButton && status === "Open" && (
              <Button onClick={onApply}>
                Apply for Project
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
