import { UNIT_DATA_BASE } from "../../components/data/ship-data";
import { RootState } from "../core/store";

export function frigateByUser(state: RootState) {
    const accountIds = Object.keys(state.gameAccount);
    const accountNames = accountIds.map((id) => state.gameAccount[id].name);

    const shipData = UNIT_DATA_BASE.cruisers.list;
    const tracker: { [index: string]: boolean[] } = {};
    shipData.forEach((cruiser) => {
        cruiser.variants.forEach((_variant, index) => {
            const id = `${cruiser.id} ${index}`;
            tracker[id] = [];
        });
    });

    accountIds.forEach((accountId, index) => {
        const bluePrints = state.acquiredBluePrint[accountId];
        bluePrints.ships.forEach((cruiser) => {
            cruiser.variants.forEach((variant) => {
                const id = `${cruiser.id} ${variant}`;
                const target = tracker[id];
                if (target) tracker[id][index] = true;
            });
        });
    });

    const finishedResult: { [index: string]: string }[] = [];
    shipData.forEach((ship) => {
        const result: { [index: string]: string } = { ship: ship.name };
        accountNames.forEach((_accountName, accountIndex) => {
            result[accountIndex] = tracker[ship.id][accountIndex] ? "✅" : "";
        });
        finishedResult.push(result);
    });

    return finishedResult;
}
