import { api, wire, track, LightningElement } from 'lwc';
import getAllReviews from '@salesforce/apex/PW_ProductPage.getAllReviews';
import userHasReviewCheck from '@salesforce/apex/PW_ProductPage.userHasReviewCheck';
import { NavigationMixin } from 'lightning/navigation';
import uId from '@salesforce/user/Id';

const PAGE_SIZE = 2;

export default class CustomReviewPrint extends LightningElement {
    productId;
    error;
    page = 1;
    total;
    productAllReviews;
    userId = uId;
    numberOfNotAccepted = 0;
    wiredActivities;
    @track startReview = 0;
    @track pages;
    @track productReviews;

    navigateToRecord(event) { 
        event.preventDefault();
        event.stopPropagation();
        let recordId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: "User",
                actionName: "view"
            },
        });
    }
    
     getReviews() {
        if (this.productId) {
            getAllReviews({productId: this.productId}).then((result) => {
                this.productAllReviews = result;
                this.total = this.productAllReviews.length;
                if((this.startReview + PAGE_SIZE) > this.total-1){
                    this.productReviews = this.productAllReviews.slice(this.startReview,this.total);
                }else{
                    this.productReviews = this.productAllReviews.slice(this.startReview,this.startReview + PAGE_SIZE);
                }
                let pagesNumber = this.productAllReviews.length / PAGE_SIZE;
                this.pages = Math.ceil(pagesNumber);
                this.error = undefined;
            }).catch((error) => {
                this.error = error;
            }).finally(() => {
            });
        } else {
            return;
        }
    }

    @wire(userHasReviewCheck, {userID: '$userId', productId: '$productId'})
    wiredResulted(result){
        this.wiredActivities = result;
        const{data, error} = result;
            if(data){
                if(data.length != 0){
                    const hasReviewFromItem = new CustomEvent('hasreviewfromitem', {detail: data[0].AcceptReview__c});
                    this.dispatchEvent(hasReviewFromItem);  
                }
            }
        if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    Title: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    handlePagePrevious() {
        this.page = this.page - 1;
        this.startReview = this.page * PAGE_SIZE - 2;
        this.getReviews();
    }

    handlePageNext() {
        this.page = this.page + 1;
        this.startReview = this.page * PAGE_SIZE - 2;
        this.getReviews();
    }

    handleSendRefreshEvent(){
        const deleteReviewUser = new CustomEvent('deletereviewuser');
        this.dispatchEvent(deleteReviewUser);  
        setTimeout(()=>{
            this.refresh();
        },500);
    }

    handleHasReviewCheck(event){
        const hasReviewFromItem = new CustomEvent('hasreviewfromitem', {detail: event.detail});
        this.dispatchEvent(hasReviewFromItem);  
    }

    handleRefreshEventList(){
        const changeStatus = new CustomEvent('changestatusafterupdate');
        this.dispatchEvent(changeStatus);  
        this.refresh();
    }
    
    get recordId() {
        return this.productId;
    }
    
    get reviewsToShow() {
        return this.productReviews !== undefined && this.productReviews != null && this.productReviews.length  > 0;
    }

    @api
    set recordId(value) {
        this.setAttribute('productId', value);        
        this.productId = value;      
        this.getReviews();
    }

    @api
    refresh() {
        this.getReviews();
    }
}