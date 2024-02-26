// See https://www.codevertiser.com/styled-components-media-queries/

import { css } from "styled-components";

interface Size {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export const device: Size = {
  xs: 400, // for small screen mobile
  sm: 600, // for mobile screen
  md: 900, // for tablets
  lg: 1280, // for laptops
  xl: 1440, // for desktop / monitors
  xxl: 1920, // for big screens
};

export const media = {
  xs: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.xs}px) {
      ${css(strings, ...args)};
    }
  `,
  sm: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.sm}px) {
      ${css(strings, ...args)};
    }
  `,
  md: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.md}px) {
      ${css(strings, ...args)};
    }
  `,
  lg: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.lg}px) {
      ${css(strings, ...args)};
    }
  `,
  xl: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.xl}px) {
      ${css(strings, ...args)};
    }
  `,
  xxl: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.xxl}px) {
      ${css(strings, ...args)};
    }
  `,
};
