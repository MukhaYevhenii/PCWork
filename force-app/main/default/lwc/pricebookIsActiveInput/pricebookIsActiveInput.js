import { LightningElement } from 'lwc';

import MS_Is_Active from '@salesforce/label/c.MS_Is_Active';


export default class PricebookIsActiveInput extends LightningElement {
    pricebookIsActive=true;

    label = {MS_Is_Active}
    handleKeyChange(event){
        this.pricebookIsActive = event.target.checked;
        const nameEvent = new CustomEvent("getpricebookisactive",{
            detail: this.pricebookIsActive
        });

        this.dispatchEvent(nameEvent);
    }
}