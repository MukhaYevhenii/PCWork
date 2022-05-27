import { LightningElement } from 'lwc';
import 	MS_Search_Product from '@salesforce/label/c.MS_Search_Product';

export default class ProductNameInput extends LightningElement {
    label = {MS_Search_Product}
    productName='';
    handleKeyChange(event){
        this.productName = event.target.value;
        const nameEvent = new CustomEvent("getproductname",{
            detail: this.productName
        });

        this.dispatchEvent(nameEvent);
    }
}