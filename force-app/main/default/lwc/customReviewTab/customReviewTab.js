import { track, api, LightningElement } from 'lwc';

export default class CustomReviewTab extends LightningElement {
    productId;
    @track hasUserReview = false;
    @track acceptedReview = false;

    get recordId() {
        return this.productId;
    }
    
    @api
    set recordId(value) {
        this.setAttribute('productId', value);        
        this.productId = value;      
    }

    handleReviewCreated(){
        this.template.querySelector('c-custom-review-print').refresh();
        this.hasUserReview = true;
        this.acceptedReview = false;
    }

    handleUserHasReview(event){
        this.acceptedReview = event.detail;
        this.hasUserReview = true;
    }
    
    handleUserDeleteReview(){
        this.acceptedReview = false;
        this.hasUserReview = false;
    }

    handleChangeStatusUpdate(){
        this.hasUserReview = true;
        this.acceptedReview = false;
    }
}