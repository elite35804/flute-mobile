import {Images, Sizes} from "@/styles";
import React from "react";
import styled from "styled-components";
import {MainBoldFont, MainMediumFont, MainRegularFont} from "@/views/Components";

const CartSummary = ({data, pos, getPosition, isCart, isReceipt}) => {
  return (<Container isCart={isCart}>
    <Info><InfoTitle>Subtotal</InfoTitle><InfoPrice>{data.subtotal?.toFixed(2)}</InfoPrice></Info>
    <Info><InfoTitle>Tax</InfoTitle><InfoPrice>{data.tax?.toFixed(2)}</InfoPrice></Info>
    {data?.delivery > 0 &&
    <Info><InfoTitle>Delivery</InfoTitle><InfoPrice>{data.delivery?.toFixed(2)}</InfoPrice></Info>}
    {data?.shipping > 0 &&
    <Info><InfoTitle>Shipping</InfoTitle><InfoPrice>{data.shipping?.toFixed(2)}</InfoPrice></Info>}
    <Info><InfoTitle>Service Charge</InfoTitle><InfoPrice>{data.serviceFee?.toFixed(2)}</InfoPrice></Info>
    <Info><InfoTitle>Flute Wallet</InfoTitle><InfoPrice>{data.wallet?.toFixed(2)}</InfoPrice></Info>
    {data.discount > 0 &&
    <Info onLayout={getPosition}><InfoTitle isRebate>Instant Rebates (Wallet)</InfoTitle><InfoPrice
      isRebate>{data.discount?.toFixed(2)}</InfoPrice></Info>}
    {data.dueNow > 0 &&
    <Info><InfoTitle>Total Due Now</InfoTitle><InfoPrice>{data.dueNow?.toFixed(2)}</InfoPrice></Info>}
    {(data?.rebates > 0 || data?.wallet > 0) &&
    <Info><InfoBoldTitle>Grand Total</InfoBoldTitle><InfoBoldPrice>${data.total?.toFixed(2)}</InfoBoldPrice></Info>}
    {!isCart && !isReceipt && <Tooltip style={{shadowOffset: {width: 0, height: 4}}} position={pos - 45}>
      <TooltipBody><TooltipTitle>DEPOSITED IN YOUR WALLET</TooltipTitle></TooltipBody>
      <Arrow source={Images.ic_triangle} width={Sizes.hScale(20)} height={Sizes.hScale(7)}/>
    </Tooltip>}
  </Container>)
}

export default CartSummary;

const Arrow = styled.Image`
  width: ${Sizes.hScale(30)}px;
  height: ${Sizes.hScale(7)}px;
  resize-mode: contain;
  align-self: center;
`

const TooltipTitle = styled(MainMediumFont)`
  color: white;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 1px;
`
const TooltipBody = styled.View`
  background-color: black;
  border-radius: 8px;
  padding-vertical: 11px;
  padding-horizontal: 30px;
  height: 35px;
`
const Tooltip = styled.View`
  position: absolute;
  top: ${props => props.position ? props.position : 0}px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  shadow-color: black;
  align-self: center;
`;

const InfoTitle = styled(MainRegularFont)`
  width: 80%;
  text-align: right;
  font-size: 13px;
  line-height: 20px;
  color: ${props => props.isRebate ? '#038B00' : 'black'};
`;

const InfoPrice = styled(InfoTitle)`
  width: 20%
`

const InfoBoldTitle = styled(MainBoldFont)`
  width: 80%;
  text-align: right;
  font-size: 13px;
  line-height: 20px;
  color: black;
`;

const InfoBoldPrice = styled(InfoBoldTitle)`
  width: 20%
`

const Info = styled.View`
  flex-direction: row;
  margin-bottom: 2px;
`

const Container = styled.View`
  margin-top: 12px;
  padding-horizontal: 20px;
  margin-bottom: 10px;
`;
