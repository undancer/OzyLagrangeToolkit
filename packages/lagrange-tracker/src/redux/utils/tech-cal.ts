export function stringToTech(value: string): number {
    let points = Number(value.replace(/\D/g, ""));
    if (points < 0) points = 0;
    if (points > 999) points = 999;
    return points;
}
