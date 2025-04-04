import React from 'react'
import * as d3 from 'd3'

type AxisLeftProps = {
  scale: d3.ScaleBand<string>
  margin: { top: number; left: number }
}

export default function AxisLeft({ scale, margin }: AxisLeftProps) {
  const domain = scale.domain()

  return (
    <g transform={`translate(${margin.left}, 0)`}>
      {domain.map((d, i) => {
        const y = scale(d)
        if (y === undefined) return null
        return (
          <g key={i} transform={`translate(0, ${y + scale.bandwidth() / 2})`}>
            <line x2={-6} stroke="currentColor" />
            <text
              x={-8}
              dy=".32em"
              fill="currentColor"
              textAnchor="end"
              className="text-xs"
            >
              {d}
            </text>
          </g>
        )
      })}
    </g>
  )
} 