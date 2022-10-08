export interface ShipData {
    id: string;
    name: string;
    type: string;
    variants: string[];
}

export const CRUISER_DATA: ShipData[] = [
    { id: "c1", name: "卡利斯托級", type: "巡洋舰", variants: ["鱼雷型", "反舰型", "支援型"] },
    { id: "c2", name: "艾奥级", type: "巡洋舰", variants: ["离子炮", "反舰型", "攻城型"] },
    { id: "c3", name: "奇美拉級", type: "巡洋舰", variants: ["炮弹型", "重炮型", "防衛型"] },
    { id: "c4", name: "猎兵级", type: "巡洋舰", variants: ["支援型", "反舰型"] },
    { id: "c5", name: "狩猎者级", type: "巡洋舰", variants: ["通用型", "战术型", "防空型"] },
    { id: "c6", name: "康納馬拉混沌級", type: "巡洋舰", variants: ["轨道炮", "电浆型"] },
    { id: "c7", name: "光锥级", type: "巡洋舰", variants: ["通用型", "防空型", "突击型"] },
    { id: "c8", name: "CAS066級", type: "巡洋舰", variants: ["綜合型", "炮击型", "载机型"] },
    { id: "c9", name: "KCCPV2.0級", type: "巡洋舰", variants: ["綜合型", "载机型", "轨道炮", "脉冲型"] },
];

export const DESTROYER_DATA: ShipData[] = [
    { id: "d1", name: "刺水母级", type: "护卫舰", variants: ["特种型", "防空型"] },
    { id: "d1", name: "雷击亚特级", type: "护卫舰", variants: ["反舰型", "魚雷型", "隐身型"] },
    { id: "d3", name: "红宝石级", type: "护卫舰", variants: ["轨道炮", "粒子炮", "防卫型"] },
    { id: "d4", name: "卡里莱恩级", type: "护卫舰", variants: ["侦查型", "重炮型", "特種型"] },
    { id: "d5", name: "澄海級", type: "护卫舰", variants: ["反舰型", "飞弹型", "防空型"] },
    { id: "d6", name: "諾瑪M470級", type: "护卫舰", variants: ["攻城型", "支援型", "防空型"] },
    { id: "d7", name: "静海级", type: "护卫舰", variants: ["綜合型", "脈衝型", "防空型"] },
    { id: "d8", name: "云海级", type: "护卫舰", variants: ["突擊型", "防空型"] },
    { id: "d9", name: "FG300级", type: "护卫舰", variants: ["多功能", "装甲型", "侦察型"] },
];

export const FRIGATE_DATA: ShipData[] = [
    { id: "f1", name: "苔原级", type: "驱逐舰", variants: ["支援型", "载机型"] },
    { id: "f2", name: "斗牛级", type: "驱逐舰", variants: ["攻击型", "突击型", "防御性"] },
    { id: "f3", name: "谷神星级", type: "驱逐舰", variants: ["载机型", "支援型", "战术型"] },
    { id: "f4", name: "AC721級", type: "驱逐舰", variants: ["通用型", "载机型", "飞弹型"] },
    { id: "f5", name: "阋神星级", type: "驱逐舰", variants: ["火炮型", "重炮型", "裝甲型"] },
    { id: "f6", name: "创身星级", type: "驱逐舰", variants: ["轨道炮", "魚雷型"] },
    { id: "f7", name: "枪骑兵级", type: "驱逐舰", variants: ["反舰型", "綜合型", "防空型"] },
    { id: "f8", name: "卫士级", type: "驱逐舰", variants: ["支援型", "两栖型", "脉冲炮"] },
    { id: "f9", name: "亚达伯拉级", type: "驱逐舰", variants: ["通用型", "裝甲型"] },
];

export const AIRCRAFT_DATA: ShipData[] = [
    // Medium fighters
    { id: "a5", name: "密斯托拉", type: "中型机", variants: [" "] },
    { id: "a2", name: "海氏追隨者型", type: "中型机", variants: [" "] },
    { id: "a1", name: "林鴞A100", type: "中型机", variants: [" "] },
    { id: "a9", name: "砂龙", type: "中型机", variants: [" "] },
    { id: "a8", name: "維塔斯A021", type: "中型机", variants: [" "] },
    { id: "a3", name: "平衡安德森", type: "中型机", variants: [" "] },
    { id: "a4", name: "孢子A404", type: "中型机", variants: [" "] },
    { id: "a7", name: "B192新大地", type: "中型机", variants: [" "] },
    { id: "a6", name: "佩刀Aer410", type: "中型机", variants: [" "] },
    // large fighters
    { id: "b1", name: "維塔斯B010", type: "大型机", variants: [" "] },
    { id: "b2", name: "刺鰩", type: "大型机", variants: [" "] },
    { id: "b3", name: "牛蛙", type: "大型机", variants: [" "] },
];

export const CORVETTE_DATA: ShipData[] = [
    { id: "e1", name: "星云追逐者", type: "护航艇", variants: ["弹炮型", "脉冲型"] },
    { id: "e2", name: "CV-T800", type: "护航艇", variants: ["看不到"] },
    { id: "e2", name: "蜂巢守卫者", type: "护航艇", variants: ["看不到"] },
    { id: "e2", name: "S-列维9号", type: "护航艇", variants: ["看不到"] },
    { id: "e2", name: "虚灵", type: "护航艇", variants: ["看不到"] },
    { id: "e2", name: "RB7-13", type: "护航艇", variants: ["看不到"] },
    { id: "e2", name: "鳐", type: "护航艇", variants: ["看不到"] },
    { id: "e2", name: "CV-M011", type: "护航艇", variants: ["导弹型", "火炮型"] },
    { id: "e2", name: "CV-II003", type: "护航艇", variants: ["看不到"] },
];
