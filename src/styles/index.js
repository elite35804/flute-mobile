import { css } from 'styled-components';

export { Colors } from './Colors';
export { Dimension } from './Dimension';
export { Sizes } from './Sizes';
export { Themes } from './Themes';
export { Images } from './Images';

const content_center = css`
  justify-content: center;
`;

const item_center = css`
  align-items: center;
`;

const center = css`
  ${content_center}
  ${item_center}
`;

const absolute_full = css`
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
`;

const absolute_top = css`
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
`;

const absolute_bottom = css`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

const background_image = css`
  ${absolute_full}
  width: 100%;
  height: 100%;
`;

const start_start = css`
  justify-content: flex-start;
  align-items: flex-start;
`;

const start_center = css`
  justify-content: flex-start;
  align-items: center;
`;


const end_center = css`
  justify-content: flex-end;
  align-items: center;
`;

const center_start = css`
  justify-content: center;
  align-items: flex-start;
`;

const between_center = css`
  justify-content: space-between;
  align-items: center;
`;

const between_start = css`
  justify-content: space-between;
  align-items: flex-start;
`;

const center_end = css`
  justify-content: center;
  align-items: flex-end;
`;

const match_parent = css`
  flex: 1;
  align-self: stretch;
`

const border_horizontal = function(szBorder, colorBorder){
  return `
    border-top-width: ${szBorder}px;
    border-top-color: ${colorBorder || '#000'};
    border-bottom-width: ${szBorder}px;
    border-bottom-color: ${colorBorder || '#000'};
  `;
};

// export const Colors = Colors;
// export const Dimension = Dimension;
// export const Images = Images;
// export const Sizes = Sizes;
// export const Themes = Themes;

export const Styles = {
  absolute_full,
  absolute_top,
  absolute_bottom,
  center,
  content_center,
  item_center,
  background_image,
  start_center,
  center_start,
  end_center,
  between_center,
  between_start,
  center_end,
  match_parent,
  start_start,
  border_horizontal
 };
