import {createElement, showHideElement} from "./element-tools.ts";

function replaceOneSelect(select: Element){
    //showHideElement(select, false);

    let element=createElement('div');
    element.innerHTML="Hello super element nouveau!"
    document.body.append(element);
}

function replaceSelects(){

    let pickerSelects=document.querySelectorAll('.picker')

    for(let picker of pickerSelects){
        replaceOneSelect(picker);
    }


}
replaceSelects();