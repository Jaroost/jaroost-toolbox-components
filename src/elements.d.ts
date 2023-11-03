declare global{
    type Primitive =
        | bigint
        | boolean
        | null
        | number
        | string
        | symbol
        | undefined;

    type JSONValue = Primitive | JSONObject | JSONArray;

    interface JSONObject {
        [key: string]: JSONValue;
    }

    interface JSONArray extends Array<JSONValue> { }

    interface Element {
        get allAttributes(): JSONObject
        set allAttributes(attributes: JSONObject)

        setStyles(styles: JSONObject): void

        changeVisibility(isVisible: boolean): void

    }
}
