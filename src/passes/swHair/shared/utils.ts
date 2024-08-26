import { CONFIG } from '../../../constants.ts';
import { Dimensions, divideCeil } from '../../../utils/index.ts';

export const getTileCount = (viewportSize: Dimensions): Dimensions => {
  const { tileSize } = CONFIG.hairRender;
  return {
    width: divideCeil(viewportSize.width, tileSize),
    height: divideCeil(viewportSize.height, tileSize),
  };
};
