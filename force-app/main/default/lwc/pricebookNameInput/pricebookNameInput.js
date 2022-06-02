import { LightningElement } from 'lwc';

import MS_Pricebook_Name_Placeholder from '@salesforce/label/c.MS_Pricebook_Name_Placeholder';


export default class PricebookNameInput extends LightningElement {
    pricebookName='';
    label = {MS_Pricebook_Name_Placeholder}

    handleKeyChange(event){
        this.pricebookName = event.target.value;
        const nameEvent = new CustomEvent("getpricebookname",{
            detail: this.pricebookName
        });

        this.dispatchEvent(nameEvent);
    }
}