import {
    createElement, createSvg
} from "./element-tools.ts";
import "./elements"
import "./picker-styles.css"

class PickerOption{
    originalOption: Element
    label: any
    value: any
    isSelected: boolean
    isPanelSelected: boolean
    id: number
    static GLOBAL_ID=0

    constructor(originalOption:Element) {
        this.id=PickerOption.GLOBAL_ID++;
        this.isPanelSelected=false;
        this.originalOption=originalOption;
        this.setValuesWithOriginalElement();
    }

    private setValuesWithOriginalElement(){
        if(this.originalOption.allAttributes['data-html']){
            this.label=this.originalOption.allAttributes['data-html'];
        }else{
            this.label=this.originalOption.innerHTML;
        }
        this.value=this.originalOption.value;
        this.isSelected=this.originalOption.selected;
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
            let classes=['picker-option']
            if( option.isPanelSelected){
                classes.push('picker-selected')
            }else if (option.isSelected){
                classes.push('picker-active')
            }
            div.allAttributes={class: classes.join(' '), data:{ value: option.value, id: option.id}};
            this.optionsPanel.appendChild(div);
        }
        this.scrollToPanelSelectedElement();
    }

    getOptionByValue(value:String):PickerOption|null{
        return this.pickerState.allOptions.find(o=>o.value===value);
    }

    selectOptionByValue(value:String, wantPanelSelect:boolean=true){
        let option=this.getOptionByValue(value)
        this.selectOptions([option], wantPanelSelect)
    }

    selectOptions(options: PickerOption[]|null, wantPanelSelect:boolean=true){
        if(options!==null || options.length<=0){
            if(!this.pickerState.isMultiSelect){
                if(wantPanelSelect){
                    this.pickerState.allOptions.map(o=>o.isPanelSelected=false);
                }else{
                    this.pickerState.allOptions.map(o=>o.isSelected=false);
                }
            }
            if(wantPanelSelect){
                for(let option of options){
                    option.isPanelSelected=!option.isPanelSelected;
                }

            }else{
                for(let option of options){
                    option.isSelected=!option.isSelected;
                }
            }
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
            that.pickerState.keyCounter+=1
            switch(event.key){
                case 'Enter':
                    event.preventDefault();
                    if(that.pickerState.keyCounter>1){
                        that.selectOptions([that.pickerState.selectedPanelOption], false);
                        if(!that.pickerState.isMultiSelect && that.isVisible()){
                            that.togglePanel(false);
                        }
                    }
                    break;
                case 'Escape':
                    that.togglePanel(false);
                    break
                case 'ArrowDown':
                case 'ArrowUp':
                    break;
                default:
                    that.search=this.value;
                    that.filterSearch();
                    if(that.pickerState.filteredOptions.length>0){
                        that.selectOptions([that.pickerState.filteredOptions[0]])
                    }
                    break;
            }

        })
        this.searchPanel.appendChild(this.searchInput);
        this.panel.appendChild(this.searchPanel);

        this.optionsPanel=createElement('div');
        this.optionsPanel.allAttributes={class: 'option-panel'}
        this.panel.appendChild(this.optionsPanel);

        let that=this
        this.optionsPanel.addEventListener('click', function(event){
           if(event.target.matches('.picker-option')){
               that.selectOptionByValue(event.target.dataset.value, false)
               that.togglePanel(false);
           }
        });

        document.body.addEventListener('keydown', function(event){
            if(that.isVisible()){
                switch(event.key){
                    case 'Enter':
                        event.preventDefault();
                        break;
                    case 'ArrowDown':
                        that.selectNextOption();
                        break
                    case 'ArrowUp':
                        that.selectPreviousOption();
                        break;
                }
            }
        })

        document.body.addEventListener('click', function(event){
            if(that.isVisible()){
                if(!that.panel.contains(event.target) && !that.pickerState.button.contains(event.target)){
                    that.togglePanel(false);
                }
            }
        })
    }

    selectPreviousOption(){
        this.selectPrevOrNextOption(-1)
    }

    selectNextOption(){
        this.selectPrevOrNextOption()
    }

    selectPrevOrNextOption(offset=1){
        let panelOption=this.pickerState.selectedPanelOption
        if(panelOption){
            let value=panelOption.value as string
            let index = this.pickerState.filteredOptions.findIndex(o=>o.value===value)
            if(index!=-1){
                index+=offset
                index%=this.pickerState.filteredOptions.length
                if(index==-1){
                    index=this.pickerState.filteredOptions.length-1;
                }
                this.pickerState.filteredOptions.map(o=>o.isPanelSelected=false);
                this.pickerState.filteredOptions[index].isPanelSelected=true;
            }
        }
        this.updateOptionsPanel();
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
        if(isVisible){
            this.pickerState.keyCounter=0
            this.searchInput.focus();
            this.searchInput.value='';
            this.pickerState.fillAllOptions();
            if(this.pickerState.selectedOptions.length>0){
                this.pickerState.selectedOptions[0].isPanelSelected=true;
            }
            if(!this.pickerState.selectedPanelOption){
                this.pickerState.allOptions[0].isPanelSelected=true;
            }
            this.updateOptionsPanel();
        }else{
            this.pickerState.button.focus();
        }
    }

    scrollToPanelSelectedElement(){
        let selectedOption=this.pickerState.selectedPanelOption;
        if(selectedOption){
            let selectedPanelOption=this.optionsPanel.querySelector(`[data-id="${selectedOption.id}"]`);
            if(selectedPanelOption){
                selectedPanelOption.scrollIntoView({block: 'center'});
            }
        }
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
    buttonSelection: Element
    allOptions: PickerOption[]
    filteredOptions: PickerOption[]
    keyCounter:Number

    get selectedOptions():PickerOption[]{
        return this.allOptions.filter(o => o.isSelected)
    }

    get selectedPanelOption():PickerOption|null{
        return this.allOptions.find(o => o.isPanelSelected)
    }

    constructor(originalSelect:Element) {
        this.keyCounter=0;
        this.originalSelect=originalSelect;
        this.isMultiSelect=originalSelect.allAttributes.multiple==='';
        this.filteredOptions=[];
        this.fillAllOptions();
        this.createButton();
        this.updateButtonLabel();
        this.createPanel();
    }

    createButton(){
        this.button=createElement('button');
        this.button.allAttributes={
            class: 'form-control picker-button',
            type: 'button',
            style:{
                'text-align': 'left'
            }
        }
        let that=this
        this.button.addEventListener('click', function(){
            that.panel.togglePanel(!that.panel.isVisible());
        });
        this.button.addEventListener('dblclick', function(){
            if(!that.isMultiSelect){
                that.panel.selectNextOption();
                that.panel.selectOptions([that.selectedPanelOption], false);
            }
        })
        let svg=createSvg("<svg fill=\"currentColor\" class=\"picker-caret\" xmlns=\"http://www.w3.org/2000/svg\" height=\"1em\" viewBox=\"0 0 448 512\"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d=\"M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z\"/></svg>")
        this.buttonSelection=createElement('span');
        this.buttonSelection.allAttributes={class: 'picker-button-text'}
        this.button.appendChild(this.buttonSelection);
        this.button.appendChild(svg);

        this.originalSelect.parentElement.appendChild(this.button);
        this.originalSelect.changeVisibility(false);
    }

    updateButtonLabel(){
        let selectedOptions=this.selectedOptions
        if(selectedOptions.length>0) {
            if(this.isMultiSelect){
                if(selectedOptions.length==1){
                    this.buttonSelection.innerHTML = selectedOptions[0].label;
                }else{
                    this.buttonSelection.innerHTML = `${selectedOptions.length} items selected`;
                }
            }else{
                this.buttonSelection.innerHTML = selectedOptions[0].label;
            }
        }else{
            this.buttonSelection.innerHTML='No selection'
        }
        this.updateUnderlyingSelect()
    }

    updateUnderlyingSelect(){
        //this.originalSelect.changeVisibility(true);
        let allOptions=this.originalSelect.querySelectorAll('option')
        let allSelectedValues=this.selectedOptions.map(o=>o.value);
        for(let option of allOptions){
            if(allSelectedValues.includes(option.value)){
                option.selected=true
            }else{
                option.selected=false
            }
        }
    }

    fillAllOptions(){
        let options=this.originalSelect.querySelectorAll("option")
        this.allOptions=[]
        this.filteredOptions=[]
        for(let option: Element of options){
            let newOption=new PickerOption(option);
            this.allOptions.push(newOption)
            this.filteredOptions.push(newOption)
        }
    }
    createPanel(){
        this.panel=new PickerPanel(this);
    }
}

function replaceOneSelect(select: Element){
    new PickerState(select);
}

function replaceSelects(){

    let pickerSelects=document.querySelectorAll('.picker')

    for(let picker of pickerSelects){
        replaceOneSelect(picker);
    }


    let add=document.getElementById('add')
    let label=createElement('label');
    label.innerHTML="Un super test!"
    label.allAttributes={for: 'select'}
    let select=createElement('select')
    select.allAttributes={class: 'form-select picker', id: 'select'}
    for(let i=0; i<10000; i++){
        let newOption=createElement('option');
        newOption.allAttributes={value: i}
        newOption.innerHTML=`Valeur ${i}`
        select.appendChild(newOption);
    }
    add.appendChild(select);
    add.appendChild(label);

    replaceOneSelect(select);


}
replaceSelects();