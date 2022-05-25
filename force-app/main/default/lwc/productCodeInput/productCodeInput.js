import { LightningElement } from 'lwc';
import MS_Product_Code_Placeholder from '@salesforce/label/c.MS_Product_Code_Placeholder';

export default class ProductCodeInput extends LightningElement {
    label = {MS_Product_Code_Placeholder}
    productCode='';
    handleProductCodeChange(event){
        this.productCode = event.target.value;
        const productCodeEvent = new CustomEvent("getproductcodevalue",{
            detail: this.productCode
        });

        this.dispatchEvent(productCodeEvent);
    }
}