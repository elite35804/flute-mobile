import React, {useEffect, useRef} from 'react';
import {Image} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {Images} from "@/styles/Images";

import {useOvermind} from '@/store';

const baseStyle = {
  textAlign: 'left',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: 'transparent',
};

type AlertProps = {}
    
type AlertHandle = {
  showAlert: (type: string, title: string, message: string) => void,
}
    
const Alert: React.ForwardRefRenderFunction<AlertHandle, AlertProps> = (
  props,
  forwardedRef,
) => {

  React.useImperativeHandle(forwardedRef, () => ({
    showAlert(type: string, title: string, message: string) {
      ref.current?.alertWithType(type, title, message);
    }
  }));

  const {state, actions} = useOvermind();
  const ref = useRef<DropdownAlert | null>();

  const titleStyle = {
    ...baseStyle,
    fontSize: 16,
  };

  const messageStyle = {
    ...baseStyle,
    fontSize: 14,
  };

  // Subscribe to alert changes
  useEffect(() => {
    if (state.alert.visible) {
      const {type, title, message} = state.alert;

      ref.current?.alertWithType(type, title, message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.alert.visible]);

  return (
    <DropdownAlert
      ref={(node) => (ref.current = node)}
      panResponderEnabled={false}
      titleNumOfLines={0}
      messageNumOfLines={0}
      titleStyle={titleStyle}
      messageStyle={messageStyle}
      successColor="#000"
      onClose={actions.alert.hide}
      renderImage={() => (
        <Image source={Images.logo}
               style={{width: 40, height: 40, marginRight: 10, borderRadius: 10, resizeMode: 'contain', alignSelf: 'center'}}/>
      )}
    />
  );
};

export default React.forwardRef(Alert);
