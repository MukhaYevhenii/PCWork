import { LightningElement, wire } from 'lwc';
import MS_Model_Placeholder from '@salesforce/label/c.MS_Model_Placeholder';

export default class ProductModelInput extends LightningElement {
    label = {MS_Model_Placeholder}
    model='';
    handleChange(event){
        this.model = event.target.value;
        const modelEvent = new CustomEvent("getmodelvalue",{
            detail: this.model
        });

        this.dispatchEvent(modelEvent);
    }
}