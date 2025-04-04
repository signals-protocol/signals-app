import React from 'react'
import * as d3 from 'd3'

type AxisBottomProps = {
  scale: d3.ScaleTime<number, number>
  height: number
  margin: { top: number; right: number; bottom: number; left: number }
}

export default function AxisBottom({ scale, height, margin }: AxisBottomProps) {
  const ticks = scale.ticks(6)
  const tickFormat = d3.timeFormat('%d %b')

  return (
    <g transform={`translate(0, ${height - margin.bottom})`}>
      {ticks.map((tick, i) => {
        const x = scale(tick)
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <line y2={6} stroke="currentColor" />
            <text
              dy=".71em"
              y={9}
              fill="currentColor"
              textAnchor="middle"
              className="text-xs"
            >
              {tickFormat(tick)}
            </text>
          </g>
        )
      })}
    </g>
  )
} 