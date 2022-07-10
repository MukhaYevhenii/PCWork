import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';

const fields = [NAME_FIELD, DISPLAYURL];

export default class CustomOrderProductsModalItem extends LightningElement {
    @api orderItem;
    @api productId = '';
    
    // @wire(getRecord, {recordId: this.productId, fields })
    // product;

    // get name(){
    //     return getFieldValue(this.product.data, NAME_FIELD);
    // }

    // get image(){
    //     return getFieldValue(this.product.data, DISPLAYURL);
    // }

}