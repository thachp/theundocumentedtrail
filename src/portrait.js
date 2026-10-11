export function getPortraitCropGeometry(index, sheetWidth, sheetHeight) {
  const portraitWidth = sheetWidth / 4;
  return {
    viewBox: `${portraitWidth * index} 0 ${portraitWidth} ${sheetHeight}`,
    imageWidth: sheetWidth,
    imageHeight: sheetHeight,
  };
}
