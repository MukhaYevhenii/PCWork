import { LightningElement, api, track} from 'lwc';
import PRODUCT_REVIEW_OBJECT from '@salesforce/schema/Product_Review__c';
import NAME_FIELD from '@salesforce/schema/Product_Review__c.Name';
import COMMENT_FIELD from '@salesforce/schema/Product_Review__c.Comment__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import MS_Review_Created from '@salesforce/label/c.MS_Review_Created';
import MS_Administrator_Check from '@salesforce/label/c.MS_Administrator_Check';
import MS_Admin from '@salesforce/label/c.MS_Admin';
import MS_Rating from '@salesforce/label/c.MS_Rating';

export default class CustomReviewForm extends LightningElement {
    productId;
    @track rating = 0;
    @api hasUserReview = false;
    @api acceptedReview = false;
    productReviewObject = PRODUCT_REVIEW_OBJECT;
    nameField = NAME_FIELD;
    commentField = COMMENT_FIELD;

    label = {
        MS_Admin,
        MS_Rating
    }

    @track isLoading = false;
    
    @api
    get recordId() {
        return this.productId;
    }
    
    set recordId(value) {
        this.setAttribute('productId', value);        
        this.productId = value;
    }
    
    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }
    
    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Rating__c = this.rating;
        fields.Product__c = this.productId;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
        this.isLoading= true;
        setTimeout(()=>{
            this.isLoading = false;
            this.rating = 0;
        },500);
    }
    
    handleSuccess() {
        const toast = new ShowToastEvent({
            title: MS_Review_Created,
            message: MS_Administrator_Check,
            variant: 'success',
        });
        this.dispatchEvent(toast);
        this.handleReset();
        this.handleSendRefreshEvent();
    }

    handleSendRefreshEvent(){
        const createReviewEvent = new CustomEvent('createreview');
        this.dispatchEvent(createReviewEvent);   
    }
    
    handleReset() {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => { field.reset(); });
        }
    }
}