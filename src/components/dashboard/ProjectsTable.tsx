import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DepartmentTags } from "./DepartmentTag";
import { PhaseBadge, ProjectPhase } from "./PhaseTimeline";
import { StatusBadge } from "./StatusBadge";
import { Project } from "./ProjectCard";
import { ChevronUp, ChevronDown, Users, Eye, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsTableProps {
  projects: Project[];
  onViewProject: (project: Project) => void;
  onAdvancePhase?: (project: Project) => void;
  showAdvancePhase?: boolean;
  className?: string;
}

type SortKey = "title" | "status" | "enrolledCount";
type SortDirection = "asc" | "desc";

export function ProjectsTable({
  projects,
  onViewProject,
  onAdvancePhase,
  showAdvancePhase = false,
  className,
}: ProjectsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({ key: "title", direction: "asc" });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aValue = sortConfig.key === "enrolledCount" 
      ? (a.appliedStudentIds?.length || 0)
      : a[sortConfig.key] || "";
    const bValue = sortConfig.key === "enrolledCount"
      ? (b.appliedStudentIds?.length || 0)
      : b[sortConfig.key] || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const phases: ProjectPhase[] = [
    "Problem Identification",
    "Solution Design",
    "Testing & Evaluation",
    "Final Presentation",
  ];

  const getNextPhase = (currentPhase: ProjectPhase): ProjectPhase | null => {
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      return phases[currentIndex + 1];
    }
    return null;
  };

  return (
    <div className={cn("bg-card rounded-xl border border-border/50 overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center gap-1">
                Project Title
                <SortIcon columnKey="title" />
              </div>
            </TableHead>
            <TableHead>Departments</TableHead>
            <TableHead>Current Phase</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("enrolledCount")}
            >
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Students
                <SortIcon columnKey="enrolledCount" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1">
                Status
                <SortIcon columnKey="status" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => {
            const departments = project.departments || (project.department ? [project.department] : []);
            const enrolledCount = project.enrolledCount || project.appliedStudentIds?.length || 0;
            const currentPhase = project.currentPhase || "Problem Identification";
            const status = project.status || "Open";
            const nextPhase = getNextPhase(currentPhase);

            return (
              <TableRow key={project._id} className="group">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{project.title}</p>
                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DepartmentTags departments={departments} max={2} />
                </TableCell>
                <TableCell>
                  <PhaseBadge phase={currentPhase} />
                </TableCell>
                <TableCell>
                  <span className="font-medium">{enrolledCount}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProject(project)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {showAdvancePhase && nextPhase && status !== "Completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAdvancePhase?.(project)}
                        className="text-primary border-primary/30 hover:bg-primary/10"
                      >
                        Advance
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {sortedProjects.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No projects found matching your criteria
        </div>
      )}
    </div>
  );
}
