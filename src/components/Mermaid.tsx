import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
  className?: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, className = "" }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
      });

      mermaid.render("mermaid-chart", chart).then(({ svg }) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return <div ref={chartRef} className={`mermaid ${className}`} />;
};

export default Mermaid;
