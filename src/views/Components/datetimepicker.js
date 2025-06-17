import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class DateTime extends React.Component {
  state = {
    visible: false,
    value: new Date(),
  }

  callback = null;
  value = null;
  open = (value, callback) => {
    console.log(value);
    this.callback = callback;
    this.state.value = new Date();
    this.setState({value: value || this.state.value, visible: true});
  }

  close = () => {
    this.setState({visible: false});
  }

  onConfirm = (value) => {
    this.value = value;
    this.close();
    this.callback && this.callback(value);
  }
  onHideConfirm = () => {
    this.callback && this.callback(this.value);
  }
  onCancel = () => {
    this.close();
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    const {isVisible, onConfirm, onCancel, ...otherProps} = this.props;
    // console.log(colorScheme, 'colorScheme')

    return (
      <DateTimePicker
        // isDarkModeEnabled={false}
        isVisible={this.state.visible}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        onHideAfterConfirm={this.onHideConfirm}
        date={this.state.value}
        {...otherProps}
      />
    );
  }
}
