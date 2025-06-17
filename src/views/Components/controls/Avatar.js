import React from 'react'
import styled from 'styled-components/native';
import {isNil} from 'lodash'
import {Image} from 'react-native';

import {Colors, Styles, Sizes} from '@/styles';
import {StyledText} from './Text';

export default Avatar = styled.Image`
  width: ${Sizes.szAvatar}px;
  height: ${Sizes.szAvatar}px;
  border-radius: ${Sizes.szAvatar / 2}px;
`;

export const UserAvatar = ({
                             uri,
                             avatar,
                             userName,
                             fullName,
                             placeholder,
                             showActivityIndicator,
                             onPress,
                             activeOpacity,
                             textStyle,
                             style,
                             ...props
                           }) => {

  const [isLoading, setLoading] = React.useState(false)
  const [isFailed, setFailed] = React.useState(false)
  const isSucceed = !isLoading && !isFailed       // means no avatar uri provided or failed.

  const renderUserName = () => {
    const name = userName || fullName

    if (placeholder || !name) {    //placeholder has priority
      return (null)
    }

    // Success and uri or avatar provided, do not display
    if (isSucceed && (uri || avatar)) {
      return (null)
    }

    const text = (userName || fullName || '').split(' ')
      .filter(piece => piece.length > 0)
      .map(piece => piece.substring(0, 1).toUpperCase())
      .join('')
    return (
      <AbsFullView>
        <NameAbbr style={textStyle}>{text}</NameAbbr>
      </AbsFullView>
    )
  }

  const renderPlaceholder = () => {
    if (!placeholder) {
      return (null)
    }
    if (isSucceed && (uri || avatar)) {
      return (null)
    }
    return (<AbsFullView as={Image} resizeMode='cover' source={placeholder}/>)
  }

  const renderImage = () => {
    const url = uri || avatar
    if (!url) {
      return (null)
    }
    return (
      <AbsFullView
        as={Image}
        style={{backgroundColor: 'transparent'}}
        source={{uri: url}}
        onLoadStart={() => {
          setLoading(true);
          setFailed(false)
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <AvatarContainer style={style} onPress={onPress} disabled={isNil(onPress)}
                     activeOpacity={activeOpacity || 0.8} {...props}>
      {renderImage()}
      {renderUserName()}
      {renderPlaceholder()}
    </AvatarContainer>
  )
}

const AvatarContainer = styled.TouchableOpacity`
  width:${props => props.size || Sizes.avatarSmall}px;
  height:${props => props.size || Sizes.avatarSmall}px;
  border-radius: ${props => (props.size || Sizes.avatarSmall) / 2}px;
  background-color: ${Colors.grey220};
  overflow: hidden;
`

const AbsFullView = styled.View`
  ${Styles.absolute_full};
  align-items:center;
  justify-content:center;
  width: 100%;
  height: 100%;
`

const NameAbbr = styled(StyledText)`
  font-size: 13px;
  font-weight: bold;
  color: black;
`;
