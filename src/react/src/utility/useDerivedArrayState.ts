import { useDerivedState, type StateSetter } from "./useDerivedState";


interface derivedArrayStateItem<T> {
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
            let newList = [...original];
            delete newList[indexedItem.index];
            return newList;
        })
        return {get: get, set: set, delete: deleteThis};
    });
}