"use client"

const algorithmDetails = {
  huffman: {
    title: "Huffman Coding",
    overview:
      "Huffman coding is a lossless data compression algorithm that uses variable-length prefix codes based on the frequency of characters in the input.",
    howItWorks: [
      "Count the frequency of each character in the input",
      "Build a binary tree with characters as leaves, ordered by frequency",
      "Assign shorter codes to more frequent characters",
      "Replace each character with its corresponding code",
    ],
    advantages: [
      "Optimal for known character frequencies",
      "No information loss (lossless)",
      "Works well with text and structured data",
    ],
    disadvantages: [
      "Requires two passes through the data",
      "Overhead of storing the frequency table",
      "Not effective for random or already compressed data",
    ],
    complexity: "Time: O(n log n), Space: O(n)",
  },
  rle: {
    title: "Run-Length Encoding (RLE)",
    overview:
      "RLE is a simple form of lossless data compression that replaces sequences of identical characters with a count followed by the character.",
    howItWorks: [
      "Scan the input data sequentially",
      "Count consecutive identical characters",
      "Replace runs with count + character pairs",
      "Single characters are represented as count of 1",
    ],
    advantages: [
      "Very simple to implement",
      "Fast compression and decompression",
      "Excellent for data with many repeated values",
      "Works well with simple graphics and images",
    ],
    disadvantages: [
      "Can increase size if data has few repetitions",
      "Not suitable for random data",
      "Limited compression ratio for complex data",
    ],
    complexity: "Time: O(n), Space: O(1)",
  },
  lz77: {
    title: "LZ77 (Lempel-Ziv 1977)",
    overview:
      "LZ77 is a dictionary-based compression algorithm that uses a sliding window to find repeated sequences and replace them with references.",
    howItWorks: [
      "Maintain a sliding window of recent data",
      "Search for the longest match in the window",
      "Replace matches with (distance, length, next character) tuples",
      "Move the window forward and repeat",
    ],
    advantages: [
      "Good general-purpose compression",
      "Adapts to data patterns automatically",
      "Forms basis for many modern algorithms (deflate, gzip)",
      "Works well with various data types",
    ],
    disadvantages: [
      "More complex than simpler algorithms",
      "Compression ratio depends on window size",
      "Slower than RLE for simple patterns",
    ],
    complexity: "Time: O(n²) naive, O(n log n) optimized, Space: O(window size)",
  },
}

const AlgorithmDescription = ({ algorithm, onClose }) => {
  if (!algorithm) return null

  const details = algorithmDetails[algorithm]

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#2a2a2a",
          border: "4px solid #666",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "80vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#444",
            borderBottom: "3px solid #666",
            padding: "15px",
          }}
        >
          <table style={{ width: "100%" }}>
            <tr>
              <td>
                <h2 style={{ margin: 0, color: "#fff", fontSize: "20px" }}>{details.title}</h2>
              </td>
              <td style={{ textAlign: "right" }}>
                <button
                  onClick={onClose}
                  style={{
                    backgroundColor: "#5a2d2d",
                    color: "white",
                    border: "2px solid #FF4444",
                    padding: "5px 15px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          </table>
        </div>

        {/* Content */}
        <div
          style={{
            overflowY: "auto",
            maxHeight: "calc(80vh - 80px)",
            padding: "20px",
          }}
        >
          {/* Overview */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                color: "#fff",
                fontSize: "16px",
                borderBottom: "2px solid #666",
                paddingBottom: "5px",
                margin: "0 0 10px 0",
              }}
            >
              Overview
            </h3>
            <p style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.4" }}>{details.overview}</p>
          </div>

          {/* How it works */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                color: "#fff",
                fontSize: "16px",
                borderBottom: "2px solid #666",
                paddingBottom: "5px",
                margin: "0 0 15px 0",
              }}
            >
              How It Works
            </h3>
            <div>
              {details.howItWorks.map((step, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "25px",
                      height: "25px",
                      backgroundColor: "#444",
                      border: "2px solid #666",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginRight: "10px",
                      flexShrink: 0,
                      color: "#fff",
                    }}
                  >
                    {index + 1}
                  </div>
                  <p style={{ color: "#ccc", fontSize: "14px", margin: 0, lineHeight: "1.4" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Advantages and Disadvantages */}
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <tr>
              <td style={{ width: "50%", verticalAlign: "top", paddingRight: "10px" }}>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    borderBottom: "2px solid #666",
                    paddingBottom: "5px",
                    margin: "0 0 15px 0",
                  }}
                >
                  Advantages
                </h3>
                <div>
                  {details.advantages.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        backgroundColor: "#2d5a2d",
                        border: "2px solid #4CAF50",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ color: "#fff", fontSize: "13px" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </td>

              <td style={{ width: "50%", verticalAlign: "top", paddingLeft: "10px" }}>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    borderBottom: "2px solid #666",
                    paddingBottom: "5px",
                    margin: "0 0 15px 0",
                  }}
                >
                  Disadvantages
                </h3>
                <div>
                  {details.disadvantages.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        backgroundColor: "#5a2d2d",
                        border: "2px solid #FF4444",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ color: "#fff", fontSize: "13px" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </table>

          {/* Complexity */}
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: "16px",
                borderBottom: "2px solid #666",
                paddingBottom: "5px",
                margin: "0 0 15px 0",
              }}
            >
              Time & Space Complexity
            </h3>
            <div
              style={{
                backgroundColor: "#333",
                border: "2px solid #666",
                padding: "15px",
              }}
            >
              <code
                style={{
                  color: "#fff",
                  fontFamily: "Courier New, monospace",
                  fontSize: "14px",
                  backgroundColor: "#1a1a1a",
                  padding: "5px",
                  border: "1px solid #666",
                }}
              >
                {details.complexity}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlgorithmDescription
