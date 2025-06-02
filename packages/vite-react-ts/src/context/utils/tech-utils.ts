/**
 * 将字符串转换为技术点数值
 * @param value 输入字符串
 * @returns 技术点数值（0-999）
 */
export function stringToTech(value: string): number {
    let points = Number(value.replace(/\D/g, ""));
    if (points < 0) points = 0;
    if (points > 999) points = 999;
    return points;
}