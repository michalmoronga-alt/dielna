export function Placeholder({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-5 flex flex-col gap-2 items-start">
      <span className="chip">Pripravujeme</span>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted">{text}</p>
    </div>
  );
}
