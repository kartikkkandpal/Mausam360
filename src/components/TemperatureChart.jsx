import React, { useState, useRef, useEffect } from "react";

const TemperatureChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 200 });
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const resize = () => {
        const rect = chartRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  if (!data || data.length === 0) return null;

  // Format date labels (e.g., "27 Jun")
  const formatDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return "";
    if (dateStr.includes("/")) return dateStr;
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const temps = data.map((d) => d.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const chartHeight = dimensions.height;
  const chartWidth = dimensions.width;
  const margin = 42; 
  const innerWidth = chartWidth - margin * 2;
  const innerHeight = chartHeight - margin * 2;
  const pointGap = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  // Map temps to y-coordinates (inverted, SVG y=0 is top)
  const getY = (temp) =>
    margin + ((maxTemp - temp) / (maxTemp - minTemp)) * innerHeight;

  // Points for the line
  const points = data.map((d, i) => ({
    x: margin + i * pointGap,
    y: getY(d.temp),
    temp: d.temp,
    date: d.date,
  }));

  // SVG path for the line (smooth curve)
  const linePath = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return acc + ` Q${cx},${prev.y} ${p.x},${p.y}`;
  }, "");

  // Area fill path
  const areaPath =
    linePath +
    ` L${points[points.length - 1].x},${chartHeight - margin} L${points[0].x},${chartHeight - margin} Z`;

  // Y-axis grid/labels
  const yTicks = [];
  for (
    let t = minTemp;
    t <= maxTemp;
    t += Math.max(1, Math.round((maxTemp - minTemp) / 4))
  ) {
    yTicks.push(t);
  }

  return (
    <div
      ref={chartRef}
      className="rounded-2xl card-shadow w-full h-full flex flex-col"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        position: "relative",
        flex: 1,
        minHeight: 0,
        padding: 0,
      }}
    >
      <div className="font-semibold text-lg tracking-wide px-6 pt-6">
        Temperature Trends
      </div>
      <div className="flex-1 w-full h-full m-0 p-0">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          style={{ display: "block" }}
        >
          {/* Y-axis grid lines and labels */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <text
                x={margin - 16}
                y={getY(t) + 5}
                textAnchor="end"
                fontSize={13}
                fill="var(--text-secondary)"
                style={{ fontWeight: 500, opacity: 0.7 }}
              >
                {Math.round(t)}°
              </text>
              <line
                x1={margin}
                x2={chartWidth - margin}
                y1={getY(t)}
                y2={getY(t)}
                stroke="var(--bg-primary)"
                strokeDasharray="6 6"
                opacity={0.3}
              />
            </g>
          ))}
          {/* Area fill */}
          <path d={areaPath} fill="url(#gradient)" stroke="none" />
          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="gradient"
              x1="0"
              y1="0"
              x2="0"
              y2={chartHeight}
              gradientTransform={`rotate(90)`}
            >
              <stop offset="0%" stopColor="#00bfff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00bfff" stopOpacity="0.03" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodColor="#00bfff"
                floodOpacity="0.18"
              />
            </filter>
          </defs>
          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#00bfff"
            strokeWidth={4}
            filter="url(#shadow)"
          />
          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 8 : 6}
              fill={hovered === i ? "#00bfff" : "var(--bg-secondary)"}
              stroke="#00bfff"
              strokeWidth={2}
              style={{ cursor: "pointer", transition: "r 0.15s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={points[i].x}
              y={chartHeight - margin + 24}
              textAnchor="middle"
              fontSize={15}
              fill="var(--text-primary)"
              style={{ fontWeight: 500, opacity: 0.85 }}
            >
              {formatDate(d.date)}
            </text>
          ))}
          {/* Tooltip */}
          {hovered !== null && (
            <g>
              <rect
                x={points[hovered].x - 38}
                y={points[hovered].y - 44}
                rx={8}
                width={76}
                height={32}
                fill="#23263a"
                opacity={0.95}
                stroke="#00bfff"
                strokeWidth={1}
              />
              <text
                x={points[hovered].x}
                y={points[hovered].y - 24}
                textAnchor="middle"
                fontSize={15}
                fill="#fff"
                style={{ fontWeight: 600 }}
              >
                {formatDate(points[hovered].date)}
              </text>
              <text
                x={points[hovered].x}
                y={points[hovered].y - 8}
                textAnchor="middle"
                fontSize={15}
                fill="#00bfff"
                style={{ fontWeight: 600 }}
              >
                {points[hovered].temp}°C
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default TemperatureChart;