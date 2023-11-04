import {
    createElement
} from "./element-tools.ts";
import "./elements"
import "./picker-styles.css"

function replaceOneSelect(select: Element){
    //showHideElement(select, false);

    let allOptions=[]
    let options=select.querySelectorAll("option")
    for(let option: Element of options){
        console.log(option.allAttributes)
        allOptions.push({
            label: option.innerHTML,
            value: option.value,
            selected: option.allAttributes.selected==''
        })
    }
    console.log(allOptions)

    let panel=createElement('div')
    panel.allAttributes={
        class: 'picker-panel',
    }
    for(let option of allOptions){
        let div=createElement('div');
        div.innerHTML=option.label;
        div.allAttributes={class: option.selected ? 'active picker-option': 'picker-option', data:{ value: option.value}};
        panel.appendChild(div);
    }
    //panel.changeVisibility(false);

    let element=createElement('button');
    element.allAttributes={
        class: 'form-control',
        type: 'button',
        style:{
            'text-align': 'left'
        }
    }
    element.addEventListener('click', function(){
        panel.changeVisibility(!panel.isVisible());
    })



    // element.setStyles({background: 'red', color: 'blue', cursor: 'pointer', class: 'test'})
    element.innerHTML="Hello super element nouveau!"

    select.changeVisibility(false);
    select.parentElement.appendChild(element);
    select.parentElement.appendChild(panel);

}

function replaceSelects(){

    let pickerSelects=document.querySelectorAll('.picker')

    for(let picker of pickerSelects){
        replaceOneSelect(picker);
    }


}
replaceSelects();