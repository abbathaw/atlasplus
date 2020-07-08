import { EventEmitter } from "events"

export const FIRSTPLAY = "firstplay"
export const CANPLAY = "canplay"
export const PLAY = "play"
export const PAUSE = "pause"
export const SEEKING = "seeking"
export const SEEKED = "seeked"
export const ENDED = "ended"

export const initEmitter = (socket) => {
  const eventEmitter = new EventEmitter()
  eventEmitter.on(CANPLAY, (data, currentTime) =>
    console.log("canPlay", data, currentTime)
  )
  eventEmitter.on(PLAY, (data, currentTime) =>
    console.log("playing", data, currentTime)
  )
  eventEmitter.on(PAUSE, (data, currentTime, timeRange) => {
    const timeRanges = timeRangesToArray(timeRange)
    console.log("pausing", data, currentTime, timeRanges)
    console.log("what is socket", socket)
    socket.emit("paused", timeRanges, currentTime)
  })

  eventEmitter.on(SEEKING, (data, currentTime) =>
    console.log("seeking", data, currentTime)
  )
  eventEmitter.on(SEEKED, (data, currentTime) =>
    console.log("seeked", data, currentTime)
  )
  eventEmitter.on(ENDED, (data, currentTime, timeRange) => {
    const timeRanges = timeRangesToArray(timeRange)
    console.log("ended", data, currentTime, timeRanges)
    socket.emit("ended", timeRanges, currentTime)
    socket.disconnect()
  })

  return eventEmitter
}

//TODO remove duplicate events (paused/ended) or just use timeranges from paused

const timeRangesToArray = (time_ranges) => {
  const ranges = []
  for (let i = 0; i < time_ranges.length; i++) {
    const start = Math.round(time_ranges.start(i))
    const end = Math.round(time_ranges.end(i))
    if (!(start === 0 && end === 0)) {
      ranges.push(start)
      ranges.push(end)
    }
  }
  return ranges
}
