import MP4Box from 'mp4box'

function ExtendMp4box() {
  const MP4BoxFile = MP4Box.createFile().constructor
  // 清空samples | Clear samples
  MP4BoxFile.prototype.removeUsedSamples = function (id: number) {
    const track = this.getTrackById(id)
    const samples = track.samples
    const lastSample = samples[samples.length - 1]
    lastSample.data = null
    lastSample.description = null
    lastSample.alreadyRead = 0
    track.samples = []
    track.samples.push(lastSample)
    track.nextSample = track.samples.length
    this.boxes = []
    this.mdats = []
    this.moofs = []
    this.lastMoofIndex = 0
  }

  MP4BoxFile.prototype.destroy = function () {
    if (this.stream) {
      this.stream.buffers = []
      this.stream.bufferIndex = -1
      this.stream = null
    }
    this.boxes = []
    this.mdats = []
    this.moofs = []
    this.isProgressive = false
    this.moovStartFound = false
    this.onMoovStart = null
    this.moovStartSent = false
    this.onReady = null
    this.readySent = false
    this.onSegment = null
    this.onSamples = null
    this.onError = null
    this.sampleListBuilt = false
    this.fragmentedTracks = []
    this.extractedTracks = []
    this.isFragmentationInitialized = false
    this.sampleProcessingStarted = false
    this.nextMoofNumber = 0
    this.itemListBuilt = false
    this.onSidx = null
    this.sidxSent = false
    this.moov = null
    this.ftyp = null
    this.items = []
    this.entity_groups = []
  }
}

ExtendMp4box()

export default MP4Box
