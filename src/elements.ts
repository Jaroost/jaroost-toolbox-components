function setAttributesToElement(element:Element, attributes:JSONObject){
    for(const[attribute, value] of Object.entries(attributes)){
        if(attribute==='class'){
            element['className']=value;
        }else if(attribute==='+class'){
            element.classList.add(value)
        }else if(attribute==='-class'){
            element.classList.remove(value)
        }
        else if(attribute === 'data'){
            setAttributesToElement(element, {'dataset': value})
        }else if(attribute.startsWith('data-')){
            element['dataset'][attribute.replace('data-', '')]=value
        }else if(typeof(value)==='object'){
            setAttributesToElement(element[attribute], value);
        }else{
            element[attribute]=value;
        }
    }
}
Object.defineProperty(Element.prototype, "allAttributes", {
    get:function getAttributes(){
        return this.getAttributeNames().reduce((acc, name) => {
            return {...acc, [name]: name=='style' ? window.getComputedStyle(this): this.getAttribute(name)};
        }, {});
    },
    set: function setAttributes(attributes:JSONObject){
        setAttributesToElement(this, attributes)
    }
});
Element.prototype.changeVisibility=function(isVisible:Boolean){
    this.allAttributes={style: {display: isVisible ? 'block' : 'none'}}
};
Element.prototype.isVisible=function(){
    return this.allAttributes.style.display=='block'
}

