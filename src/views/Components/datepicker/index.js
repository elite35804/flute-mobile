import React, {useRef, useEffect, useState} from 'react';
import moment from 'moment';
import styled from 'styled-components/native';

import Picker from './Picker';
import {MainBoldFont, MainSemiBoldFont} from '../controls/Text';
import {Colors} from '@/styles';
import {useOvermind} from '@/store';

const itemHeight = 90;

function generateDates() {
  const today = moment()
  const hour = today.hour()
  if (hour >= 18) {
    // Just add one more day
    today.add(1, 'days')
  }// 6pm
  const dates = [];
  for (let i = 1; i < 100; i++) {
    today.add(1, 'days')
    dates.push(today.toDate())   // Just clone.
  }
  return dates
}

// calculate differences between two dates
function daysDiff(a, b) {
  const am = moment([new Date(a).getFullYear(), new Date(a).getMonth(), new Date(a).getDate()])
  const bm = moment([b.getFullYear(), b.getMonth(), b.getDate()])
  return am.diff(bm, 'days')
}

// dates are moment dates, value is value
export default DatePicker = (props) => {
  const {state, actions} = useOvermind();
  const {window} = state;

  const width = parseInt(window.width / 3, 10);
  const pickerRef = useRef(null);
  const [dates] = useState(generateDates());
  const [initialIndex] = useState(Math.max(daysDiff(props.value, dates[0]), 0));

  // const updateDate = useDelay((date) => {
  //     props.onChange && props.onChange(new Date(date))
  // }, 100)

  useEffect(() => {
    const index = Math.max(daysDiff(props.value, dates[0]), 0);
    pickerRef.current && pickerRef.current.selectIndex(index);

    // initialize
    (props.onChange && new Date(props.value) <= new Date(dates[0])) && props.onChange(dates[0]);
    actions.dateSlider.setSelectedDate(dates[0])
  }, []);

  function onSelectedDate({item: date}) {
    props.onChange && props.onChange(new Date(date));
    actions.dateSlider.setSelectedDate(date);
  }

  function renderDay({item: date, index}, animIndex, selectedDate) {
    const selected = date === selectedDate;
    return selected ? (<SelectedCard date={date} width={width}/>) : (<DateCard date={date} width={width}/>)
  }

  return (
    <Container width={window.width} pointerEvents={props.pointerEvents} style={props.style}>
      <BottomLine/>
      <CenterOverlay pointerEvents="none" left={width - 5} width={width + 10}/>
      <MyPicker
        ref={r => pickerRef.current = r}
        horizontal
        initialIndex={initialIndex}
        data={dates}
        itemWidth={width}
        startMargin={width}
        endMargin={width}
        onSelected={onSelectedDate}
        renderItem={renderDay}
      />
    </Container>
  )
}

const Container = styled.View`
  width: ${props => props.width}px;
  height: ${itemHeight + 10}px;
  margin-top: -5px;
`

const CenterOverlay = styled.View`
  position:absolute;
  top: 0px;
  bottom:0px;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  height: ${itemHeight + 10}px;
  background-color:${Colors.yellow};
  border-radius: 5px;
`

const MyPicker = styled(Picker)`
  flex:1;
  margin-top: 5px;
  margin-bottom: 5px;
`

const LRMask = styled.View`
  position: absolute;
  top: 5px;
  height:${itemHeight}px;
  left:0px;
  right:0px;
`

const LeftMask = styled.Image`
  position:absolute;
  left: 0px;
  top: 0px;
  bottom:0px;
  width: ${props => props.width}px;
  height:${itemHeight}px;
`

const BottomLine = styled.View`
  position:absolute;
  left:0px;
  bottom: 5px;
  width: 100%;
  height: 1px;
  border-bottom-width:1px;
  border-bottom-color: #eee;
`

const RightMask = styled.Image`
  position:absolute;
  right:0px;
  top: 0px;
  bottom:0px;
  width: ${props => props.width}px;
  height:${itemHeight}px;
`

const DateCard = ({date, ...props}) => (
  <DateCardContainer {...props}>
    <WeekDayGrey>{moment(date).format('dddd').toUpperCase()}</WeekDayGrey>
    <DateGrey>{moment(date).format('DD')}</DateGrey>
  </DateCardContainer>
)

const SelectedCard = ({date, ...props}) => {
  const {actions} = useOvermind();
  const isSoldOut = actions.cart.isSoldOut();
  return (
    <SelectedCardContainer {...props}>
      {!isSoldOut ? <WeekDayBlack>{moment(date).format('dddd').toUpperCase()}</WeekDayBlack>
        : <SoldOut width={props.width + 10}>SOLD OUT</SoldOut>}
      <DateBlack>{moment(date).format('DD')}</DateBlack>
      <Spacer/>
      <MonthBlack>{moment(date).format('MMMM').toUpperCase()}</MonthBlack>
    </SelectedCardContainer>
  )
}

const DateCardContainer = styled.View`
    height: ${itemHeight}px;
    width: ${props => props.width}px;
    justify-content:center;
    align-items: center;
`

const SelectedCardContainer = styled.View`
    height: ${itemHeight}px;
    width: ${props => props.width}px;
    justify-content:center;
    align-items: center;
    zIndex: 10000;
`

const WeekDayGrey = styled(MainSemiBoldFont)`
    fontSize: 14px;
    color: grey;
    fontWeight: bold;
`

const WeekDayBlack = styled(MainSemiBoldFont)`
    font-size: 14px;
    line-height: 17px;
    color: black;
`

const SoldOut = styled(MainSemiBoldFont)`
    color: white;
    font-size: 12px;
    width: ${props => props.width}px;
    background-color: red;
    text-align: center;
    line-height: 20px;
    font-weight: bold;
    
`

const MonthBlack = styled(MainSemiBoldFont)`
    font-size: 13px;
    line-height: 16px;
    color: black;
`


const DateGrey = styled(MainBoldFont)`
    font-size: 33px;
    line-height: 40px;
    color: #6A6A6A;
`

const DateBlack = styled(DateGrey)`
    color: black;
`

const Spacer = styled.View`
    width: 50px;
    height: 2px;
    background-color: #ab9e00;
    margin-vertical: 5px;
`
