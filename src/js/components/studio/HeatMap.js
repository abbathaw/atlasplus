import React, { useEffect, useState } from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts"
import Page, { Grid, GridColumn } from "@atlaskit/page"
import Select from "@atlaskit/select"
import styled from "styled-components"

const createGraphDataStructure = (timeRangeArray) => {
  return timeRangeArray.map((count, timestamp) => {
    return {
      second: timestamp,
      "view count": count,
    }
  })
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

const HeatMap = ({ videoViewData, viewer }) => {
  const [isUniqueAggregation, setIsUniqueAggregation] = useState(true)
  const [uniqueAggregationData, setUniqueAggregationData] = useState([])
  const [cumulativeAggregationData, setCumulativeAggregationData] = useState([])
  const [timeSpent] = useState(() =>
    videoViewData.reduce((total, curr) => curr.timeSpent + total, 0)
  )
  const [completionRate] = useState(
    () =>
      (videoViewData.reduce(
        (total, curr) => (curr.isCompleted ? total + 1 : total),
        0
      ) /
        videoViewData.length) *
      100
  )
  const [progressRate] = useState(
    () =>
      (videoViewData.reduce(
        (total, curr) => parseFloat(curr.watched) + total,
        0
      ) /
        videoViewData.length) *
      100
  )

  useEffect(() => {
    if (uniqueAggregationData.length === 0) {
      let processedData = createGraphDataStructure(
        addColumns(timeRangeOfAllEnrollments)
      )
      processedData.pop()
      setUniqueAggregationData(processedData)
    } else if (cumulativeAggregationData.length === 0) {
      let processedData = createGraphDataStructure(
        addColumns(timeRangeOfAllEnrollments, false)
      )
      processedData.pop()
      setCumulativeAggregationData(processedData)
    }
  }, [isUniqueAggregation])

  const timeRangeOfAllEnrollments = videoViewData.map(
    (enrollment) => enrollment.timeRange
  )

  const aggregationMethodOptions = [
    { value: "unique", label: "Unique plays only" },
    { value: "cumulative", label: "Cumulative plays" },
  ]

  const selectHandler = (option) => {
    setIsUniqueAggregation(option.value === "unique")
  }

  return (
    <Page>
      <Grid>
        <GridColumn medium={5}>
          <SelectContainer>
            <Select
              autoFocus={false}
              className="single-select"
              classNamePrefix="react-select"
              options={aggregationMethodOptions}
              placeholder={aggregationMethodOptions[0].label}
              onChange={selectHandler}
              value={
                isUniqueAggregation
                  ? aggregationMethodOptions[0]
                  : aggregationMethodOptions[1]
              }
            />
          </SelectContainer>
        </GridColumn>
        <GridColumn medium={2}>
          <StatContainer>
            <StatsLabel>Completion Rate</StatsLabel>
            <Stats>
              {viewer ? Math.round(progressRate) : Math.round(completionRate)}%
            </Stats>
          </StatContainer>
        </GridColumn>
        <GridColumn medium={3}>
          <StatContainer>
            <StatsLabel>
              {!viewer ? "Average Watched Rate" : "Watched Rate"}
            </StatsLabel>
            <Stats>{Math.round(progressRate)}%</Stats>
          </StatContainer>
        </GridColumn>
        <GridColumn medium={2}>
          <StatContainer>
            <StatsLabel>Total Time Spent</StatsLabel>
            <Stats>
              {new Date(timeSpent * 1000).toISOString().substr(11, 8)}
            </Stats>
          </StatContainer>
        </GridColumn>
        <GridColumn medium={12}>
          <ResponsiveContainer width="99%" height="99.8%" aspect={3}>
            <LineChart
              data={
                isUniqueAggregation
                  ? uniqueAggregationData
                  : cumulativeAggregationData
              }
            >
              <XAxis
                dataKey="second"
                label={{
                  value: "Second",
                  offset: -5,
                  position: "insideBottom",
                }}
              />
              <YAxis
                allowDecimals={false}
                label={{
                  value: "View Count",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ChartTooltip />
              <Line type="monotone" dataKey="view count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </GridColumn>
      </Grid>
    </Page>
  )
}

const SelectContainer = styled.div`
  height: 60px;
  width: 50%;
  margin: 0 5px 10px 5px;
  padding: 5px;
`

const StatContainer = styled.div`
  border-right: 2px black dotted;
  height: 60px;
  text-align: center;
  width: 100%;
  margin: 0 5px 10px 5px;
  padding: 5px;
`

const Stats = styled.p`
  color: #8884d8;
  font-size: calc(1vw + 10px);
`
const StatsLabel = styled.p`
  font-size: 1vw;
`

export default HeatMap
