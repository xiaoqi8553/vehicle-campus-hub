import { ArrowUpRight, RadioTower } from "lucide-react";

export function RadarVisual({ company, summary }: { company: string; summary: string }) {
  return (
    <div className="radar-visual" aria-hidden="true">
      <div className="radar-orbit radar-orbit-one" />
      <div className="radar-orbit radar-orbit-two" />
      <div className="radar-beam" />
      <span className="radar-point radar-point-one" />
      <span className="radar-point radar-point-two" />
      <div className="radar-note">
        <RadioTower size={18} />
        <span>最近更新</span>
        <strong>{company}</strong>
        <p>{summary}</p>
        <ArrowUpRight size={16} />
      </div>
    </div>
  );
}
