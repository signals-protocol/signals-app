import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import AxisBottom from "./AxisBottom";
import AxisLeft from "./AxisLeft";

export interface HeatmapDatum {
  date: Date | string;
  values: number[];
}

export type HeatmapChartProps = {
  data: HeatmapDatum[];
  priceBins: number[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function HeatmapChart({
  data,
  priceBins,
  margin = { top: 20, right: 20, bottom: 40, left: 60 },
}: HeatmapChartProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      const newWidth = containerRef.current?.parentElement?.clientWidth ?? 0;
      setContainerWidth(newWidth);
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current.parentElement!);

    return () => resizeObserver.disconnect();
  }, []);

  const height = 500;

  // x축 scale을 containerWidth 기준으로 수정
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
    .range([margin.left, containerWidth - margin.right]);

  // y축 scale
  const yScale = d3
    .scaleBand()
    .domain(priceBins.map(String))
    .range([height - margin.bottom, margin.top]);

  // 색상 scale
  const colorScale = d3
    .scaleQuantize<string>()
    .domain([0, 1])
    .range([
      "#eef7ff",
      "#d8ecff",
      "#baddff",
      "#8bcaff",
      "#54abff",
      "#2d88ff",
      "#1666fa",
      "#0f50e6",
      "#1444c2",
      "#163b92",
      "#122659",
    ]);

  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (xAxisRef.current) {
      d3.select(xAxisRef.current)
        .call(
          d3
            .axisBottom(xScale)
            .ticks(6)
            .tickSize(0)
            .tickFormat((d) => d3.timeFormat("%b %-d")(d as Date))
        )
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g.selectAll(".tick text").attr("dy", "1em").style("font-size", "12px")
        );
    }
  }, [xScale]);

  useEffect(() => {
    if (yAxisRef.current) {
      d3.select(yAxisRef.current)
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(0)
            .tickValues(
              yScale
                .domain()
                .filter(
                  (_, i) => i % Math.ceil(yScale.domain().length / 8) === 0
                )
            )
            .tickFormat((d) => {
              const num = parseFloat(d as string);
              return new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(num);
            })
        )
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick text").style("font-size", "12px"));
    }
  }, [yScale]);

  const rectWidth =
    containerWidth > 0
      ? (containerWidth - margin.left - margin.right) / data.length
      : 0;
  const rectHeight = yScale.bandwidth();

  const normalizedData = data.map((d) => {
    const sum = d.values.reduce((acc, value) => acc + value, 0);
    return d.values.map((value) => value / sum);
  });
  const maxValue = Math.max(...normalizedData.flat());
  const scaledData = normalizedData.map((d) =>
    d.map((value) => value / maxValue)
  );

  return (
    <svg
      ref={containerRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${containerWidth} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g ref={xAxisRef} transform={`translate(0,${height - margin.bottom})`} />
      <g ref={yAxisRef} transform={`translate(${margin.left},0)`} />

      {/* 히트맵 셀 */}
      {data.map((d, i) => {
        const date = new Date(d.date);
        const values = scaledData[i];
        return values.map((value, j) => (
          <rect
            key={`${i}-${j}`}
            x={xScale(date)}
            y={yScale(priceBins[j].toString())}
            width={rectWidth}
            height={rectHeight}
            fill={colorScale(value)}
          />
        ));
      })}
    </svg>
  );
}
