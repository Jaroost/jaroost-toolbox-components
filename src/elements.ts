Object.defineProperty(Element.prototype, "allAttributes", {
    get:function allAttributes(){
        return this.getAttributeNames().reduce((acc, name) => {
            return {...acc, [name]: this.getAttribute(name)};
        }, {});
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

