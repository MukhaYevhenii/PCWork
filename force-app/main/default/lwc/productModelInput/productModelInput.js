import { LightningElement, wire } from 'lwc';

export default class ProductModelInput extends LightningElement {
    model='';
    handleChange(event){
        this.model = event.target.value;
        const modelEvent = new CustomEvent("getmodelvalue",{
            detail: this.model
        });

        this.dispatchEvent(modelEvent);
    }
}