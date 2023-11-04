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

    element.setStyles({background: 'red', color: 'blue', cursor: 'pointer', class: 'test'})
    element.innerHTML="Hello super element nouveau!"

    //console.log(getAllAttributes(select.parentElement));
    //showHideElement(select.parentElement, false)

     console.log(select.allAttributes)
    select.allAttributes={'+class': 'hello', '-class': 'picker',
        style:{ background: 'red', color: 'blue'},
        data: { test: 'test', test2: 'test2'}
        , "data-test3": 'hello',
        id: 'test',
    name: 'blabla'};


    //select.changeVisibility(false);
    select.parentElement.appendChild(element);

}

function replaceSelects(){

    let pickerSelects=document.querySelectorAll('.picker')

    for(let picker of pickerSelects){
        replaceOneSelect(picker);
    }


}
replaceSelects();