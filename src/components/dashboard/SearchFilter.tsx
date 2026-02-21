import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentFilter?: string;
  onDepartmentChange?: (value: string) => void;
  phaseFilter?: string;
  onPhaseChange?: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  showDepartmentFilter?: boolean;
  showPhaseFilter?: boolean;
  showStatusFilter?: boolean;
  className?: string;
}

const departments = [
  { value: "all", label: "All Departments" },
  { value: "Engineering", label: "Engineering" },
  { value: "Management", label: "Management" },
  { value: "Law", label: "Law" },
  { value: "Education", label: "Education" },
  { value: "Sciences", label: "Sciences" },
];

const phases = [
  { value: "all", label: "All Phases" },
  { value: "Problem Identification", label: "Problem Identification" },
  { value: "Solution Design", label: "Solution Design" },
  { value: "Testing & Evaluation", label: "Testing & Evaluation" },
  { value: "Final Presentation", label: "Final Presentation" },
];

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

export function SearchFilter({
  searchTerm,
  onSearchChange,
  departmentFilter = "all",
  onDepartmentChange,
  phaseFilter = "all",
  onPhaseChange,
  statusFilter = "all",
  onStatusChange,
  showDepartmentFilter = true,
  showPhaseFilter = true,
  showStatusFilter = false,
  className,
}: SearchFilterProps) {
  const hasActiveFilters = 
    searchTerm || 
    (departmentFilter && departmentFilter !== "all") || 
    (phaseFilter && phaseFilter !== "all") || 
    (statusFilter && statusFilter !== "all");

  const clearFilters = () => {
    onSearchChange("");
    onDepartmentChange?.("all");
    onPhaseChange?.("all");
    onStatusChange?.("all");
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card border-border/50"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {showDepartmentFilter && onDepartmentChange && (
          <Select value={departmentFilter} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-[160px] bg-card border-border/50">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showPhaseFilter && onPhaseChange && (
          <Select value={phaseFilter} onValueChange={onPhaseChange}>
            <SelectTrigger className="w-[180px] bg-card border-border/50">
              <SelectValue placeholder="Phase" />
            </SelectTrigger>
            <SelectContent>
              {phases.map((phase) => (
                <SelectItem key={phase.value} value={phase.value}>
                  {phase.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showStatusFilter && onStatusChange && (
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px] bg-card border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
