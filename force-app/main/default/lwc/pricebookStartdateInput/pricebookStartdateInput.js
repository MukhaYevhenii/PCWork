import { LightningElement } from 'lwc';

import MS_Start_date from '@salesforce/label/c.MS_Start_date';

export default class PricebookStartdateInput extends LightningElement {
    pricebookStartdate='';
    label = {MS_Start_date}
    handleKeyChange(event){
        this.pricebookStartdate = event.target.value;
        const nameEvent = new CustomEvent("getpricebookstartdate",{
            detail: this.pricebookStartdate
        });

        this.dispatchEvent(nameEvent);
    }
}