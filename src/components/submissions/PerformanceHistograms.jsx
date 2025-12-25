import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useDispatch } from "react-redux";
import {
  setData,
  setLoading,
} from "../../slices/submissions/timememoryqueryforcode";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { value } = payload[0];
    return (
      <div
        style={{
          background: "rgba(30, 30, 30, 0.95)",
          color: "#fff",
          padding: "8px 10px",
          borderRadius: "8px",
          fontSize: "13px",
          lineHeight: "1.4em",
          border: "1px solid #333",
        }}
      >
        <p style={{ margin: 0 }}>{`Range: ${label}`}</p>
        <p style={{ margin: 0 }}>{`Submissions: ${value.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const HistogramChart = ({ title, data, color, unit }) => {
  const [selectedBar, setSelectedBar] = useState(null);

  const dispatch = useDispatch();

  if (!data || !data.type || data.total_submissions === 0) {
    return (
      <div
        style={{
          background: "#121212",
          padding: "1rem",
          borderRadius: "12px",
          color: "#ccc",
          textAlign: "center",
        }}
      >
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  // flat histogram (single value)
  if (data.type === "flat") {
    return (
      <div
        style={{
          background: "#121212",
          padding: "1rem",
          borderRadius: "12px",
          color: "#ccc",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>{title}</h3>
        <p>
          All accepted solutions used{" "}
          <b>
            {data.bin_data[0][Object.keys(data.bin_data[0])[0]]} {unit}
          </b>
          .
        </p>
        <button
          onClick={() =>
            alert(
              `Exact ${title}: ${
                data.bin_data[0][Object.keys(data.bin_data[0])[0]]
              } ${unit}`
            )
          }
          style={{
            background: "#22c55e",
            color: "#000",
            padding: "6px 12px",
            borderRadius: "6px",
            marginTop: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Show Details
        </button>
      </div>
    );
  }

  const binData = data.bin_data.filter((b) => b.percentage > 0);

  const handleBarClick = (dataPoint) => {
    setSelectedBar(dataPoint);
    let range = dataPoint.range;
    let query = "";
    if (range.search("ms") == -1) {
      query = "memory";
      range = range.replace("MB", "");
      console.log(range, query, "performance");
    } else {
      query = "runtime";
      range = range.replace("ms", "");
      console.log(range, query, "performance");
    }
    if (dataPoint.percentage > 0) {
      dispatch(setLoading(true));
      dispatch(setData({ range, query }));
    }
  };

  return (
    <div
      style={{
        background: "#121212",
        padding: "1rem",
        borderRadius: "12px",
        color: "#ccc",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{title}</h3>

      <ResponsiveContainer width="100%" height={300} className="outline-none">
        <BarChart
          data={binData}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="range"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={60}
            stroke="#ccc"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#ccc"
            label={{
              value: "Percentage (%)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#ccc" },
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Bar
            dataKey="percentage"
            fill={color}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
            cursor="pointer" // ✅ show pointer
            onClick={handleBarClick} // ✅ click handler
          />
        </BarChart>
      </ResponsiveContainer>

      {selectedBar && (
        <div
          style={{
            marginTop: "10px",
            textAlign: "center",
            background: "#1f1f1f",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          <p>
            🟩 Selected Range: <b>{selectedBar.range}</b>
          </p>
          <p>
            📈 Percentage: <b>{selectedBar.percentage.toFixed(2)}%</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default function PerformanceHistograms({
  histogramData,
  selectedGraph,
}) {
  const runtimeData = histogramData?.runtime;
  const memoryData = histogramData?.memory;

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100%",
        padding: "1rem",
        borderRadius: "12px",
      }}
    >
      {selectedGraph === "Runtime" ? (
        <HistogramChart
          title="Runtime Distribution (ms)"
          data={runtimeData}
          color="#4ade80"
          unit="ms"
        />
      ) : (
        <HistogramChart
          title="Memory Usage Distribution (MB)"
          data={memoryData}
          color="#60a5fa"
          unit="MB"
        />
      )}
    </div>
  );
}
