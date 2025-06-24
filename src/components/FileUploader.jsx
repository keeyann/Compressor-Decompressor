"use client"
import { useCallback, useState } from "react"

const FileUploader = ({ onFileUpload, uploadedFile, onClearFile }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        onFileUpload(files[0])
      }
    },
    [onFileUpload],
  )

  const handleFileSelect = useCallback(
    (e) => {
      const files = e.target.files
      if (files && files.length > 0) {
        onFileUpload(files[0])
      }
    },
    [onFileUpload],
  )

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div>
      {!uploadedFile ? (
        <div>
          {/* Upload Area */}
          <div
            style={{
              border: isDragOver ? "3px dashed #FF4444" : "3px dashed #666",
              backgroundColor: isDragOver ? "#5a5a2d" : "#333",
              padding: "40px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "15px",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#444",
                border: "2px solid #666",
                margin: "0 auto 15px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              ↑
            </div>

            <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "18px" }}>
              {isDragOver ? "Drop your file here" : "Drag & drop your file here"}
            </h3>
            <p style={{ margin: "0 0 15px 0", color: "#ccc" }}>or click to browse from your computer</p>

            <p style={{ margin: 0, color: "#ccc", fontSize: "14px" }}>Supports all file types • Maximum 10MB</p>

            <input id="file-input" type="file" style={{ display: "none" }} onChange={handleFileSelect} />
          </div>

          {/* Supported Formats */}
          <div style={{ backgroundColor: "#444", border: "2px solid #666", padding: "10px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "14px" }}>Supported File Types</h4>
            <table style={{ width: "100%" }}>
              <tr>
                <td style={{ color: "#ccc", fontSize: "12px", padding: "2px" }}>Documents</td>
                <td style={{ color: "#ccc", fontSize: "12px", padding: "2px" }}>Images</td>
                <td style={{ color: "#ccc", fontSize: "12px", padding: "2px" }}>Videos</td>
                <td style={{ color: "#ccc", fontSize: "12px", padding: "2px" }}>Audio</td>
                <td style={{ color: "#ccc", fontSize: "12px", padding: "2px" }}>Archives</td>
              </tr>
            </table>
          </div>
        </div>
      ) : (
        <div>
          {/* File Details Card */}
          <div style={{ backgroundColor: "#2a2a2a", border: "2px solid #444" }}>
            {/* File Header */}
            <div style={{ backgroundColor: "#333", borderBottom: "2px solid #444", padding: "10px" }}>
              <table style={{ width: "100%" }}>
                <tr>
                  <td>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#2d5a2d",
                        border: "1px solid #4CAF50",
                        display: "inline-block",
                        textAlign: "center",
                        lineHeight: "30px",
                        marginRight: "10px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      F
                    </div>
                    <strong style={{ color: "#fff" }}>File Details</strong>
                    <br />
                    <small style={{ color: "#ccc" }}>Ready for compression or decompression</small>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={onClearFile}
                      style={{
                        backgroundColor: "#5a2d2d",
                        color: "white",
                        border: "2px solid #FF4444",
                        padding: "5px 10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      X
                    </button>
                  </td>
                </tr>
              </table>
            </div>

            {/* File Information */}
            <div style={{ padding: "15px" }}>
              <table style={{ width: "100%" }}>
                <tr>
                  <td style={{ width: "80px", verticalAlign: "top" }}>
                    <div
                      style={{
                        backgroundColor: "#333",
                        border: "1px solid #666",
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    >
                      FILE
                    </div>
                  </td>
                  <td style={{ paddingLeft: "15px" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#fff" }}>{uploadedFile.name}</h4>
                    <table style={{ width: "100%", fontSize: "14px" }}>
                      <tr>
                        <td style={{ padding: "2px 0", color: "#ccc" }}>
                          <strong>Size:</strong> {formatFileSize(uploadedFile.size)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "2px 0", color: "#ccc" }}>
                          <strong>Type:</strong> {uploadedFile.type || "Unknown"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "2px 0", color: "#ccc" }}>
                          <strong>Last Modified:</strong> {new Date(uploadedFile.lastModified).toLocaleDateString()}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>

            {/* Actions */}
            <div style={{ backgroundColor: "#333", borderTop: "2px solid #444", padding: "10px" }}>
              <table style={{ width: "100%" }}>
                <tr>
                  <td>
                    <small style={{ color: "#ccc" }}>File uploaded and ready for processing</small>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={onClearFile}
                      style={{
                        backgroundColor: "#2a2a2a",
                        border: "2px solid #666",
                        padding: "5px 10px",
                        cursor: "pointer",
                        color: "#fff",
                      }}
                    >
                      <strong>X</strong> Remove File
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader
