import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";


export interface derivedArrayStateItem<T> {
    get: T;
    set: StateSetter<T>;
    delete: () => void;
}

export function useDerivedArrayState<T>(array: T[], setArray: StateSetter<T[]>) : derivedArrayStateItem<T>[] {
    return array
    .map((item, index) => {return {index: index, item: item}})
    .map(function(indexedItem) : derivedArrayStateItem<T>{
        const [get, set] = useDerivedState(
            array,
            setArray,
            arr => arr[indexedItem.index],
            (arr, newItem) => {
                const newArr = [...arr];
                newArr[indexedItem.index] = newItem;
                return newArr;
            });
        const deleteThis = () => setArray(original => {
            console.log("Deleted item with index: ", indexedItem.index)
            return original.filter((_, index) => index !== indexedItem.index);
        })
        return {get: get, set: set, delete: deleteThis};
    });
}