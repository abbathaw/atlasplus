import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useVideoAnalyticsModalContext } from "./Studio"
import { Button } from "@atlaskit/button/dist/cjs/components/Button"
import Avatar, { AvatarItem } from "@atlaskit/avatar"
import Lozenge from "@atlaskit/lozenge"
import Spinner from "@atlaskit/spinner"

const UserAvatarRow = ({ enrollment, video, location }) => {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AP.request(`/rest/api/user?accountId=${enrollment.userId}`)
      .then(({ body }) => {
        setUser(JSON.parse(body))
        setIsLoading(false)
      })
      .catch((error) => console.log("error fetching user", error))
  }, [])

  const { openModal } = useVideoAnalyticsModalContext()

  return (
    <Card>
      <div>
        {isLoading ? (
          <Spinner />
        ) : (
          <AvatarItem
            avatar={<Avatar src={location + user.profilePicture.path} />}
            primaryText={user.displayName}
          />
        )}
      </div>
      <div>
        {enrollment.isCompleted ? (
          <Lozenge appearance={"success"}>Completed </Lozenge>
        ) : (
          <Lozenge appearance={"inprogress"}>In progress</Lozenge>
        )}
      </div>
      <div>
        <Button
          appearance={"default"}
          onClick={() => openModal(video, [enrollment], user.displayName)}
        >
          View Engagement
        </Button>
      </div>
    </Card>
  )
}

export default UserAvatarRow

export const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 600px;
  height: 40px;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  padding: 10px 16px;
  border-radius: 5px;
  grid-gap: 10px;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`
