/**
 * TypeScript declaration for SVG file imports.
 * Allows: import MyIcon from '../assets/icons/my-icon.svg'
 * Usage:  <MyIcon width={24} height={24} color="#fff" />
 */
declare module '*.svg' {
  import type { SvgProps } from 'react-native-svg';
  import React from 'react';
  const SVGComponent: React.FC<SvgProps>;
  export default SVGComponent;
}
