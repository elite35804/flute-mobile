import React from 'react'
import GradientView from "./GradientView";

import styled from 'styled-components'

export const BottomContainer = (props) => (
  <Bottom
    style={props.style}
    topColor={"#E7E7E700"}
    middleColor={"#E7E7E7FF"}
    bottomColor={"#E7E7E7FF"}
  >
    {props.children}
  </Bottom>
)

export const Bottom = styled(GradientView)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-horizontal: 20px;
    padding-vertical: 30px;
`
