import {
    createElement
} from "./element-tools.ts";
import "./elements"

function replaceOneSelect(select: Element){
    //showHideElement(select, false);

    let element=createElement('input');
    element.className="form-control"
    element.addEventListener('click', function(){
        alert('click')
    })

    element.setStyles({background: 'red', color: 'blue'})
    element.innerHTML="Hello super element nouveau!"

    //console.log(getAllAttributes(select.parentElement));
    //showHideElement(select.parentElement, false)

     console.log(select.allAttributes)

    select.changeVisibility(false);
    select.parentElement.appendChild(element);

}

function replaceSelects(){

    let pickerSelects=document.querySelectorAll('.picker')

    for(let picker of pickerSelects){
        replaceOneSelect(picker);
    }


}
replaceSelects();