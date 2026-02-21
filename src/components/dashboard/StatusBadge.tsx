import { cn } from "@/lib/utils";
import { Circle, PlayCircle, CheckCircle2 } from "lucide-react";

export type ProjectStatus = "Open" | "In Progress" | "Completed";

interface StatusBadgeProps {
  status: ProjectStatus | string;
  className?: string;
}

const statusConfig: Record<string, { style: string; icon: typeof Circle }> = {
  Open: { style: "status-open", icon: Circle },
  "In Progress": { style: "status-in-progress", icon: PlayCircle },
  Completed: { style: "status-completed", icon: CheckCircle2 },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { style: "status-open", icon: Circle };
  const Icon = config.icon;

  return (
    <span className={cn("status-badge", config.style, className)}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}
