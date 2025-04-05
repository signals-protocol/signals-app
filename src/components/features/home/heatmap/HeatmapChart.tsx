import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatEther } from "ethers";

export interface HeatmapDatum {
  date: Date | string;
  values: bigint[];
}

export type HeatmapChartProps = {
  data: HeatmapDatum[];
  priceBins: number[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  onBinClick: (marketId: number, binId: number) => void;
};

export default function HeatmapChart({
  data,
  priceBins,
  margin = { top: 20, right: 20, bottom: 40, left: 60 },
  onBinClick,
}: HeatmapChartProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredBin, setHoveredBin] = useState<{
    i: number;
    j: number;
    date: Date;
    price: string;
    tickets: number;
    perc: number;
  } | null>(null);

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

  // 세로 셀 간의 간격만 추가
  const cellPadding = 1; // 세로 셀 간의 간격 (픽셀)
  const rectWidth =
    containerWidth > 0
      ? (containerWidth - margin.left - margin.right) / data.length
      : 0;
  const rectHeight = yScale.bandwidth() - cellPadding;

  const normalizedData = data.map((d) => {
    const sum = d.values.reduce((acc, value) => acc + +formatEther(value), 0);
    return sum > 0
      ? d.values.map((value) => +formatEther(value) / sum)
      : d.values.map(() => 0);
  });
  const maxValue = Math.max(...normalizedData.flat());
  const scaledData = normalizedData.map((d) =>
    d.map((value) => (maxValue > 0 ? value / maxValue : 0))
  );

  return (
    <div className="relative flex-1">
      <svg
        ref={containerRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${containerWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          ref={xAxisRef}
          transform={`translate(0,${height - margin.bottom})`}
        />
        <g ref={yAxisRef} transform={`translate(${margin.left},0)`} />

        {/* 히트맵 셀 */}
        {data.map((d, i) => {
          const date = new Date(d.date);
          const scaledValues = scaledData[i];
          const ticketSum = d.values.reduce(
            (acc, value) => acc + +formatEther(value),
            0
          );
          return scaledValues.map((value, j) => (
            <rect
              key={`${i}-${j}`}
              onClick={() => onBinClick(i, j)}
              x={xScale(date)}
              y={yScale(priceBins[j].toString())! + cellPadding / 2}
              width={rectWidth}
              height={rectHeight}
              // fill={colorScale(value)}
              className={`group ${colorScale(value)}`}
              onMouseEnter={() => {
                setHoveredBin({
                  i,
                  j,
                  date,
                  price: priceBins[j].toString(),
                  tickets: +formatEther(d.values[j]),
                  perc: +formatEther(d.values[j]) / ticketSum,
                });
              }}
            />
          ));
        })}
      </svg>
      {hoveredBin && (
        <div
          style={{
            position: "absolute",
            left: xScale(hoveredBin.date) + rectWidth / 2,
            top: yScale(hoveredBin.price)! - 10,
            backgroundColor: "rgba(238, 44, 44, 0.8)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
            zIndex: 10,
          }}
        >
          <div>날짜: {hoveredBin.date.toLocaleDateString()}</div>
          <div>가격: {hoveredBin.price}</div>
          <div>티켓 수: {hoveredBin.tickets}</div>
        </div>
      )}
    </div>
  );
}

function colorScale(value: number) {
  if (value < 0.001) return "fill-[#fafafa]";
  if (value < 0.005) return "fill-primary-50";
  if (value < 0.01) return "fill-primary-100";
  if (value < 0.04) return "fill-primary-200";
  if (value < 0.1) return "fill-primary-300";
  if (value < 0.2) return "fill-primary-400";
  if (value < 0.4) return "fill-primary-500";
  if (value < 0.6) return "fill-primary-600";
  if (value < 0.8) return "fill-primary-700";
  if (value < 0.9) return "fill-primary-800";
  return "fill-primary-950";
}
