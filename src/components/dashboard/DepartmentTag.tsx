import { cn } from "@/lib/utils";

export type Department = 
  | "Engineering"
  | "Management"
  | "Law"
  | "Education"
  | "Sciences";

interface DepartmentTagProps {
  department: Department | string;
  className?: string;
}

const departmentStyles: Record<string, string> = {
  Engineering: "dept-engineering",
  Management: "dept-management",
  Law: "dept-law",
  Education: "dept-education",
  Sciences: "dept-sciences",
};

export function DepartmentTag({ department, className }: DepartmentTagProps) {
  const style = departmentStyles[department] || "bg-muted text-muted-foreground";

  return (
    <span className={cn("dept-tag", style, className)}>
      {department}
    </span>
  );
}

interface DepartmentTagsProps {
  departments: (Department | string)[];
  max?: number;
  className?: string;
}

export function DepartmentTags({ departments, max = 3, className }: DepartmentTagsProps) {
  const visibleDepts = departments.slice(0, max);
  const remaining = departments.length - max;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visibleDepts.map((dept) => (
        <DepartmentTag key={dept} department={dept} />
      ))}
      {remaining > 0 && (
        <span className="dept-tag bg-muted text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
}
