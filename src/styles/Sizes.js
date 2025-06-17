import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Dimension, Spacing, FontSize } from './Dimension';
// Apply scale where needed

export const Sizes = {
  iconButton: 24,

  iconButtonPadding: 5,

  textNavBar: 16,

  textSectionHeader: 14,

  sectionHeader: 30,

  listItem: 70,

  hPadding: 15,

  inputContainerHeight: 60,

  inputHeight: 30,

  inputAreaContainerHeight: 120,

  inputAreaHeight: 90,

  textInputTitle: 12,

  avatarSmall: 36,

  divider: StyleSheet.hairlineWidth,

  button: 50,

  bottomSafeArea: Dimension.is_ios && Dimension.is_iphonexx ? 34 : 0,

  bottomSafeArea1: Dimension.is_ios && Dimension.is_iphonexx ? 24 : 0,

  topStatus: Dimension.is_ios ? (Dimension.is_iphonexx ? 44 : 20) : 0,

  szAvatar: Platform.OS === "ios" ? 130 : Dimensions.get("window").height * 0.2,      // The Avatar Size

  // Make unit 8 pixel
  hGrid: moderateScale(8),
  vGrid: verticalScale(8),

  hScale: moderateScale,

  scale: moderateScale,

  vScale: verticalScale,
}

Sizes.hSpace = function(nGrid){
  return Sizes.hGrid * nGrid;
}

Sizes.vSpace = function(nGrid){
  return Sizes.vGrid * nGrid;
}

Sizes.space = Sizes.hSpace;

export { Spacing, FontSize };
