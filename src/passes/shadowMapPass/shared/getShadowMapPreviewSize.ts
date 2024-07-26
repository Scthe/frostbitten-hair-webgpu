import { Dimensions } from '../../../utils/index.ts';

const MAX_PREVIEW_SIZE = 500;

export function getShadowMapPreviewSize(viewportSize: Dimensions) {
  return Math.floor(
    Math.min(MAX_PREVIEW_SIZE, viewportSize.width / 3, viewportSize.height / 3)
  );
}
