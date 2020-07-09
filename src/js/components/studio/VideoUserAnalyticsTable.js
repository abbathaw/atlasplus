import React, { useEffect, useState } from "react"
import Page, { Grid, GridColumn } from "@atlaskit/page"
import { Button } from "@atlaskit/button/dist/cjs/components/Button"
import ArrowLeftIcon from "@atlaskit/icon/glyph/arrow-left"
import styled from "styled-components"
import UserAvatarRow, { Card } from "./UserAvatarRow"

const VideoUserAnalyticsTable = ({
  video,
  videoViewData,
  closeWatchersTable,
}) => {
  const [location, setLocation] = useState("")

  useEffect(() => {
    AP.getLocation((location) => {
      setLocation(location.split("/wiki/")[0])
    })
  }, [])

  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          <Button
            onClick={closeWatchersTable}
            iconBefore={<ArrowLeftIcon size={"large"} />}
            appearance={"subtle-link"}
          />
        </GridColumn>
        <GridColumn medium={12}>
          <TableContainer>
            <List>
              <Card>
                <div>User</div>
                <div>Status</div>
                <div>Actions</div>
              </Card>
              {videoViewData.map((enrollment, i) => (
                <UserAvatarRow
                  enrollment={enrollment}
                  key={i}
                  video={video}
                  location={location}
                />
              ))}
            </List>
          </TableContainer>
        </GridColumn>
      </Grid>
    </Page>
  )
}
const TableContainer = styled.div`
  margin: 10px;
  padding: 5px;
`

const List = styled.div`
  display: grid;
  grid-template-columns: 3fr;
  justify-items: center;
  grid-row-gap: 20px;
`

export default VideoUserAnalyticsTable
