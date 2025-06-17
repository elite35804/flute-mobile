import React, {useState} from 'react';
import Carousel from 'react-native-snap-carousel';
import Feather from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import {View} from 'react-native';
import {reduce, map, find} from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {MainBoldFont} from '@/views/Components';
import {Images, Colors} from '@/styles';
import {useOvermind} from '@/store';

/*
*
*/
function getFirstImage(images) {
  if (images == null || images.length == 0) return Images.background.FoodPlaceHolder;
  return ({uri: images[0].url})
}

/*
*
*/
function calcCalories(nutObj) {
  if (nutObj.name && nutObj.name.toLowerCase() == 'calories') return parseInt(nutObj.amount)
  return false
}

/*
*
*/
const ProductItem = (props) => {
  const {state, actions} = useOvermind();
  const {currentUser} = state;

  const [like, setLike] = useState(props.like);
  var cals = reduce(map(props.nutritionalFacts, calcCalories), function (sum, n) {
    return sum + n;
  }, 0);

  var price = find(props.pricing, {type: 'single'});

  const rating = props.rating?.toFixed(1);

  const onLike = async () => {
    setLike(!like);
    const likeId = props.likes.find(o => o.user.id == currentUser.id)?.id;
    await actions.likes.like({userId: currentUser.id, productId: props.id, likeId});
  }

  return (
    <ProductContainer activeOpacity={0.9} onPress={props.onPress}>
      <View>
        <Thumbnail source={getFirstImage(props.images)}/>
        {cals > 0 && <YellowContent>
          <BigInfo>{cals} CALS</BigInfo>
        </YellowContent>}
        <LikeButton onPress={onLike}>
          <Ionicons name={like ? "ios-heart" : "ios-heart-empty"} size={24} color="#F3E422"/>
        </LikeButton>
      </View>

      <Bottom>
        <Top>
          <ItemName>{props.name}</ItemName>
          <ItemName>${price.retailPrice || '--'}</ItemName>

        </Top>
        <Rating>
          <Feather name="star" size={12} color={Colors.greyText}/>
          <View style={{width: 5, height: 1}}/>
          {" " + rating ? rating : '--'}
        </Rating>
      </Bottom>
    </ProductContainer>
  )
}

const Category = (props) => {
  const {state} = useOvermind();
  const {currentUser} = state;

  return (
    <Container>
      <Title>{props.name}</Title>
      <Carousel
        data={props.foods.sort((a, b) => a.sortOrder - b.sortOrder)}
        renderItem={({item}) =>
          <ProductItem
            {...item}
            like={item.likes?.find(o => o.user.id == currentUser.id) != null}
            onPress={() => props.onPress(item)}
          />}
        sliderWidth={600}
        itemWidth={300}
        inactiveSlideScale={1}
        containerCustomStyle={{marginLeft: -150}}
        removeClippedSubviews={false}
      />
    </Container>
  )
}

export default Category;

const Container = styled.View`
    margin-left: 15px;
    padding-bottom: 10px;
    margin-top: 10px;
    overflow: hidden;
`

const Title = styled(MainBoldFont)`
    font-size: 22px;
    line-height: 27px;
    color: black;
    margin-bottom: 10px;
`

const Thumbnail = styled.Image`
    width: 100%;
    height: 180px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: rgb(220, 220, 220);
`;

const Bottom = styled.View`
    background-color: white;
    padding: 5px;
`

const Top = styled.View`
    flex-direction: row;
    justify-content: space-between;
`

const ItemName = styled(MainBoldFont)`
    font-size: 14px;
    line-height: 17px;
    color: ${Colors.darkGrey}
`

const Rating = styled(MainBoldFont)`
    font-size: 10px;
    line-height: 12px;
    color: ${Colors.greyText}
`

const ProductContainer = styled.TouchableOpacity`
    margin-right: 10px;
`

const BigInfo = styled(MainBoldFont)`
    color: black;
    font-size: 15px;
    line-height: 20px;
`;
const YellowContent = styled.View`
    position: absolute;
    bottom: 0;
    right: 0;
    padding-horizontal: 20px;
    padding-vertical: 10px;
    border-top-left-radius: 20px;
    background-color: ${Colors.yellow}
`

const LikeButton = styled.TouchableOpacity`
	padding: 10px;
	position: absolute;
	right: 5px;
	top: 5px;
`
