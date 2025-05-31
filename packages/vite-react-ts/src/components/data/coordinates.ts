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
