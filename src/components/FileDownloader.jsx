"use client"

const FileDownloader = ({ data, originalFileName, algorithm, isCompressed }) => {
  const handleDownload = () => {
    if (!data) return

    const blob = new Blob([data], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)

    const extension = isCompressed ? `.${algorithm}` : ""
    const prefix = isCompressed ? "" : "decompressed_"
    const fileName = `${prefix}${originalFileName}${extension}`

    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!data) return null

  // Calculate file size for display
  const fileSize = data ? (data.length / 1024).toFixed(2) : "0"
  const fileSizeUnit = data && data.length > 1024 * 1024 ? "MB" : "KB"
  const displaySize = data && data.length > 1024 * 1024 ? (data.length / (1024 * 1024)).toFixed(2) : fileSize

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-gray-800 border border-gray-700 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gray-700 border-b border-gray-600 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-100">
              {isCompressed ? "Compression Complete" : "Decompression Complete"}
            </h3>
            <p className="text-sm text-gray-300">
              Your file has been successfully {isCompressed ? "compressed" : "decompressed"}
            </p>
          </div>
        </div>

        {/* File Information */}
        <div className="px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* File Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-100 mb-3">File Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-700 border border-gray-600">
                    <span className="text-sm text-gray-300">Original Name</span>
                    <span className="text-sm font-medium text-gray-100">{originalFileName}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-700 border border-gray-600">
                    <span className="text-sm text-gray-300">File Size</span>
                    <span className="text-sm font-medium text-gray-100">
                      {displaySize} {fileSizeUnit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-700 border border-gray-600">
                    <span className="text-sm text-gray-300">Status</span>
                    <span className="text-sm font-medium text-gray-100">
                      {isCompressed ? "Compressed" : "Decompressed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Algorithm Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-100 mb-3">Algorithm Used</h4>
                <div className="bg-gray-700 border border-gray-600 p-4">
                  <div>
                    <h5 className="text-sm font-bold text-gray-100">{algorithm.toUpperCase()}</h5>
                    <p className="text-xs text-gray-300 mt-1">Compression algorithm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-100 mb-1">Ready to Download</h4>
                <p className="text-sm text-gray-300">
                  Click the download button to save your {isCompressed ? "compressed" : "decompressed"} file
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 border border-blue-500"
                >
                  DOWNLOAD FILE
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 p-3 bg-gray-700 border border-gray-600">
            <div className="text-xs text-gray-300">
              <p>
                The download will start automatically when you click the button. The file will be saved with the
                appropriate extension and naming convention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileDownloader
