interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 border border-primary text-primary text-xs font-medium flex items-center justify-center shrink-0">
          {step}
        </div>
        {step < 4 && <div className="w-px flex-1 bg-border my-1" />}
      </div>
      <div className="pb-5">
        <h3 className="font-medium text-sm mb-0.5">{title}</h3>
        <p className="text-muted text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
