import { LightningElement, api } from 'lwc';

export default class ProductRecord extends LightningElement {
    @api productRecord;
    @api usingPrice = false;
}