// Remove the provided element from the array, modifying the original array in the process.
// Does nothing if the item is not found.
export function removeElementByValue(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}