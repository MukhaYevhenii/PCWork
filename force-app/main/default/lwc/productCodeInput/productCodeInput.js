import { LightningElement } from 'lwc';

export default class ProductCodeInput extends LightningElement {
    productCode='';
    handleProductCodeChange(event){
        this.productCode = event.target.value;
        const productCodeEvent = new CustomEvent("getproductcodevalue",{
            detail: this.productCode
        });

        this.dispatchEvent(productCodeEvent);
    }
}