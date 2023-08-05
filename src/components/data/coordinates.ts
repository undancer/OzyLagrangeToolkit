export interface Coordinate {
    x: number;
    y: number;
}

export interface CityData {
    level: number;
    pos: Coordinate;
}

export const MAP_LENGTH = 9000;
export const STAGE_WIDTH = 1000;
export const STAGE_HEIGHT = 1000;
export const MAP_TO_STAGE_RATIO = STAGE_WIDTH / MAP_LENGTH;

export const CITIES: CityData[] = [
    { level: 4, pos: { x: 3838, y: 4367 } },
    { level: 7, pos: { x: 3332, y: 4348 } },
    { level: 2, pos: { x: 6590, y: 4231 } },
    { level: 4, pos: { x: 6319, y: 5788 } },
    { level: 5, pos: { x: 4525, y: 5988 } },
    { level: 4, pos: { x: 4759, y: 4631 } },
    { level: 4, pos: { x: 5459, y: 5347 } },
    { level: 7, pos: { x: 4926, y: 4128 } },
    { level: 2, pos: { x: 5779, y: 3467 } },
    { level: 5, pos: { x: 5766, y: 4728 } },
    { level: 5, pos: { x: 4548, y: 4208 } },
    { level: 7, pos: { x: 4601, y: 4339 } },
    { level: 5, pos: { x: 4670, y: 4692 } },
    { level: 2, pos: { x: 6489, y: 6092 } },
    { level: 4, pos: { x: 5729, y: 6151 } },
    { level: 7, pos: { x: 4189, y: 5232 } },
    { level: 5, pos: { x: 6652, y: 4208 } },
    { level: 7, pos: { x: 4429, y: 5951 } },
    { level: 5, pos: { x: 5347, y: 6008 } },
    { level: 4, pos: { x: 5749, y: 5651 } },
];

export const MAP_BORDERS: Coordinate[][] = [
    [
        { x: 2605, y: 546 },
        { x: 548, y: 8027 },
    ],
    [
        { x: 2902, y: 464 },
        { x: 8294, y: 5617 },
    ],
    [
        { x: 8224, y: 5913 },
        { x: 755, y: 8228 },
    ],
];

export function objCoord(pos: Coordinate): Coordinate {
    return { x: pos.x * MAP_TO_STAGE_RATIO, y: (MAP_LENGTH - pos.y) * MAP_TO_STAGE_RATIO };
}

export function getLinePoints(line: Coordinate[]): number[] {
    const lineCord = line.map((point) => objCoord(point));
    return [lineCord[0].x, lineCord[0].y, lineCord[1].x, lineCord[1].y];
}

export function starRatio(level: number): number {
    const oldMax = 7;
    const oldMin = 2;
    const scaleMax = 1;
    const scaleMin = 0.6;
    const oldRange = oldMax - oldMin;
    const newRange = scaleMax - scaleMin;
    const result = ((level - oldMin) * newRange) / oldRange + scaleMin;
    return result;
}
