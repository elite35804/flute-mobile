import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {requireNativeComponent} from 'react-native';

class CardIOView extends Component {
  displayName = 'CardIOView';

  statics = {
    cardImageAndNumber: 'cardImageAndNumber',
    cardImageOnly: 'cardImageOnly',
    automatic: 'automatic',
  };

  render() {
    return <RCTCardIOView {...this.props} />;
  }
}

/* eslint-disable react/require-default-props, react/no-unused-prop-types */
CardIOView.propTypes = {
  languageOrLocale: PropTypes.oneOf([
    'ar', 'da', 'de', 'en', 'en_AU', 'en_GB', 'es', 'es_MX', 'fr', 'he', 'is', 'it', 'ja', 'ko', 'ms',
    'nb', 'nl', 'pl', 'pt', 'pt_BR', 'ru', 'sv', 'th', 'tr', 'zh-Hans', 'zh-Hant', 'zh-Hant_TW',
  ]),
  guideColor: PropTypes.string,
  useCardIOLogo: PropTypes.bool,
  hideCardIOLogo: PropTypes.bool,
  allowFreelyRotatingCardGuide: PropTypes.bool,
  scanInstructions: PropTypes.string,
  scanOverlayView: PropTypes.element,
  scanExpiry: PropTypes.bool,
  scannedImageDuration: PropTypes.number,
  detectionMode: PropTypes.oneOf([
    'cardImageAndNumber',
    'cardImageOnly',
    'automatic',
  ]),
  onScanCard: PropTypes.func,
  hidden: PropTypes.bool,
};

CardIOView.defaultProps = {
  onScanCard: () => {
  },
  useCardIOLogo: false,
  hideCardIOLogo: true,
  hidden: false,
  scanExpiry: true,
  allowFreelyRotatingCardGuide: true,
  detectionMode: 'cardImageAndNumber',
  scannedImageDuration: 2,
  scanInstructions: 'Hold card here. It will scan automatically.',
};

const RCTCardIOView = requireNativeComponent('RCTCardIOView', CardIOView);

export default CardIOView;
