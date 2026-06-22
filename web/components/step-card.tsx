interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 shrink-0">
          {step}
        </div>
        {step < 4 && <div className="w-px flex-1 bg-border my-2" />}
      </div>
      <div className="pb-8">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
