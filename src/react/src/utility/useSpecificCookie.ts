import { useCookies } from "react-cookie";
import { makeFullSetter, type RestrictedSetter, type StateSetter, type useStateTuple } from "./useDerivedState";


export function useSpecificCookie<T>(name: string, defaultValueFactory: () => T, serializeObject: (val: T) => any, deserializeObject: (val: any) => T): useStateTuple<T> {
    const [cookies, setCookie, _] = useCookies([name]);
    let get : T;
    if(cookies[name]){
        get = deserializeObject(cookies[name]);
    }
    else{
        get = defaultValueFactory();
        setCookie(name, serializeObject(get));
    }
    const simpleSetter1 = (val : T) => setCookie(name, serializeObject(val));
    const simpleSet : RestrictedSetter<T> = transformer => simpleSetter1(transformer(get));
    const set : StateSetter<T> = makeFullSetter(simpleSet);

    return [get, set];
}