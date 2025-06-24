"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const StatsDisplay = ({ stats }) => {
  if (!stats) return null

  const isCompress = stats.mode === "compress"

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const chartData = [
    {
      name: isCompress ? "Original" : "Compressed",
      size: stats.inputSize,
      color: "#64748b",
    },
    {
      name: isCompress ? "Compressed" : "Decompressed",
      size: stats.outputSize,
      color: "#3b82f6",
    },
  ]

  const pieData = [
    {
      name: isCompress ? "Compressed" : "Decompressed",
      value: stats.outputSize,
      color: "#3b82f6",
    },
    {
      name: "Space Saved",
      value: Math.max(0, stats.inputSize - stats.outputSize),
      color: "#10b981",
    },
  ]

  const spaceSaved = stats.inputSize - stats.outputSize
  const spaceSavedPercentage = ((spaceSaved / stats.inputSize) * 100).toFixed(1)
  const isSpaceSaved = spaceSaved > 0

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-gray-100">{isCompress ? "Compression" : "Decompression"} Results</h2>
        <p className="text-gray-300">
          Detailed analysis of your file processing including size metrics, efficiency ratios, and performance data
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Input Size */}
        <div className="bg-gray-800 border border-gray-700 p-4">
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase">
              {isCompress ? "Original" : "Compressed"}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-gray-100">{formatSize(stats.inputSize)}</p>
            <p className="text-sm text-gray-300">Input file size</p>
          </div>
        </div>

        {/* Output Size */}
        <div className="bg-gray-800 border border-gray-700 p-4">
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase">
              {isCompress ? "Compressed" : "Decompressed"}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-blue-400">{formatSize(stats.outputSize)}</p>
            <p className="text-sm text-gray-300">Output file size</p>
          </div>
        </div>

        {/* Compression Ratio */}
        <div className="bg-gray-800 border border-gray-700 p-4">
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase">Ratio</span>
          </div>
          <div className="space-y-1">
            <p className={`text-xl font-bold ${isSpaceSaved ? "text-green-400" : "text-red-400"}`}>
              {stats.compressionRatio}:1
            </p>
            <p className="text-sm text-gray-300">Compression ratio</p>
          </div>
        </div>

        {/* Processing Time */}
        <div className="bg-gray-800 border border-gray-700 p-4">
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase">Time</span>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-gray-100">{stats.timeTaken}ms</p>
            <p className="text-sm text-gray-300">Processing time</p>
          </div>
        </div>
      </div>

      {/* Efficiency Summary */}
      <div className="bg-gray-800 border border-gray-700 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-100">Efficiency Summary</h3>
          <p className="text-sm text-gray-300">Space optimization and algorithm performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-700 border border-gray-600">
            <p className="text-sm text-gray-300 mb-1">Space Change</p>
            <p className={`text-lg font-bold ${isSpaceSaved ? "text-green-400" : "text-red-400"}`}>
              {isSpaceSaved ? "-" : "+"}
              {formatSize(Math.abs(spaceSaved))}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-700 border border-gray-600">
            <p className="text-sm text-gray-300 mb-1">Percentage Change</p>
            <p className={`text-lg font-bold ${isSpaceSaved ? "text-green-400" : "text-red-400"}`}>
              {isSpaceSaved ? "-" : "+"}
              {Math.abs(Number.parseFloat(spaceSavedPercentage))}%
            </p>
          </div>
          <div className="text-center p-3 bg-gray-700 border border-gray-600">
            <p className="text-sm text-gray-300 mb-1">Algorithm Used</p>
            <p className="text-sm font-medium text-gray-100">{stats.algorithm}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-800 border border-gray-700 p-4">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Size Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip
                formatter={(value) => [formatSize(value), "Size"]}
                labelFormatter={(label) => `${label} File`}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  color: "#f3f4f6",
                }}
              />
              <Bar dataKey="size" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 border border-gray-700 p-4">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Space Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatSize(value), "Size"]}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  color: "#f3f4f6",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsDisplay
