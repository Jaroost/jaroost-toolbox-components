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
        this.isPanelSelected=false;
        this.originalOption=originalOption;
        this.setValuesWithOriginalElement();
    }

    private setValuesWithOriginalElement(){
        this.label=this.originalOption.innerHTML;
        this.value=this.originalOption.value;
        this.isSelected=this.originalOption.selected;
        console.log(this.isSelected, this.value);
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
            if(option.isSelected){
                classes.push('active')
            }else if (option.isPanelSelected){
                classes.push('selected')
            }
            div.allAttributes={class: classes.join(' '), data:{ value: option.value}};
            this.optionsPanel.appendChild(div);
        }
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
                    that.selectOptions([that.pickerState.selectedPanelOption], false);
                    if(!that.pickerState.isMultiSelect && that.isVisible() && that.pickerState.keyCounter>1){
                        that.togglePanel(false);
                    }
                    break;
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
                if(event.key=='Enter'){
                    event.preventDefault();
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
            this.updateOptionsPanel();
        }else{
            this.pickerState.button.focus();
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
        let selectedOptions=this.selectedOptions
        if(selectedOptions.length>0) {
            if(this.isMultiSelect){
                if(selectedOptions.length==1){
                    this.button.innerHTML = selectedOptions[0].label;
                }else{
                    this.button.innerHTML = `${selectedOptions.length} items selected`;
                }
            }else{
                this.button.innerHTML = selectedOptions[0].label;
            }
        }else{
            this.button.innerHTML='No selection'
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