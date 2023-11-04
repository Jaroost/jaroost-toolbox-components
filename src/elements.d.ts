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

        /**
         * Set attributes specified in attributes parameter.
         * @example
         *      element.allAttributes={+class': 'hello'} //Add hello class to already present classes
         * @example
         *      element.allAttributes={'-class': 'picker'} //Remove the picker class from element classes
         * @example
         *      element.allAttributes={'class': 'picker'} //Replace all classes from element classes by 'picker'
         * @example
         *      element.allAttributes={style:{ background: 'red', color: 'blue'}} //set the style to background: 'red'; color: 'blue';
         * @example
         *      element.allAttributes={data: { test: 'test', test2: 'test2'}} //set data-test="test" and data-test2="test2"
         * @example
         *      element.allAttributes={"data-test3": 'hello'} //set data-test3="hello"
         * @param attributes
         */
        set allAttributes(attributes: JSONObject)

        setStyles(styles: JSONObject): void

        changeVisibility(isVisible: boolean): void

    }
}
