import { Dimensions, Platform } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const window = Dimensions.get('window');
const dim = {};

dim.is_ios = Platform.OS === 'ios';
dim.is_android = Platform.OS === 'android';
dim.screenWidth = Math.min(window.width, window.height);
dim.screenHeight = Math.max(window.width, window.height);
dim.is_phone = dim.screenWidth < 600;
dim.is_pad = dim.screenWidth >= 600;
dim.is_iphonex = dim.is_ios && dim.screenHeight === 812;
dim.is_iphonexr = dim.is_ios && dim.screenHeight === 896;
dim.is_iphonexx = dim.is_iphonex || dim.is_iphonexr;

if (dim.screenWidth < 600) {
  dim.rate = dim.screenWidth / 375;
} else {
  dim.rate = dim.screenWidth / 768;
}

if (dim.screenWidth < 370) {
  // 320 ~ 375 : iphone4, 5
  dim.rate1 = 0.85;
} else if (dim.screenWidth < 410) {
  // 375 ~ 414 : iphone6
  dim.rate1 = 1.0;
} else if (dim.screenWidth < 480) {
  // 414 ~ 480 : iphone7p
  dim.rate1 = 1.1;
} else if (dim.screenWidth < 600) {
  // 480 ~ 600 : android
  dim.rate1 = 1.28;
} else if (dim.screenWidth < 760) {
  // 600 ~ 768 : tablet
  dim.rate1 = 0.78;
} else if (dim.screenWidth < 850) {
  // 768 ~ 834 : ipad 9.7"
  dim.rate1 = 1.0;
} else if (dim.screenWidth < 1024) {
  // 834 ~ 1024 : ipad 10.5"
  dim.rate1 = 1.1;
} else {
  // 1024 ~ : ipad pro
  dim.rate1 = 1.3;
}

export const Dimension = dim;

export const Spacing = {
  XS: moderateScale(5),
  SM: moderateScale(10),
  MD: moderateScale(15),
  LG: moderateScale(20),
  XL: moderateScale(30),
}

export const FontSize = {
  Tiny: moderateScale(10),
  Small: moderateScale(12),
  Medium: moderateScale(14),
  Large: moderateScale(16),
  ExtraLarge: moderateScale(18),
  Huge: moderateScale(20),
  ExtraHuge: moderateScale(24),
  Giant: moderateScale(30)
}
