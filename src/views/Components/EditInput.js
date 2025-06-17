import React from 'react';
import {TextInput, View, Text, Animated, TouchableOpacity} from 'react-native';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import {TextInputMask} from 'react-native-masked-text';
import MaskInput, {Masks} from 'react-native-mask-input';
import _ from 'lodash';

export default class Edit extends React.Component {
  state = {
    focused: false,
    positionValue: new Animated.Value(!this.props.value ? 10 : -10),
    fontSize: new Animated.Value(!this.props.value ? 10 : 8),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this._onFocus();
    }
  }

  _onFocus = () => {
    const {customize, onFocus} = this.props;
    const callcb = () => onFocus && onFocus();

    Animated.timing(this.state.positionValue, {
      toValue: -10,
      duration: 100,
    }).start();

    Animated.timing(this.state.fontSize, {
      toValue: 8,
      duration: 100,
    }).start();

    this.setState({focused: true}, callcb);
    if (this.props.isDelivery) {
      this.props._onFocus();
    }
  };

  _onBlur = () => {
    const {customize, onBlur} = this.props;

    if (!this.props.value) {
      Animated.timing(this.state.positionValue, {
        toValue: 10,
        duration: 100,
      }).start();

      Animated.timing(this.state.fontSize, {
        toValue: 10,
        duration: 100,
      }).start();
    }
    const callcb = () => onBlur && onBlur();
    this.setState({focused: false}, callcb);
  };

  render() {
    const {
      onRef,
      theme,
      border,
      style,
      pointerEvents,
      editable,
      value,
      customize,
      onFocus,
      onBlur,
      disabledStyle,
      useMask,
      placeholder,
      disabled,
      isSelect,
      onPress,
      mask,
      ...otherProps
    } = this.props;
    const {focused} = this.state;

    const newStyle = {
      color: '#000',
      fontSize: 15,
      width: '100%',
    };

    let rendered = !isSelect ? (
      !mask ? (
        <TextInput
          ref={onRef}
          style={newStyle}
          value={value}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          {...otherProps}
        />
      ) : (
        <MaskInput
          ref={onRef}
          style={newStyle}
          value={value}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          mask={mask}
          {...otherProps}
          placeholderFillCharacter=""
        />
      )
    ) : (
      <TouchableOpacity style={[newStyle, {flexDirection: 'row', justifyContent: 'space-between'}]} onPress={onPress}>
        <Text style={newStyle}>{value}</Text>
        <View style={{position: 'absolute', right: 1, bottom: 0, top: 2}}>
          <SLIcon size={15} name="arrow-down" color={'black'} />
        </View>
      </TouchableOpacity>
    );

    const Input = (
      <View
        style={{
          borderBottomWidth: 0.3,
          borderBottomColor: 'black',
          marginBottom: 10,
          marginTop: 10,
          flex: 1,
          paddingBottom: 10,
          paddingTop: 5,
          flexDirection: 'row',
        }}>
        {this.props.isUsername && <Text style={{marginRight: 3}}>@</Text>}
        <Animated.Text
          style={[
            {position: 'absolute', top: 0, fontSize: this.state.fontSize, color: 'rgb(27, 27, 27)'},
            {top: this.state.positionValue},
          ]}>
          {placeholder.toUpperCase()}
        </Animated.Text>
        {rendered}
      </View>
    );

    return Input;
  }
}

Edit.defaultProps = {
  theme: 'std',
  underlineColorAndroid: 'rgba(0,0,0,0)',
};
