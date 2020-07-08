import React from "react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"

// for a 10 second video from 4 users (enrollments)
const dbQueryRes = [
  [6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  [6, 6, 6, 6, 6, 0, 0, 0, 0, 0],
  [6, 6, 6, 6, 6, 0, 0, 0, 0, 0],
  [6, 6, 6, 6, 6, 0, 0, 0, 0, 0],
  [6, 6, 6, 6, 3, 6, 6, 6, 6, 6],
]

// To be used when session closes to consolidate watch times for user enrollment
const stackCompoundedTimeRange = (currentCompoundedTimeRange, newTimeRange) => {
  let spreadNewTimeRange = spreadTimeRangeArray(newTimeRange)
  for (let i = 0; i < spreadNewTimeRange.length; i++) {
    currentCompoundedTimeRange[spreadNewTimeRange[i]]++
  }
  return currentCompoundedTimeRange
}

const stackUniqueVideoCompoundedTimeRageFromAllUsers = (
  arrayOfUsersTimeRanges
) => {
  // response from db query
  let videoDuration = arrayOfUsersTimeRanges[0].length
  let uniqueVideoCompoundedTimeRageFromAllUsers = new Array(videoDuration).fill(
    0
  )

  for (let i = 0; i < arrayOfUsersTimeRanges.length; i++) {
    for (let j = 0; j < videoDuration; j++) {
      if (arrayOfUsersTimeRanges[i][j]) {
        uniqueVideoCompoundedTimeRageFromAllUsers[j]++
      }
    }
  }
  return uniqueVideoCompoundedTimeRageFromAllUsers
}

const spreadTimeRangeArray = (timeRangeArray) => {
  let collected = []
  for (let i = 0; i < timeRangeArray.length; i = i + 2) {
    console.log("range from ", timeRangeArray[i], " to ", timeRangeArray[i + 1])
    let spreadTimeRangeArray = Array(
      timeRangeArray[i + 1] - timeRangeArray[i] + 1
    )
      .fill()
      .map((_, idx) => timeRangeArray[i] + idx)
    console.log(spreadTimeRangeArray)
    collected = collected.concat(spreadTimeRangeArray)
  }
  console.log("collected ", collected)
  return collected
}

const createGraphData = (uniqueVideoCompoundedTimeRageFromAllUsers) => {
  // param can also be from one user

  let processedResult = uniqueVideoCompoundedTimeRageFromAllUsers.map(
    (count, timestamp) => {
      return {
        second: timestamp,
        count: count,
      }
    }
  )
  console.log("results ", processedResult)

  return processedResult
}
const data = createGraphData(
  stackUniqueVideoCompoundedTimeRageFromAllUsers(dbQueryRes)
)

const HeatMap = () => {
  return (
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="count" stroke="#8884d8" />
      {/*<CartesianGrid stroke="#ccc"/>*/}
      <XAxis dataKey="second" />
      <YAxis />
    </LineChart>
  )
}

export default HeatMap
