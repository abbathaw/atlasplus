import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useVideoAnalyticsModalContext } from "./Studio"
import { Button } from "@atlaskit/button/dist/cjs/components/Button"
import Avatar, { AvatarItem } from "@atlaskit/avatar"
import Lozenge from "@atlaskit/lozenge"
import Spinner from "@atlaskit/spinner"
import faker from "faker"

const UserAvatarRow = ({ enrollment, video, location }) => {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AP.request(`/rest/api/user?accountId=${enrollment.userId}`)
      .then(({ body }) => {
        setUser(JSON.parse(body))
        setIsLoading(false)
      })
      .catch((error) => {
        console.log("error fetching user", error)
        const pngid = Math.floor(Math.random() * 100) + 1
        setUser({
          displayName: faker.name.findName(),
          fake: true,
          profilePicture: {
            path: `https://api.adorable.io/avatars/80/${pngid}.png`,
          },
        })
        setIsLoading(false)
      })
  }, [])

  const { openModal } = useVideoAnalyticsModalContext()

  return (
    <Card>
      <NameContainer>
        {isLoading ? (
          <Spinner />
        ) : (
          <AvatarItem
            avatar={
              <Avatar
                src={
                  user.fake
                    ? user.profilePicture.path
                    : location + user.profilePicture.path
                }
              />
            }
            primaryText={user.displayName}
          />
        )}
      </NameContainer>
      <StatusContainer>
        {enrollment.isCompleted ? (
          <Lozenge appearance={"success"}>Completed </Lozenge>
        ) : (
          <Lozenge appearance={"inprogress"}>In progress</Lozenge>
        )}
      </StatusContainer>
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
  grid-template-columns: minmax(auto, 200px) 1fr 1fr;
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
const NameContainer = styled.div`
  justify-self: start;
`

const StatusContainer = styled.div`
  justify-self: center;
`
