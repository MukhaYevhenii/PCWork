import { LightningElement } from 'lwc';

import MS_End_Date_Placeholder from '@salesforce/label/c.MS_End_Date_Placeholder';

export default class PricebookEnddateInput extends LightningElement {
    pricebookEnddate='';

    label = {MS_End_Date_Placeholder}

    handleKeyChange(event){
        this.pricebookEnddate = event.target.value;
        const nameEvent = new CustomEvent("getpricebookenddate",{
            detail: this.pricebookEnddate
        });

        this.dispatchEvent(nameEvent);
    }
}