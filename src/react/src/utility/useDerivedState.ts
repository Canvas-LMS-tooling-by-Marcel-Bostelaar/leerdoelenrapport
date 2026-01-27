type TintoT<T> = ((original: T) => T);
export type RestrictedSetter<T> = (arg: TintoT<T>) => void;

/**
 * Fully function based useDerivedState implementation. Does not accept direct values for the setter.
 * @param state 
 * @param set 
 * @param selector 
 * @param applicator 
 * @returns 
 */
function functionBasedUseDerivedState<A, B>(
  state: A,
  set: (updater: TintoT<A>) => void,
  selector: (originalState: A) => B,
  applicator: (originalState: A, transformedB: B) => A
): [B, RestrictedSetter<B>] {

  const derivedState: B = selector(state);
  if(typeof derivedState === 'function'){
    throw new Error("Derived state cannot be a function. This is to avoid ambiguity between a function as state and a function as an updater.");
  }

  const derivedSetter: RestrictedSetter<B> = (arg: TintoT<B>) => {
    set((originalSuper: A) => {
      return applicator(originalSuper, arg(selector(originalSuper)));
    });
  };
  return [derivedState, derivedSetter];
}



export type StateSetter<T> = (arg: T | TintoT<T>) => void;
export type useStateTuple<T> = [T, StateSetter<T>];

/**
 * Allows for creating a derived state from a parent state with a selector and an applicator.
 * The returned setter can accept either a direct value or an updater function.
 * @param state The parent state
 * @param set The setter for the parent state
 * @param selector The function to select the derived state from the parent state
 * @param applicator The function to apply a transformation to the derived state and update the parent state
 * @returns A tuple containing the derived state and its setter
 */
export function useDerivedState<A, B>(
  state: A,
  set: (updater: TintoT<A>) => void,
  selector: (state: A) => B,
  applicator: (originalState: A, transformedB: B) => A
): useStateTuple<B> {
  const [derivedState, derivedSetState] = functionBasedUseDerivedState(state, set, selector, applicator);
  const dualSetter: StateSetter<B> = makeFullSetter(derivedSetState);
  return [derivedState, dualSetter];
}

export function makeFullSetter<T>(setter: RestrictedSetter<T>) : StateSetter<T>{
  return (arg: T | TintoT<T>) => {
    if(typeof arg === 'function'){
      // we know arg is TintoT<B>
      setter(arg as TintoT<T>);
    } else {
      // we know arg is B
      setter(() => arg);
    }
  };
}