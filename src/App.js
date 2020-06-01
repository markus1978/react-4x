import React, { useState } from "react";
import "./styles.css";
import { makeStyles } from '@material-ui/styles';

// This is based on https://www.redblobgames.com/grids/hexagons/

class OffsetCoords {
  constructor(size) {
    this.size = size;
    this.w = Math.sqrt(3) * this.size;
    this.h = 2 * this.size;
  }

  center(x, y) {
    return y % 2 === 0
      ? [x * this.w, y * this.h * 0.75]
      : [(x + 0.5) * this.w, y * this.h * 0.75];
  }

  translateCenter(x, y) {
    const center = this.center(x, y)
    return `translate(${center[0]}, ${center[1]})`
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

  /**
   * Returns the sides that need to be rendered, if full grid lines are to be drawn
   * and we only want to draw each line once.
   *
   * @param {int} x
   * @param {int} y
   * @param {int} w
   */
  sides(x, y, w) {
    const result = [0, 1, 2];
    if (x + 1 === w) {
      result.push(3);
    }
    if (y === 0 || (y % 2 === 1 && x + 1 === w)) {
      result.push(4);
    }
    if (y === 0 || (y % 2 === 0 && x === 0)) {
      result.push(5);
    }
    return result;
  }
}

const useGridStyles = makeStyles(theme => ({
  polygon: {
    strokeWidth: 3,
    stroke: "black",
    fill: "grey"
  }
}))

const fieldModel = {
  // background
  // surfaces
  // structures
  // units
  // fog
}

class Unit {
  constructor(x, y, player, letter) {
    this.x = x || 2
    this.y = y || 3
    this.player = player || 0
    this.letter = letter
  }

  render() {
    return <g width="100" height="100">
      <circle r="30" fill={this.player === 0 ? "lightblue" : "red"} />
        <text fontSize="48" dominantBaseline="middle" textAnchor="middle">{this.letter}</text>
    </g>
  }
}

const units = [
  new Unit(2, 1, 0, 'F'), new Unit(2, 2, 0, 'A'), new Unit(2, 3, 0, 'B'), new Unit(2, 4, 0, 'I'),
  new Unit(6, 1, 1, 'K'), new Unit(6, 2, 1, 'O'), new Unit(6, 3, 1, 'N'), new Unit(6, 4, 1, 'S'), new Unit(6, 5, 1, 'T'), new Unit(6, 6, 1, 'I')
]

function Field({ x, y, w, offsetCoords, ...rest }) {
  const classes = useGridStyles()
  const points = offsetCoords.centerRelativePoints()

  return <g transform={offsetCoords.translateCenter(x, y)}>
    <Hex offsetCoords={offsetCoords} className={classes.polygon} {...rest} />
  </g>
}

function Hex({offsetCoords, ...rest}) {
  return <polygon
    points={offsetCoords.centerRelativePoints().map(([x, y]) => `${x},${y}`).join(" ")}
    {...rest}
  />
}

function Grid({ w, h, offsetCoords }) {
  const [player, setPlayer] = useState(0)
  const [selected, setSelected] = useState(units[0])

  const handleSelect = (unit) => {
    if (unit.player === player && unit !== selected) {
      setSelected(unit)
    }
  }

  return (
    <g>
      {[...Array(w).keys()].map(x =>
        [...Array(h).keys()].map(y =>
          <Field
            key={`${x},${y}`} x={x} y={y} w={w} offsetCoords={offsetCoords}
            onClick={() => {
              if (selected) {
                selected.x = x
                selected.y = y
                setSelected(units.find(unit => unit.player !== player))
                setPlayer((player + 1) % 2)
              }
            }}
          />
        )
      )}
      {units.map((unit, index) => (
        <g key={index} transform={offsetCoords.translateCenter(unit.x, unit.y)}>
          {unit.render()}
          <Hex offsetCoords={offsetCoords} onClick={() => handleSelect(unit)} fill="rgba(0, 0, 0, 0)" stroke="none" />
          {unit === selected && <circle r="50" fill="none" stroke="white" />}
        </g>))}
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
