function setAttributesToElement(element:Element, attributes:JSONObject){
    for(const[attribute, value] of Object.entries(attributes)){
        if(typeof(value)==='object'){
            setAttributesToElement(element[attribute], value);
        }else{
            element[attribute]=value;
        }
    }
}
Object.defineProperty(Element.prototype, "allAttributes", {
    get:function getAttributes(){
        return this.getAttributeNames().reduce((acc, name) => {
            return {...acc, [name]: this.getAttribute(name)};
        }, {});
    },
    set: function setAttributes(attributes:JSONObject){
        setAttributesToElement(this, attributes)
    }
});
Element.prototype.setStyles=function(styles:Object){
    for(const [attribute, value] of Object.entries(styles)){
        this.style[attribute]=value;
    }
}
Element.prototype.changeVisibility=function(isVisible:Boolean){
    this.setStyles({display: isVisible ? 'block' : 'none'});
};

