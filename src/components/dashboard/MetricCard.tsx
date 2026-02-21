import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "accent";
  className?: string;
}

const variantStyles = {
  default: {
    icon: "bg-muted text-muted-foreground",
    ring: "",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    ring: "ring-1 ring-primary/10",
  },
  success: {
    icon: "bg-success/10 text-success",
    ring: "ring-1 ring-success/10",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    ring: "ring-1 ring-warning/10",
  },
  accent: {
    icon: "bg-accent/10 text-accent",
    ring: "ring-1 ring-accent/10",
  },
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "metric-card group",
        styles.ring,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-foreground font-sans">
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
            styles.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
