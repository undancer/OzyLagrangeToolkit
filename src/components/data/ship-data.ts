import { AircraftData, ShipData, ShipTypes, SuperCapData, UnitDataBase } from "./ship-data-types";

export const BATTLE_CRUISER_DATA: SuperCapData[] = [
    {
        id: "bc1",
        name: "新君士坦丁大帝级",
        modules: {
            m1: { id: "m1", isBase: true, name: "伽马风暴粒子攻击系统", shortName: "离子攻击" },
            m2: { id: "m2", isBase: false, name: "伽马风暴粒子投射系统", shortName: "离子投射" },
            a1: { id: "a1", isBase: true, name: "伽马风暴投射攻击系统", shortName: "投射攻击" },
            a2: { id: "a2", isBase: false, name: "伽马风暴投射攻击系统", shortName: "投射攻击" },
            b1: { id: "b1", isBase: false, name: "通用火炮模块", shortName: "通用火炮" },
            b2: { id: "b2", isBase: false, name: "脉冲防空系统", shortName: "脉冲防空" },
            b3: { id: "b3", isBase: false, name: "防空导弹系统", shortName: "防空导弹" },
            c1: { id: "c1", isBase: false, name: "附加能源系统", shortName: "能源系统" },
            c2: { id: "c2", isBase: false, name: "舰载机系统", shortName: "舰载机仓" },
            c3: { id: "c3", isBase: false, name: "侦察无人机系统", shortName: "侦察机仓" },
            d1: { id: "d1", isBase: false, name: "近程防空系统", shortName: "防空系统" },
            d2: { id: "d2", isBase: false, name: "重点防护模块", shortName: "防护模块" },
            d3: { id: "d3", isBase: false, name: "损管系统", shortName: "损管系统" },
        },
    },
    {
        id: "bc2",
        name: "乌拉诺斯之矛",
        modules: {
            m1: { id: "m1", isBase: true, name: "舰首轨道炮系统", shortName: "重轨道炮" },
            m2: { id: "m2", isBase: false, name: "离子炮塔系统", shortName: "离子炮打" },
            a1: { id: "a1", isBase: true, name: "堡垒火炮系统", shortName: "堡垒火炮" },
            a2: { id: "a2", isBase: false, name: "堡垒火炮系统", shortName: "堡垒火炮" },
            a3: { id: "a3", isBase: false, name: "堡垒火炮系统", shortName: "堡垒火炮" },
            b1: { id: "b1", isBase: false, name: "矿车投射系统", shortName: "矿车投射" },
            b2: { id: "b2", isBase: false, name: "护航艇船舱", shortName: "护航艇仓" },
            b3: { id: "b3", isBase: false, name: "总和损管系统", shortName: "损管系统" },
            c1: { id: "c1", isBase: false, name: "分布式轻型武器控制系统", shortName: "防空系统" },
            c2: { id: "c2", isBase: false, name: "附加装甲系统", shortName: "附加装甲" },
            c3: { id: "c3", isBase: false, name: "反导拦截系统", shortName: "拦截系统" },
        },
    },
    {
        id: "bc3",
        name: "永恒风暴",
        modules: {
            m1: { id: "m1", isBase: true, name: "雷式离子生成系统", shortName: "高离子炮" },
            m2: { id: "m2", isBase: false, name: "离子炮塔系统", shortName: "离子炮打" },
            a1: { id: "a1", isBase: true, name: "堡垒火炮系统", shortName: "堡垒火炮" },
            a2: { id: "a2", isBase: false, name: "堡垒火炮系统", shortName: "堡垒火炮" },
            a3: { id: "a3", isBase: false, name: "堡垒火炮系统", shortName: "堡垒火炮" },
            b1: { id: "b1", isBase: false, name: "矿车投射系统", shortName: "矿车投射" },
            b2: { id: "b2", isBase: false, name: "护航艇船舱", shortName: "护航艇仓" },
            c1: { id: "c1", isBase: false, name: "分布式轻型武器控制系统", shortName: "防空系统" },
            c2: { id: "c2", isBase: false, name: "附加装甲系统", shortName: "附加装甲" },
            c3: { id: "c3", isBase: false, name: "反导拦截系统", shortName: "拦截系统" },
            d1: { id: "d1", isBase: false, name: "近程防空系统", shortName: "防空系统" },
            d2: { id: "d2", isBase: false, name: "重点防护模块", shortName: "防护模块" },
        },
    },
    {
        id: "bc4",
        name: "ST59",
        modules: {
            m1: { id: "m1", isBase: true, name: "攻坚轨道炮系统", shortName: "重轨道炮" },
            m2: { id: "m2", isBase: false, name: "舰首火炮系统", shortName: "舰首火炮" },
            m3: { id: "m3", isBase: false, name: "攻坚鱼雷系统", shortName: "攻坚鱼雷" },
            a1: { id: "a1", isBase: true, name: "大型火炮平台", shortName: "火炮平台" },
            a2: { id: "a2", isBase: false, name: "轨道炮塔阵列", shortName: "轨道炮塔" },
            a3: { id: "a3", isBase: false, name: "脉冲炮塔阵列", shortName: "脉冲炮塔" },
            b1: { id: "b1", isBase: false, name: "综合投射武器平台", shortName: "投射平台" },
            b2: { id: "b2", isBase: false, name: "舰载机系统", shortName: "舰载机仓" },
            b3: { id: "b3", isBase: false, name: "区域火控系统", shortName: "区域火控" },
            c1: { id: "c1", isBase: false, name: "附加装甲系统", shortName: "附加装甲" },
            c2: { id: "c2", isBase: false, name: "电磁装甲系统", shortName: "电磁装甲" },
            c3: { id: "c3", isBase: false, name: "重型防卫装甲", shortName: "重型装甲" },
        },
    },
];

const CRUISER_DATA: ShipData[] = [
    { id: "c1", name: "卡利斯托級", variants: ["鱼雷型", "反舰型", "支援型"] },
    { id: "c2", name: "艾奥级", variants: ["离子炮", "反舰型", "攻城型"] },
    { id: "c3", name: "奇美拉級", variants: ["炮弹型", "重炮型", "防衛型"] },
    { id: "c4", name: "猎兵级", variants: ["支援型", "反舰型"] },
    { id: "c5", name: "狩猎者级", variants: ["通用型", "战术型", "防空型"] },
    { id: "c6", name: "康納馬拉混沌", variants: ["轨道炮", "电浆型"] },
    { id: "c7", name: "光锥级", variants: ["通用型", "防空型", "突击型"] },
    { id: "c8", name: "CAS066級", variants: ["綜合型", "炮击型", "载机型"] },
    { id: "c9", name: "KCCPV2.0級", variants: ["綜合型", "载机型", "轨道炮", "脉冲型"] },
];

const DESTROYER_DATA: ShipData[] = [
    { id: "d1", name: "刺水母级", variants: ["特种型", "防空型"] },
    { id: "d1", name: "雷里亚特级", variants: ["反舰型", "魚雷型", "隐身型"] },
    { id: "d3", name: "红宝石级", variants: ["轨道炮", "粒子炮", "防卫型"] },
    { id: "d4", name: "卡里莱恩级", variants: ["侦查型", "重炮型", "特種型"] },
    { id: "d5", name: "澄海級", variants: ["反舰型", "飞弹型", "防空型"] },
    { id: "d6", name: "諾瑪M470級", variants: ["攻城型", "支援型", "防空型"] },
    { id: "d7", name: "静海级", variants: ["綜合型", "脈衝型", "防空型"] },
    { id: "d8", name: "云海级", variants: ["突擊型", "防空型"] },
    { id: "d9", name: "FG300级", variants: ["多功能", "装甲型", "侦察型"] },
];

const FRIGATE_DATA: ShipData[] = [
    { id: "f1", name: "苔原级", variants: ["支援型", "载机型"] },
    { id: "f2", name: "斗牛级", variants: ["攻击型", "突击型", "防御性"] },
    { id: "f3", name: "谷神星级", variants: ["载机型", "支援型", "战术型"] },
    { id: "f4", name: "AC721級", variants: ["通用型", "载机型", "飞弹型"] },
    { id: "f5", name: "阋神星级", variants: ["火炮型", "重炮型", "裝甲型"] },
    { id: "f6", name: "创身星级", variants: ["轨道炮", "魚雷型"] },
    { id: "f7", name: "枪骑兵级", variants: ["反舰型", "綜合型", "防空型"] },
    { id: "f8", name: "卫士级", variants: ["支援型", "两栖型", "脉冲炮"] },
    { id: "f9", name: "亚达伯拉级", variants: ["通用型", "裝甲型"] },
];

const AIRCRAFT_DATA: AircraftData[] = [
    // Medium fighters
    { id: "a1", name: "密斯托拉", type: "mid" },
    { id: "a2", name: "海氏追隨者", type: "mid" },
    { id: "a3", name: "林鴞A100", type: "mid" },
    { id: "a4", name: "砂龙", type: "mid" },
    { id: "a5", name: "維塔斯 A021", type: "mid" },
    { id: "a6", name: "平衡安德森", type: "mid" },
    { id: "a7", name: "孢子A404", type: "mid" },
    { id: "a8", name: "新大地B192", type: "mid" },
    { id: "a9", name: "佩刀Aer410", type: "mid" },
    { id: "a10", name: "SC002", type: "mid" },
    // large fighters
    { id: "b1", name: "維塔斯 B010", type: "large" },
    { id: "b2", name: "刺鰩", type: "large" },
    { id: "b3", name: "牛蛙", type: "large" },
];

const CORVETTE_DATA: ShipData[] = [
    { id: "e1", name: "星云追逐者", variants: ["弹炮型", "脉冲型"] },
    { id: "e2", name: "CV-T800", variants: [""] },
    { id: "e2", name: "蜂巢守卫者", variants: [""] },
    { id: "e2", name: "S-列维9号", variants: [""] },
    { id: "e2", name: "虚灵", variants: [""] },
    { id: "e2", name: "RB7-13", variants: [""] },
    { id: "e2", name: "鳐", variants: [""] },
    { id: "e2", name: "CV-M011", variants: ["导弹型", "火炮型"] },
    { id: "e2", name: "CV-II003", variants: [""] },
];

export const UNIT_DATA_BASE: UnitDataBase = {
    battleCruisers: { label: "战斗巡洋舰", type: ShipTypes.battleCruiser, list: BATTLE_CRUISER_DATA },
    cruisers: { label: "巡洋舰", type: ShipTypes.cruiser, list: CRUISER_DATA },
    destroyers: { label: "驱逐舰", type: ShipTypes.destroyer, list: DESTROYER_DATA },
    frigates: { label: "护卫舰", type: ShipTypes.frigate, list: FRIGATE_DATA },
    aircrafts: { label: "战机", type: ShipTypes.aircraft, list: AIRCRAFT_DATA },
    corvettes: { label: "护航艇", type: ShipTypes.corvette, list: CORVETTE_DATA },
};
