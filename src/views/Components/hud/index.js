import React, {useRef, useEffect} from 'react';

import LoadingHud from './Hud';
import {useOvermind} from '@/store';

/**
 *
 *
 * @param {[type]} props [description]
 */
const Hud = props => {
  const ref = useRef();
  const {state, actions} = useOvermind();
  const hud = state.hud;

  useEffect(
    // state.hud.

    () =>
      () => {
        if (hud.isVisible) {
          ref.current?.show(hud.message);
        } else {
          ref.current?.close();
        }
      }

    , [hud.isVisible, hud.message]
  );

  return (
    <LoadingHud ref={node => ref.current = node}/>
  )
};

export default Hud;
