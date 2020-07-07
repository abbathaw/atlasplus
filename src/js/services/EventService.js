import { EventEmitter } from "events"

export const CANPLAY = "canplay"
export const PLAY = "play"
export const PAUSE = "pause"
export const SEEKING = "seeking"
export const SEEKED = "seeked"
export const ENDED = "ended"

export const initEmitter = () => {
  const eventEmitter = new EventEmitter()
  eventEmitter.on(CANPLAY, (data, currentTime) =>
    console.log("canPlay", data, currentTime)
  )
  eventEmitter.on(PLAY, (data, currentTime) =>
    console.log("playing", data, currentTime)
  )
  eventEmitter.on(PAUSE, (data, currentTime, timeRange) =>
    console.log("pausing", data, currentTime, timeRangesToArray(timeRange))
  )
  eventEmitter.on(SEEKING, (data, currentTime) =>
    console.log("seeking", data, currentTime)
  )
  eventEmitter.on(SEEKED, (data, currentTime) =>
    console.log("seeked", data, currentTime)
  )
  eventEmitter.on(ENDED, (data, currentTime, timeRange) =>
    console.log("ended", data, currentTime, timeRangesToArray(timeRange))
  )

  return eventEmitter
}

//TODO remove duplicate events (paused/ended) or just use timeranges from paused

const timeRangesToArray = (time_ranges) => {
  const ranges = []
  for (let i = 0; i < time_ranges.length; i++) {
    let range = {}
    range.start = Math.round(time_ranges.start(i))
    range.end = Math.round(time_ranges.end(i))
    ranges.push(range)
  }
  return ranges
}
