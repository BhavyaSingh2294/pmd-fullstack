import { cn } from "@/lib/utils";
import { Check, Lightbulb, Pencil, FlaskConical, Presentation } from "lucide-react";

export type ProjectPhase = 
  | "Problem Identification"
  | "Solution Design"
  | "Testing & Evaluation"
  | "Final Presentation";

interface PhaseTimelineProps {
  currentPhase: ProjectPhase;
  variant?: "horizontal" | "vertical";
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

const phases: { id: ProjectPhase; icon: typeof Lightbulb; label: string; shortLabel: string }[] = [
  { id: "Problem Identification", icon: Lightbulb, label: "Problem Identification", shortLabel: "Identify" },
  { id: "Solution Design", icon: Pencil, label: "Solution Design", shortLabel: "Design" },
  { id: "Testing & Evaluation", icon: FlaskConical, label: "Testing & Evaluation", shortLabel: "Testing" },
  { id: "Final Presentation", icon: Presentation, label: "Final Presentation", shortLabel: "Present" },
];

const phaseColors: Record<ProjectPhase, string> = {
  "Problem Identification": "bg-[hsl(199,89%,48%)] border-[hsl(199,89%,48%)]",
  "Solution Design": "bg-[hsl(262,52%,56%)] border-[hsl(262,52%,56%)]",
  "Testing & Evaluation": "bg-[hsl(38,92%,50%)] border-[hsl(38,92%,50%)]",
  "Final Presentation": "bg-[hsl(152,55%,42%)] border-[hsl(152,55%,42%)]",
};

export function PhaseTimeline({
  currentPhase,
  variant = "horizontal",
  showLabels = true,
  compact = false,
  className,
}: PhaseTimelineProps) {
  const currentPhaseIndex = phases.findIndex((p) => p.id === currentPhase);

  if (variant === "vertical") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;
          const isPending = index > currentPhaseIndex;

          return (
            <div key={phase.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted && "bg-success border-success text-success-foreground",
                    isCurrent && phaseColors[phase.id] + " text-white",
                    isPending && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                {index < phases.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-8 mt-1",
                      isCompleted ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
              {showLabels && (
                <div className="pt-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-foreground",
                      !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {phase.label}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {phases.map((phase, index) => {
        const Icon = phase.icon;
        const isCompleted = index < currentPhaseIndex;
        const isCurrent = index === currentPhaseIndex;
        const isPending = index > currentPhaseIndex;

        return (
          <div key={phase.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "rounded-full flex items-center justify-center border-2 transition-all",
                  compact ? "w-6 h-6" : "w-8 h-8",
                  isCompleted && "bg-success border-success text-success-foreground",
                  isCurrent && phaseColors[phase.id] + " text-white",
                  isPending && "bg-muted border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className={compact ? "w-3 h-3" : "w-4 h-4"} />
                ) : (
                  <Icon className={compact ? "w-3 h-3" : "w-4 h-4"} />
                )}
              </div>
              {showLabels && !compact && (
                <span
                  className={cn(
                    "text-[10px] font-medium text-center max-w-[60px]",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {phase.shortLabel}
                </span>
              )}
            </div>
            {index < phases.length - 1 && (
              <div
                className={cn(
                  "h-0.5 mx-1",
                  compact ? "w-4" : "w-8",
                  isCompleted ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PhaseBadge({ phase }: { phase: ProjectPhase }) {
  const phaseIndex = phases.findIndex((p) => p.id === phase);
  const phaseData = phases[phaseIndex];
  const Icon = phaseData?.icon || Lightbulb;

  const badgeStyles: Record<ProjectPhase, string> = {
    "Problem Identification": "phase-badge-identification",
    "Solution Design": "phase-badge-design",
    "Testing & Evaluation": "phase-badge-testing",
    "Final Presentation": "phase-badge-presentation",
  };

  return (
    <span className={cn("phase-badge", badgeStyles[phase])}>
      <Icon className="w-3 h-3" />
      {phase}
    </span>
  );
}
