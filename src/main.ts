import {
    createElement
} from "./element-tools.ts";
import "./elements"
import "./picker-styles.css"

class PickerOption{
    originalOption: Element
    label: string
    value: any
    isSelected: boolean
    isPanelSelected: boolean

    constructor(originalOption:Element) {
        this.originalOption=originalOption;
        this.setValuesWithOriginalElement();
    }

    private setValuesWithOriginalElement(){
        this.label=this.originalOption.innerHTML;
        this.value=this.originalOption.value;
        this.isSelected=this.originalOption.allAttributes.selected==''
    }
}

class PickerPanel{
    panel:Element
    optionsPanel:Element
    searchPanel:Element
    searchInput:Element
    pickerState:PickerState
    search: string

    constructor(pickerState: PickerState){
        this.pickerState=pickerState;
        this.createPanel();
        this.updateOptionsPanel();
        this.pickerState.originalSelect.parentElement.appendChild(this.panel);
    }

    updateOptionsPanel(){
        this.optionsPanel.innerHTML=''
        for(let option of this.pickerState.filteredOptions){
            let div=createElement('div');
            div.innerHTML=option.label;
            div.allAttributes={class: option.isSelected ? 'active picker-option': 'picker-option', data:{ value: option.value}};
            this.optionsPanel.appendChild(div);
        }
    }

    getOptionByValue(value:String):PickerOption|null{
        return this.pickerState.allOptions.find(o=>o.value===value);
    }
    selectOptionByValue(value:String){
        let option=this.getOptionByValue(value)
        this.selectOption(option)
    }
    selectOption(option: PickerOption|null){
        if(option){
            if(!this.pickerState.isMultiSelect){
                this.pickerState.allOptions.map(o=>o.isSelected=false);
            }
            option.isSelected=true
            this.updateOptionsPanel();
            this.pickerState.updateButtonLabel();
        }
    }

    createPanel(){
        this.panel=createElement('div')
        this.panel.allAttributes={
            class: 'picker-panel',
            style:{
                display: 'none'
            }
        }
        this.searchPanel=createElement('div')
        this.searchPanel.allAttributes={
            class: 'picker-search'
        }
        this.searchInput=createElement('input');
        this.searchInput.allAttributes={
            class: 'form-control',
            placeholder: 'Search....'
        }
        this.searchInput.addEventListener('keyup', function(event){
            if(event.key=='Enter'){
                event.preventDefault();
            }
            that.search=this.value;
            that.filterSearch();
            if(that.pickerState.filteredOptions.length>0){
                that.selectOption(that.pickerState.filteredOptions[0])
            }
        })
        this.searchPanel.appendChild(this.searchInput);


        this.panel.appendChild(this.searchPanel);

        this.optionsPanel=createElement('div');
        this.panel.appendChild(this.optionsPanel);

        let that=this
        this.optionsPanel.addEventListener('click', function(event){
           if(event.target.matches('.picker-option')){
               that.selectOptionByValue(event.target.dataset.value)
               that.togglePanel(false);
           }
        });

        document.body.addEventListener('keydown', function(event){
            if(that.isVisible()){
                console.log(event.key);
                switch(event.key){
                    case 'Escape':
                        that.togglePanel(false);
                        break
                    case 'ArrowDown':
                        console.log('netOption');
                        that.selectNextOption();
                        break
                    case 'ArrowUp':
                        console.log('previousOption');
                        that.selectPreviousOption();
                        break;
                }
            }
        })



        // let that=this
        // this.panel.addEventListener('click', function(event){
        //     that.allOptions.map(o=>o.isSelected=false);
        //     let selectedOption=that.allOptions.find(o=>o.value===event.target.dataset.value)
        //     selectedOption.isSelected=true;
        //     that.updatePanel();
        //     that.updateButtonLabel();
        //     that.panel.changeVisibility(false);
        // })
        // this.originalSelect.parentElement.appendChild(this.panel);
    }

    selectPreviousOption(){
        this
    }

    selectNextOption(){

    }

    selectOption(offset=1){

    }

    public filterSearch(){
        let filtered=[]
        for(let option of this.pickerState.allOptions){
            if(option.label.toLowerCase().includes(this.search.toLowerCase())){
                filtered.push(option);
            }
        }
        this.pickerState.filteredOptions=filtered;

        this.updateOptionsPanel();
    }

    public togglePanel(isVisible:boolean){
        this.panel.changeVisibility(isVisible);
    }

    public isVisible():boolean{
        return this.panel.isVisible();
    }
}

class PickerState{
    isMultiSelect: boolean
    originalSelect: Element
    panel:PickerPanel
    button: Element
    allOptions: PickerOption[]
    filteredOptions: PickerOption[]
    get selectedOptions():PickerOption[]{
        return this.allOptions.filter(o => o.isSelected)
    }

    constructor(originalSelect:Element) {
        this.originalSelect=originalSelect;
        this.filteredOptions=[];
        this.fillAlOptions();
        this.createButton();
        this.updateButtonLabel();
        this.createPanel();
        //this.updatePanel();
    }

    createButton(){
        this.button=createElement('button');
        this.button.allAttributes={
            class: 'form-control',
            type: 'button',
            style:{
                'text-align': 'left'
            }
        }
        let that=this
        this.button.addEventListener('click', function(){
            that.panel.togglePanel(!that.panel.isVisible());
        })
        this.originalSelect.parentElement.appendChild(this.button);
        this.originalSelect.changeVisibility(false);
    }

    updateButtonLabel(){
        this.button.innerHTML=this.allOptions.find(o=>o.isSelected).label
    }

    fillAlOptions(){
        let options=this.originalSelect.querySelectorAll("option")
        this.allOptions=[]
        for(let option: Element of options){
            let newOption=new PickerOption(option);
            this.allOptions.push(newOption)
            this.filteredOptions.push(newOption)
        }
    }
    createPanel(){
        this.panel=new PickerPanel(this);
    }

    // updatePanel(){
    //     this.panel.innerHTML=''
    //     for(let option of this.allOptions){
    //         let div=createElement('div');
    //         div.innerHTML=option.label;
    //         div.allAttributes={class: option.isSelected ? 'active picker-option': 'picker-option', data:{ value: option.value}};
    //         this.panel.appendChild(div);
    //     }
    // }

    // removePanel(){
    //     this.panel.remove();
    //     this.panel=null;
    // }
}

function replaceOneSelect(select: Element){
    new PickerState(select);
    //showHideElement(select, false);

    // let allOptions=[]
    // let options=select.querySelectorAll("option")
    // for(let option: Element of options){
    //     console.log(option.allAttributes)
    //     allOptions.push({
    //         label: option.innerHTML,
    //         value: option.value,
    //         selected: option.allAttributes.selected==''
    //     })
    // }

    // let panel=createElement('div')
    // panel.allAttributes={
    //     class: 'picker-panel',
    // }
    // for(let option of allOptions){
    //     let div=createElement('div');
    //     div.innerHTML=option.label;
    //     div.allAttributes={class: option.selected ? 'active picker-option': 'picker-option', data:{ value: option.value}};
    //     panel.appendChild(div);
    // }
    //panel.changeVisibility(false);

    // let element=createElement('button');
    // element.allAttributes={
    //     class: 'form-control',
    //     type: 'button',
    //     style:{
    //         'text-align': 'left'
    //     }
    // }
    // element.addEventListener('click', function(){
    //     panel.changeVisibility(!panel.isVisible());
    // })
    // panel.addEventListener('click', function(event){
    //     allOptions.map(o=>o.selected=false);
    //     let selectedOption=allOptions.find(o=>o.value===event.target.dataset.value)
    //     selectedOption.selected=true;
    //     console.log('event', event.target.dataset.value);
    // })



    // element.setStyles({background: 'red', color: 'blue', cursor: 'pointer', class: 'test'})
    // element.innerHTML=allOptions.find(o=>o.selected).label

    // select.changeVisibility(false);
    // select.parentElement.appendChild(element);
    // select.parentElement.appendChild(panel);

}

function replaceSelects(){

    let pickerSelects=document.querySelectorAll('.picker')

    for(let picker of pickerSelects){
        replaceOneSelect(picker);
    }


}
replaceSelects();