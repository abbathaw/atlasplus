import React, { useState, useEffect } from "react"
import styled from "styled-components"
import UploadForm from "./UploadForm"

const UploadVideo = () => {
  const [context, setContext] = useState({})
  const [spaceKey, setSpaceKey] = useState("")
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    // AP.context.getContext( (response) => {
    //   setContext(response)
    //   setSpaceKey(response.confluence.space.key)
    // })
    console.log("context", context)
  }, [])

  const handleReset = () => {
    setShowForm(false)
    setTimeout(() => {
      setShowForm(true)
    }, 100)
  }

  return (
    <Wrapper>
      <Row className="row-styled" align="baseline">
        <SideImageRow image="/images/cinema.png" />
      </Row>
      <h4>Upload a Video</h4>
      <StyledFlexWrapper className="wrapper-styled">
        <Row className="row-styled" justify="start">
          <div className="content-styled">
            <React.Fragment>
              {showForm && <UploadForm resetForm={handleReset} />}
            </React.Fragment>
          </div>
        </Row>
      </StyledFlexWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const SideImageRow = (image) => {
  return (
    <SideImage>
      <Img src={image.image} />
    </SideImage>
  )
}

const SideImage = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100px;
`

const Img = styled.img`
  vertical-align: top;
  width: 100%;
  margin-top: 10px;
`

export const StyledFlexWrapper = styled.div`
  display: flex;
  //flex: 1 1 0%;
  padding-top: 40px 5px;
  flex-flow: row-nowrap;
  place-content: center;
  justify-content: center;
`

export const Row = styled.div`
  align-items: ${(props) => (props.align ? `${props.align}` : "center")};
  display: flex;
  justify-content: ${(props) =>
    props.justify ? `flex-${props.justify}` : "center"};
  margin: 50px;
`

export default UploadVideo
