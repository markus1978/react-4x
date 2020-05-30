import React from "react";
import "./styles.css";

const w = Math.sqrt(3) * 50;
const h = 2 * 50;

function Polygon({ x, y }) {
  const offset =
    y % 2 == 0 ? [x * w, y * h * 0.75] : [(x + 0.5) * w, y * h * 0.75];
  return (
    <g transform={`translate(${offset[0] + 150}, ${offset[1] + 150})`}>
      <circle r="5" x="0" y="0" fill="red" />

      <line x1="0" y1={h * 0.5} x2={w * 0.5} y2={h * 0.25} stroke="black" />
      <line x1="0" y1={h * 0.5} x2={-w * 0.5} y2={h * 0.25} stroke="black" />
      <line x1="0" y1={h * 0.5} x2="0" y2={h} stroke="black" />
    </g>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <svg with="500" height="500">
        <Polygon x={0} y={0} />
        <Polygon x={1} y={0} />
        <Polygon x={0} y={1} />
        <Polygon x={1} y={1} />
        <Polygon x={0} y={2} />
        <Polygon x={1} y={2} />
        <Polygon x={0} y={3} />
        <Polygon x={1} y={3} />
        <Polygon x={0} y={4} />
        <Polygon x={1} y={4} />
      </svg>
    </div>
  );
}
