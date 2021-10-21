import { ColorRangeInfo } from "../Types/ArenaTypes";

function calculatePoint(
  index: number,
  intervalSize: number,
  colorRangeInfo: ColorRangeInfo
) {
  const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return useEndAsStart
    ? colorEnd - index * intervalSize
    : colorStart + index * intervalSize;
}

export default function generateChartColors(
  dataLength: number,
  colorScale: (i: number) => string,
  colorRangeInfo: ColorRangeInfo,
  targetArray: string[]
) {
  const { colorStart, colorEnd } = colorRangeInfo;
  const colorRange = colorEnd - colorStart;
  const intervalSize = colorRange / dataLength;
  let i, colorPoint;

  for (i = 0; i < dataLength; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
    targetArray.push(colorScale(colorPoint));
  }
}

export {};
