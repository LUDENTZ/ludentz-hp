import AVFoundation
import CoreImage
import CoreVideo
import Foundation

guard CommandLine.arguments.count >= 3 else {
  fputs("usage: swift png-sequence-to-mp4.swift <frames-dir> <output.mp4> [fps]\n", stderr)
  exit(2)
}

let framesURL = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let fps = Int32(CommandLine.arguments.count > 3 ? CommandLine.arguments[3] : "25") ?? 25
let width = 1440
let height = 900

let files = try FileManager.default.contentsOfDirectory(at: framesURL, includingPropertiesForKeys: nil)
  .filter { $0.pathExtension.lowercased() == "png" }
  .sorted { $0.lastPathComponent < $1.lastPathComponent }

guard !files.isEmpty else {
  fputs("no PNG frames found\n", stderr)
  exit(3)
}

try? FileManager.default.removeItem(at: outputURL)
let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 2_600_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
  ],
])
input.expectsMediaDataInRealTime = false

let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: width,
  kCVPixelBufferHeightKey as String: height,
])

guard writer.canAdd(input) else { fatalError("cannot add video input") }
writer.add(input)
guard writer.startWriting() else { fatalError(writer.error?.localizedDescription ?? "startWriting failed") }
writer.startSession(atSourceTime: .zero)

let ciContext = CIContext(options: [.useSoftwareRenderer: false])
for (index, file) in files.enumerated() {
  while !input.isReadyForMoreMediaData { usleep(2_000) }
  guard let image = CIImage(contentsOf: file), let pool = adaptor.pixelBufferPool else {
    fatalError("cannot read frame \(file.lastPathComponent)")
  }
  var buffer: CVPixelBuffer?
  guard CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer) == kCVReturnSuccess, let pixelBuffer = buffer else {
    fatalError("cannot create pixel buffer")
  }
  ciContext.render(image, to: pixelBuffer, bounds: CGRect(x: 0, y: 0, width: width, height: height), colorSpace: CGColorSpaceCreateDeviceRGB())
  let time = CMTime(value: CMTimeValue(index), timescale: fps)
  guard adaptor.append(pixelBuffer, withPresentationTime: time) else {
    fatalError(writer.error?.localizedDescription ?? "append failed")
  }
}

input.markAsFinished()
let semaphore = DispatchSemaphore(value: 0)
writer.finishWriting { semaphore.signal() }
semaphore.wait()
guard writer.status == .completed else { fatalError(writer.error?.localizedDescription ?? "finishWriting failed") }
print(outputURL.path)
