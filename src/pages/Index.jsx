"use client"
import { useState } from "react"
import FileUploader from "../components/FileUploader"
import AlgorithmSelector from "../components/AlgorithmSelector"
import StatsDisplay from "../components/StatsDisplay"
import FileDownloader from "../components/FileDownloader"
import AlgorithmDescription from "../components/AlgorithmDescription"
import * as huffman from "../utils/huffman"
import * as rle from "../utils/rle"
import * as lz77 from "../utils/lz77"

const algorithms = { huffman, rle, lz77 }

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("huffman")
  const [stats, setStats] = useState(null)
  const [processedData, setProcessedData] = useState(null)
  const [isCompressed, setIsCompressed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDescription, setShowDescription] = useState(null)
  const [notification, setNotification] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleFileUpload = (file) => {
    setUploadedFile(file)
    setStats(null)
    setProcessedData(null)
    setCurrentStep(1)
    showNotification("File uploaded successfully!")
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    setStats(null)
    setProcessedData(null)
    setCurrentStep(0)
    showNotification("File cleared")
  }

  const validateFile = (file, isDecompression = false) => {
    // File size validation
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    }

    // Check if file is empty
    if (file.size === 0) {
      throw new Error("Cannot process empty files.")
    }

    // Get file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))
    const fileMimeType = file.type.toLowerCase()

    // If decompressing, allow compression algorithm extensions
    if (isDecompression) {
      const compressionExtensions = [".huffman", ".rle", ".lz77"]
      if (compressionExtensions.includes(fileExtension)) {
        return { isValid: true, category: "compressed" }
      }
    }

    // Define allowed file types (rest of the existing code stays the same)
    const allowedTypes = {
      text: {
        extensions: [
          ".txt",
          ".csv",
          ".json",
          ".xml",
          ".html",
          ".htm",
          ".css",
          ".js",
          ".ts",
          ".jsx",
          ".tsx",
          ".md",
          ".log",
          ".sql",
          ".py",
          ".java",
          ".cpp",
          ".c",
          ".h",
          ".php",
          ".rb",
          ".go",
          ".rs",
          ".swift",
          ".kt",
          ".scala",
          ".sh",
          ".bat",
          ".ps1",
          ".yaml",
          ".yml",
          ".toml",
          ".ini",
          ".cfg",
          ".conf",
        ],
        mimeTypes: ["text/", "application/json", "application/xml", "application/javascript", "application/typescript"],
      },
      image: {
        extensions: [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".bmp",
          ".webp",
          ".svg",
          ".tiff",
          ".tif",
          ".ico",
          ".heic",
          ".heif",
          ".raw",
          ".cr2",
          ".nef",
          ".arw",
          ".dng",
        ],
        mimeTypes: ["image/"],
      },
      video: {
        extensions: [
          ".mp4",
          ".avi",
          ".mov",
          ".wmv",
          ".flv",
          ".webm",
          ".mkv",
          ".m4v",
          ".3gp",
          ".ogv",
          ".mpg",
          ".mpeg",
          ".m2v",
          ".asf",
          ".rm",
          ".rmvb",
          ".vob",
          ".ts",
          ".mts",
          ".m2ts",
        ],
        mimeTypes: ["video/"],
      },
      binary: {
        extensions: [
          ".bin",
          ".dat",
          ".exe",
          ".dll",
          ".so",
          ".dylib",
          ".app",
          ".deb",
          ".rpm",
          ".msi",
          ".dmg",
          ".iso",
          ".img",
          ".tar",
          ".gz",
          ".zip",
          ".rar",
          ".7z",
          ".bz2",
          ".xz",
          ".lz4",
          ".zst",
          ".cab",
          ".arj",
          ".ace",
          ".lha",
          ".lzh",
          ".sit",
          ".sitx",
          ".sea",
          ".hqx",
          ".cpt",
          ".pit",
          ".pf",
          ".db",
          ".sqlite",
          ".mdb",
          ".accdb",
          ".dbf",
        ],
        mimeTypes: [
          "application/octet-stream",
          "application/x-binary",
          "application/x-executable",
          "application/x-msdownload",
          "application/x-msdos-program",
          "application/zip",
          "application/x-rar-compressed",
          "application/x-7z-compressed",
          "application/x-tar",
          "application/gzip",
          "application/x-bzip2",
        ],
      },
    }

    // Check if file type is allowed
    let isAllowed = false
    let fileCategory = ""

    for (const [category, typeInfo] of Object.entries(allowedTypes)) {
      // Check by extension
      if (typeInfo.extensions.includes(fileExtension)) {
        isAllowed = true
        fileCategory = category
        break
      }

      // Check by MIME type
      if (fileMimeType && typeInfo.mimeTypes.some((mimeType) => fileMimeType.startsWith(mimeType))) {
        isAllowed = true
        fileCategory = category
        break
      }
    }

    if (!isAllowed) {
      throw new Error(
        `File type '${fileExtension || "unknown"}' is not supported. Only text, image, video, and binary files are allowed.\n\n` +
          `Supported formats:\n` +
          `• Text: .txt, .csv, .json, .html, .js, .py, etc.\n` +
          `• Image: .jpg, .png, .gif, .bmp, .webp, .svg, etc.\n` +
          `• Video: .mp4, .avi, .mov, .wmv, .webm, .mkv, etc.\n` +
          `• Binary: .bin, .exe, .zip, .tar, .gz, .db, etc.\n` +
          `• Compressed: .huffman, .rle, .lz77 (for decompression)`,
      )
    }

    // Additional validation for specific categories
    if (fileCategory === "video" && file.size > 8 * 1024 * 1024) {
      // 8MB limit for videos
      throw new Error("Video files are limited to 8MB due to processing constraints.")
    }

    return { isValid: true, category: fileCategory }
  }

  const processFile = async (compress) => {
    if (!uploadedFile) {
      showNotification("Please upload a file first.", "error")
      return
    }

    try {
      // Add file validation with decompression flag
      const validation = validateFile(uploadedFile, !compress)
      console.log(`Processing ${validation.category} file: ${uploadedFile.name}`)

      setIsProcessing(true)
      setCurrentStep(2)
      const startTime = Date.now()

      const arrayBuffer = await uploadedFile.arrayBuffer()
      const inputData = new Uint8Array(arrayBuffer)

      // Additional validation for array buffer
      if (!inputData || inputData.length === 0) {
        throw new Error("File appears to be corrupted or unreadable.")
      }

      let result
      if (compress) {
        result = algorithms[selectedAlgorithm].compress(inputData)
      } else {
        result = algorithms[selectedAlgorithm].decompress(inputData)
      }

      // Validate result
      if (!result || result.length === 0) {
        throw new Error(
          `${compress ? "Compression" : "Decompression"} produced no output. The file may be incompatible with the selected algorithm.`,
        )
      }

      const timeTaken = Date.now() - startTime
      const inputSize = inputData.length
      const outputSize = result.length

      setStats({
        inputSize,
        outputSize,
        compressionRatio: Number.parseFloat(
          compress ? (inputSize / outputSize).toFixed(2) : (outputSize / inputSize).toFixed(2),
        ),
        timeTaken,
        algorithm: selectedAlgorithm.toUpperCase(),
        mode: compress ? "compress" : "decompress",
      })

      setProcessedData(result)
      setIsCompressed(compress)
      setCurrentStep(3)
      showNotification(`${compress ? "Compression" : "Decompression"} completed in ${timeTaken}ms!`)
    } catch (error) {
      console.error(error)

      // More specific error messages
      let errorMessage = error.message || "Unknown error occurred"

      if (error.message.includes("size exceeds")) {
        errorMessage = error.message
      } else if (error.message.includes("not supported")) {
        errorMessage = error.message
      } else if (error.message.includes("Video files are limited")) {
        errorMessage = error.message
      } else if (error.message.includes("incompatible")) {
        errorMessage = `This file may not be compatible with ${selectedAlgorithm.toUpperCase()}. Try a different algorithm.`
      } else if (error.message.includes("empty files")) {
        errorMessage = "Cannot process empty files. Please select a file with content."
      }

      showNotification(`Processing failed: ${errorMessage}`, "error")
      setCurrentStep(1)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetWorkflow = () => {
    setUploadedFile(null)
    setStats(null)
    setProcessedData(null)
    setCurrentStep(0)
    setSelectedAlgorithm("huffman")
    showNotification("Workflow reset")
  }

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#000", color: "white", padding: "20px", borderBottom: "3px solid #333" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>Compressor Pro</h1>
        <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Advanced File Compression</p>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{ padding: "20px" }}>
          <div
            style={{
              padding: "10px",
              border: "2px solid",
              backgroundColor: notification.type === "success" ? "#2d5a2d" : "#5a2d2d",
              borderColor: notification.type === "success" ? "#4CAF50" : "#FF4444",
              color: "#fff",
            }}
          >
            {notification.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ padding: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tr>
            <td style={{ width: "70%", verticalAlign: "top", paddingRight: "20px" }}>
              {/* File Upload */}
              <div
                style={{ backgroundColor: "#2a2a2a", border: "2px solid #444", padding: "15px", marginBottom: "20px" }}
              >
                <h2 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "18px" }}>File Upload</h2>
                <p style={{ margin: "0 0 15px 0", color: "#ccc" }}>
                  Choose a text, image, video, or binary file to compress or decompress
                </p>
                <FileUploader
                  onFileUpload={handleFileUpload}
                  uploadedFile={uploadedFile}
                  onClearFile={handleClearFile}
                />
              </div>

              {/* Algorithm Selection */}
              {uploadedFile && (
                <div
                  style={{
                    backgroundColor: "#2a2a2a",
                    border: "2px solid #444",
                    padding: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <h2 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "18px" }}>Algorithm Selection</h2>
                  <p style={{ margin: "0 0 15px 0", color: "#ccc" }}>Choose the compression algorithm for your file</p>
                  <AlgorithmSelector
                    selectedAlgorithm={selectedAlgorithm}
                    onAlgorithmChange={setSelectedAlgorithm}
                    onShowDescription={setShowDescription}
                  />
                </div>
              )}

              {/* Processing Controls */}
              {uploadedFile && (
                <div
                  style={{
                    backgroundColor: "#2a2a2a",
                    border: "2px solid #444",
                    padding: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <h2 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "18px" }}>File Processing</h2>
                  <p style={{ margin: "0 0 15px 0", color: "#ccc" }}>
                    Compress or decompress your file using the selected algorithm
                  </p>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <td style={{ width: "50%", paddingRight: "10px" }}>
                        <button
                          onClick={() => processFile(true)}
                          disabled={isProcessing}
                          style={{
                            width: "100%",
                            padding: "15px",
                            backgroundColor: "#2d5a2d",
                            color: "white",
                            border: "2px solid #4CAF50",
                            fontSize: "16px",
                            cursor: isProcessing ? "not-allowed" : "pointer",
                            opacity: isProcessing ? 0.5 : 1,
                          }}
                        >
                          {isProcessing ? "Compressing..." : "Compress File"}
                        </button>
                      </td>
                      <td style={{ width: "50%", paddingLeft: "10px" }}>
                        <button
                          onClick={() => processFile(false)}
                          disabled={isProcessing}
                          style={{
                            width: "100%",
                            padding: "15px",
                            backgroundColor: "#2d4a5a",
                            color: "white",
                            border: "2px solid #2196F3",
                            fontSize: "16px",
                            cursor: isProcessing ? "not-allowed" : "pointer",
                            opacity: isProcessing ? 0.5 : 1,
                          }}
                        >
                          {isProcessing ? "Decompressing..." : "Decompress File"}
                        </button>
                      </td>
                    </tr>
                  </table>
                </div>
              )}
            </td>

            <td style={{ width: "30%", verticalAlign: "top" }}>
              {/* Current Algorithm */}
              {selectedAlgorithm && (
                <div
                  style={{
                    backgroundColor: "#2a2a2a",
                    border: "2px solid #444",
                    padding: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "16px" }}>Current Algorithm</h3>
                  <p style={{ margin: "0 0 5px 0", color: "#fff", fontWeight: "bold" }}>
                    {selectedAlgorithm.toUpperCase()} Compression
                  </p>
                  <p style={{ margin: 0, color: "#ccc", fontSize: "12px" }}>
                    {selectedAlgorithm === "huffman" && "Variable-length prefix coding"}
                    {selectedAlgorithm === "rle" && "Run-length encoding"}
                    {selectedAlgorithm === "lz77" && "Dictionary-based compression"}
                  </p>
                </div>
              )}

              {/* Processing Status */}
              {isProcessing && (
                <div
                  style={{
                    backgroundColor: "#5a5a2d",
                    border: "2px solid #FFFF44",
                    padding: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "16px" }}>Processing</h3>
                  <p style={{ margin: 0, color: "#fff", fontSize: "14px" }}>
                    Your file is being {isCompressed ? "compressed" : "decompressed"} using{" "}
                    {selectedAlgorithm.toUpperCase()}...
                  </p>
                </div>
              )}
            </td>
          </tr>
        </table>

        {/* Statistics - Full Width */}
        {stats && (
          <div style={{ marginTop: "20px" }}>
            <StatsDisplay stats={stats} />
          </div>
        )}

        {/* Download Section - Full Width */}
        {processedData && uploadedFile && (
          <div style={{ marginTop: "20px" }}>
            <FileDownloader
              data={processedData}
              originalFileName={uploadedFile.name}
              algorithm={selectedAlgorithm}
              isCompressed={isCompressed}
            />
          </div>
        )}
      </div>

      {/* Algorithm Description Modal */}
      <AlgorithmDescription algorithm={showDescription} onClose={() => setShowDescription(null)} />
    </div>
  )
}

export default Index
