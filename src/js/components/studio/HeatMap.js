import React from "react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"

const stackUniqueVideoCompoundedTimeRangeFromAllUsers = (
  arrayOfUsersTimeRanges
) => {
  // response from db query
  let videoDuration = arrayOfUsersTimeRanges[0].length
  let uniqueVideoCompoundedTimeRangeFromAllUsers = new Array(
    videoDuration
  ).fill(0)

  for (let i = 0; i < arrayOfUsersTimeRanges.length; i++) {
    for (let j = 0; j < videoDuration; j++) {
      if (arrayOfUsersTimeRanges[i][j]) {
        uniqueVideoCompoundedTimeRangeFromAllUsers[j]++
      }
    }
  }
  return uniqueVideoCompoundedTimeRangeFromAllUsers
}

// param can also be from one user
const createGraphData = (uniqueVideoCompoundedTimeRangeFromAllUsers) => {
  let processedResult = uniqueVideoCompoundedTimeRangeFromAllUsers.map(
    (count, timestamp) => {
      return {
        second: timestamp,
        count: count,
      }
    }
  )
  console.log("processed videoViewData ", processedResult)

  return processedResult
}

const HeatMap = ({ videoViewData }) => {
  const timeRangeOfAllEnrollments = videoViewData.map(
    (enrollment) => enrollment.timeRange
  )
  const stackedTimeRangeOfAllEnrollments = stackUniqueVideoCompoundedTimeRangeFromAllUsers(
    timeRangeOfAllEnrollments
  )
  let processedData = createGraphData(stackedTimeRangeOfAllEnrollments)
  processedData.pop()

  return (
    <LineChart width={1000} height={500} data={processedData}>
      <Line type="monotone" dataKey="count" stroke="#8884d8" />
      <XAxis dataKey="second" />
      <YAxis allowDecimals={false} />
    </LineChart>
  )
}

export default HeatMap
