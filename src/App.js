import React from "react";
import "./styles.css";

// This is based on https://www.redblobgames.com/grids/hexagons/

class OffsetCoords {
  constructor(size) {
    this.size = size;
    this.w = Math.sqrt(3) * this.size;
    this.h = 2 * this.size;
  }

  center(x, y) {
    return y % 2 == 0
      ? [x * this.w, y * this.h * 0.75]
      : [(x + 0.5) * this.w, y * this.h * 0.75];
  }

  centerRelativePoints() {
    return [
      [-0.5 * this.w, -0.25 * this.h],
      [-0.5 * this.w, 0.25 * this.h],
      [0, 0.5 * this.h],
      [0.5 * this.w, 0.25 * this.h],
      [0.5 * this.w, -0.25 * this.h],
      [0, -0.5 * this.h]
    ];
  }
}

function Polygon({ x, y, offsetCoords }) {
  const center = offsetCoords.center(x, y);
  return (
    <g transform={`translate(${center[0]}, ${center[1]})`}>
      <polygon
        points={offsetCoords
          .centerRelativePoints()
          .map(([x, y]) => `${x},${y}`)
          .join(" ")}
        fill="grey"
      />
      <circle r="5" x="0" y="0" fill="red" />
    </g>
  );
}

function Line({ x, y, sides, offsetCoords }) {
  const center = offsetCoords.center(x, y);
  const points = offsetCoords.centerRelativePoints();
  return (
    <g transform={`translate(${center[0]}, ${center[1]})`}>
      {sides.map(side => (
        <line
          x1={points[side][0]}
          y1={points[side][1]}
          x2={points[(side + 1) % 6][0]}
          y2={points[(side + 1) % 6][1]}
          stroke="black"
        />
      ))}
    </g>
  );
}

function Grid({ w, h, offsetCoords }) {
  const sides = (x, y) => {
    const result = [0, 1, 2];
    if (y + 1 === w) {
      result.push(3);
    }
    return result;
  };
  return (
    <g>
      {[...Array(w).keys()].map(x =>
        [...Array(h).keys()].map(y => (
          <React.Fragment>
            <Polygon
              key={`poly${x},${y}`}
              x={x}
              y={y}
              offsetCoords={offsetCoords}
            />
            <Line
              key={`line${x},${y}`}
              x={x}
              y={y}
              offsetCoords={offsetCoords}
              sides={sides(x, y)}
            />
          </React.Fragment>
        ))
      )}
    </g>
  );
}

export default function App() {
  const offsetCoords = new OffsetCoords(50);
  return (
    <div className="App">
      <svg
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%"
        }}
      >
        <g
          transform={`translate(${offsetCoords.w * 0.5}, ${offsetCoords.h *
            0.5})`}
        >
          <Grid w={10} h={10} offsetCoords={offsetCoords} />
        </g>
      </svg>
    </div>
  );
}
