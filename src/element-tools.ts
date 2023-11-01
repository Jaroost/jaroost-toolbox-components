export function createElement(element:string){
    let newElement=document.createElement(element)
    return newElement;
}

export function showHideElement(element:Element, isVisible:Boolean){
    element.style.display= isVisible ? 'block' : 'none';
}

