export interface ShipAirCapacity extends AirCapacity {
    id: string;
    variant: number;
}

export const SHIP_AIR_CAPACITY: { [index: string]: ShipAirCapacity } = {
    f8: { id: "f8", variant: 1, corvette: 2, midAir: 0, heavyAir: 0 },
    f1: { id: "f1", variant: 1, corvette: 0, midAir: 2, heavyAir: 0 },
    f3: { id: "f3", variant: 0, corvette: 0, midAir: 2, heavyAir: 0 },
    f4: { id: "f4", variant: 1, corvette: 2, midAir: 0, heavyAir: 0 },
    c4: { id: "c4", variant: 0, corvette: 4, midAir: 0, heavyAir: 0 },
    c5: { id: "c5", variant: -1, corvette: 0, midAir: 4, heavyAir: 0 },
    c8: { id: "c8", variant: 2, corvette: 2, midAir: 0, heavyAir: 0 },
    c9: { id: "c9", variant: 1, corvette: 0, midAir: 0, heavyAir: 2 },
};

export interface ModuleAirCapacity extends AirCapacity {
    id: string;
    moduleId: string;
}

export const MODULE_AIR_CAPACITY: { [index: string]: { [index: string]: ModuleAirCapacity } } = {
    bc1: { c2: { id: "bc1", moduleId: "c2", corvette: 0, midAir: 2, heavyAir: 0 } },
    bc2: { b2: { id: "bc1", moduleId: "b2", corvette: 2, midAir: 0, heavyAir: 0 } },
    bc4: { b2: { id: "bc4", moduleId: "b2", corvette: 0, midAir: 4, heavyAir: 0 } },
    cr1: {
        m1: { id: "cr1", moduleId: "m1", corvette: 3, midAir: 0, heavyAir: 5 },
        m2: { id: "cr1", moduleId: "m2", corvette: 0, midAir: 0, heavyAir: 5 },
        m3: { id: "cr1", moduleId: "m3", corvette: 0, midAir: 0, heavyAir: 8 },
        b2: { id: "cr1", moduleId: "b2", corvette: 3, midAir: 0, heavyAir: 0 },
    },
    cr2: {
        m1: { id: "cr2", moduleId: "m1", corvette: 6, midAir: 0, heavyAir: 0 },
        m2: { id: "cr2", moduleId: "m2", corvette: 0, midAir: 0, heavyAir: 8 },
        b2: { id: "cr2", moduleId: "b2", corvette: 3, midAir: 0, heavyAir: 0 },
        c1: { id: "cr2", moduleId: "c1", corvette: 0, midAir: 0, heavyAir: 5 },
    },
    cr3: {
        a1: { id: "cr3", moduleId: "a1", corvette: 0, midAir: 0, heavyAir: 6 },
        a2: { id: "cr3", moduleId: "a2", corvette: 6, midAir: 0, heavyAir: 0 },
        b1: { id: "cr3", moduleId: "b1", corvette: 0, midAir: 4, heavyAir: 0 },
    },
    cr4: {
        c1: { id: "cr4", moduleId: "c1", corvette: 0, midAir: 2, heavyAir: 0 },
        e2: { id: "cr4", moduleId: "e2", corvette: 0, midAir: 0, heavyAir: 3 },
    },
};

export interface AirCapacity {
    corvette: number;
    midAir: number;
    heavyAir: number;
}

export function ShipAirCapacity(id: string, variant: number): AirCapacity {
    const capacity = SHIP_AIR_CAPACITY[id];
    if (capacity !== null && capacity !== undefined) {
        const { corvette, midAir, heavyAir } = capacity;
        if (capacity.variant === -1 || capacity.variant === variant) return { corvette, midAir, heavyAir };
    }
    return { corvette: 0, midAir: 0, heavyAir: 0 };
}

export function SuperCapAirCapacity(id: string, modules: string[]): AirCapacity {
    const shipCapacity = MODULE_AIR_CAPACITY[id];

    const tempModules = [...modules];
    if (id === "cr1") tempModules.push("m1");
    if (id === "cr2") tempModules.push("m1");
    if (id === "cr3") tempModules.push("A1");
    tempModules.sort().reverse();

    // We assume there will never be a module starting with Z
    let moduleFound = "z";

    console.log(tempModules);
    if (shipCapacity !== null && shipCapacity !== undefined) {
        const resultCapacity = { corvette: 0, midAir: 0, heavyAir: 0 };
        tempModules.forEach((module) => {
            // Skip module which already has capacity
            if (module.indexOf(moduleFound) !== -1) return;
            moduleFound = module[0];
            const moduleCapacity = shipCapacity[module];
            if (moduleCapacity !== null && moduleCapacity !== undefined) {
                resultCapacity.corvette += moduleCapacity.corvette;
                resultCapacity.midAir += moduleCapacity.midAir;
                resultCapacity.heavyAir += moduleCapacity.heavyAir;
            }
        });
        return resultCapacity;
    }
    return { corvette: 0, midAir: 0, heavyAir: 0 };
}

export function addCapacity(holder: AirCapacity, extra: AirCapacity, count: number) {
    holder.corvette += extra.corvette * count;
    holder.midAir += extra.midAir * count;
    holder.heavyAir += extra.heavyAir * count;
}
