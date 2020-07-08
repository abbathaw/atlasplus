import React from "react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"

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

const addColumns = (arrays, unique = true) => {
  if (unique) {
    return arrays.reduce((accum, array) => {
      array.forEach((element, index) => {
        accum[index] = (accum[index] || 0) + (element > 0 ? 1 : 0)
      })
      return accum
    }, [])
  } else {
    return arrays.reduce((accum, array) => {
      array.forEach((element, index) => {
        accum[index] = (accum[index] || 0) + element
      })
      return accum
    }, [])
  }
}

const HeatMap = ({ videoViewData }) => {
  const timeRangeOfAllEnrollments = videoViewData.map(
    (enrollment) => enrollment.timeRange
  )
  const stackedTimeRangeOfAllEnrollments = addColumns(
    timeRangeOfAllEnrollments,
    false
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
