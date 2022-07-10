import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Product2.Name';

const fields = [NAME_FIELD];

export default class CustomOrderPageItem extends LightningElement {
    @api recordId;
    @api price;
    @api count;

    @wire(getRecord, {recordId: '$recordId', fields })
    product;

    get name(){
        return getFieldValue(this.product.data, NAME_FIELD);
    }

}