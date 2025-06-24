"use client"

const algorithms = [
  {
    id: "huffman",
    name: "Huffman Coding",
    description: "Variable-length prefix coding based on character frequency",
    bestFor: "Text files, structured data",
    stats: { efficiency: "High", speed: "Medium" },
  },
  {
    id: "rle",
    name: "Run-Length Encoding",
    description: "Replaces consecutive identical characters with count + character",
    bestFor: "Images with large uniform areas, simple graphics",
    stats: { efficiency: "Medium", speed: "High" },
  },
  {
    id: "lz77",
    name: "LZ77",
    description: "Dictionary-based compression using sliding window",
    bestFor: "General purpose, mixed content types",
    stats: { efficiency: "High", speed: "Medium" },
  },
]

const AlgorithmSelector = ({ selectedAlgorithm, onAlgorithmChange, onShowDescription }) => {
  return (
    <div>
      <h3 style={{ margin: "0 0 15px 0", color: "#fff", fontSize: "16px" }}>Choose Your Compression Algorithm</h3>
      <p style={{ margin: "0 0 20px 0", color: "#ccc", fontSize: "14px" }}>
        Select the most suitable compression algorithm for your data type and requirements
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        {algorithms.map((algorithm) => {
          const isSelected = selectedAlgorithm === algorithm.id

          return (
            <tr key={algorithm.id}>
              <td style={{ padding: "10px 0" }}>
                <div
                  onClick={() => onAlgorithmChange(algorithm.id)}
                  style={{
                    backgroundColor: isSelected ? "#5a5a2d" : "#333",
                    border: isSelected ? "3px solid #FFFF44" : "2px solid #666",
                    padding: "15px",
                    cursor: "pointer",
                  }}
                >
                  {isSelected && (
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#4CAF50" }}>✓ SELECTED</strong>
                    </div>
                  )}

                  <h4 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "16px" }}>{algorithm.name}</h4>

                  <p style={{ margin: "0 0 10px 0", color: "#ccc", fontSize: "13px" }}>{algorithm.description}</p>

                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ fontSize: "12px", color: "#fff" }}>BEST FOR:</strong>
                    <br />
                    <span style={{ fontSize: "12px", color: "#ccc" }}>{algorithm.bestFor}</span>
                  </div>

                  <table style={{ width: "100%", borderTop: "1px solid #666", paddingTop: "10px" }}>
                    <tr>
                      <td style={{ textAlign: "center", padding: "5px" }}>
                        <div style={{ fontSize: "11px", color: "#ccc" }}>Efficiency</div>
                        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#fff" }}>
                          {algorithm.stats.efficiency}
                        </div>
                      </td>
                      <td style={{ textAlign: "center", padding: "5px" }}>
                        <div style={{ fontSize: "11px", color: "#ccc" }}>Speed</div>
                        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#fff" }}>
                          {algorithm.stats.speed}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onShowDescription(algorithm.id)
                      }}
                      style={{
                        backgroundColor: "#2d4a5a",
                        color: "#fff",
                        border: "2px solid #2196F3",
                        padding: "5px 15px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      LEARN MORE
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )
        })}
      </table>

      <p style={{ margin: "15px 0 0 0", color: "#ccc", fontSize: "12px", textAlign: "center" }}>
        Click on any algorithm card to select it
      </p>
    </div>
  )
}

export default AlgorithmSelector
