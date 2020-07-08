import React, { useEffect, useState } from "react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"
import Page, { Grid, GridColumn } from "@atlaskit/page"
import { RadioGroup } from "@atlaskit/radio"

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
  const [isUniqueAggregation, setIsUniqueAggregation] = useState(true)
  const [uniqueAggregationData, setUniqueAggregationData] = useState([])
  const [cumulativeAggregationData, setCumulativeAggregationData] = useState([])

  useEffect(() => {
    if (uniqueAggregationData.length === 0) {
      let processedData = createGraphData(addColumns(timeRangeOfAllEnrollments))
      processedData.pop()
      setUniqueAggregationData(processedData)
    } else if (cumulativeAggregationData.length === 0) {
      let processedData = createGraphData(
        addColumns(timeRangeOfAllEnrollments, false)
      )
      processedData.pop()
      setCumulativeAggregationData(processedData)
    }
  }, [isUniqueAggregation])

  const timeRangeOfAllEnrollments = videoViewData.map(
    (enrollment) => enrollment.timeRange
  )

  const aggregationMethods = [
    { name: "unique", value: "unique", label: "Unique plays only" },
    { name: "cumulative", value: "cumulative", label: "Cumulative plays" },
  ]

  const radioHandler = (event) => {
    setIsUniqueAggregation(event.currentTarget.value === "unique")
  }

  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          <h4>Choose aggregation method:</h4>
          <RadioGroup
            label={"Choose aggregation method"}
            options={aggregationMethods}
            defaultValue={aggregationMethods[0].value}
            onChange={radioHandler}
          />
        </GridColumn>
        <GridColumn medium={12}>
          <LineChart
            width={1000}
            height={500}
            data={
              isUniqueAggregation
                ? uniqueAggregationData
                : cumulativeAggregationData
            }
          >
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
            <XAxis dataKey="second" />
            <YAxis allowDecimals={false} />
          </LineChart>
        </GridColumn>
      </Grid>
    </Page>
  )
}

export default HeatMap
