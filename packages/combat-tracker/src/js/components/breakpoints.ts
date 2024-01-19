// See https://www.codevertiser.com/styled-components-media-queries/

import { css } from "styled-components";

interface Size {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

const device: Size = {
  xs: "400px", // for small screen mobile
  sm: "600px", // for mobile screen
  md: "900px", // for tablets
  lg: "1280px", // for laptops
  xl: "1440px", // for desktop / monitors
  xxl: "1920px", // for big screens
};

export const media = {
  xs: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.xs}) {
      ${css(strings, ...args)};
    }
  `,
  sm: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.sm}) {
      ${css(strings, ...args)};
    }
  `,
  md: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.md}) {
      ${css(strings, ...args)};
    }
  `,
  lg: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.lg}) {
      ${css(strings, ...args)};
    }
  `,
  xl: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.xl}) {
      ${css(strings, ...args)};
    }
  `,
  xxl: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${device.xxl}) {
      ${css(strings, ...args)};
    }
  `,
};
