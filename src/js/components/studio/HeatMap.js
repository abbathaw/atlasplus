import React from "react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"

const res = [
  [0, 6, 8, 10],
  [0, 12],
  [0, 17],
  [20, 27],
]

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

const createGraphData = (res) => {
  let allUserTimeRanges = res.flatMap((userTR) => spreadTimeRangeArray(userTR)) //try flat map
  console.log("allUserTimeRanges ", allUserTimeRanges)
  let result = allUserTimeRanges.reduce((total, value) => {
    total[value] = (total[value] || 0) + 1
    return total
  }, {})
  console.log("result ", result)
  let processedResult = Object.entries(result).map(([k, v]) => {
    return { second: k, count: v }
  })
  console.log("processed result ", processedResult)
  return processedResult
}
const data = createGraphData(res)

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
