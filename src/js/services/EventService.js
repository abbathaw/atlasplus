import { EventEmitter } from "events"

export const PAUSE = "pause"
export const SEEKED = "seeked"
export const ENDED = "ended"
export const TIMEUPDATE = "timeupdate"

export const initEmitter = (socket) => {
  const eventEmitter = new EventEmitter()

  eventEmitter.on(PAUSE, (data, currentTime, timeRange) => {
    const timeRanges = timeRangesToArray(timeRange)

    socket.emit("paused", timeRanges, currentTime)
  })

  eventEmitter.on(TIMEUPDATE, (currentTime) => {
    socket.emit("timeupdate", currentTime)
  })

  eventEmitter.on(SEEKED, (data, currentTime, timeRange) => {
    const timeRanges = timeRangesToArray(timeRange)
    socket.emit("seeked", timeRanges, currentTime)
  })
  eventEmitter.on(ENDED, (data, currentTime, timeRange) => {
    const timeRanges = timeRangesToArray(timeRange)
    socket.emit("ended", timeRanges, currentTime)
    socket.disconnect()
  })

  return eventEmitter
}

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
