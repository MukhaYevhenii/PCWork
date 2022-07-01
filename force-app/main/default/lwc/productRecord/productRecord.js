import { LightningElement, api } from 'lwc';

export default class ProductRecord extends LightningElement {
    @api productRecord;
    @api usingPrice = false;

    sfdcBaseURL;    
    
    renderedCallback() {
        let baseURL = '/s';
        this.sfdcBaseURL = baseURL.concat('/detail/',this.productRecord.Id);
    }
}