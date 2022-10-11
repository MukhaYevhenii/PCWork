import { LightningElement,track, api} from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import RATING_FIELD from '@salesforce/schema/Product_Review__c.Rating__c';
import PRODUCT_REVIEW_OBJECT from '@salesforce/schema/Product_Review__c';
import NAME_FIELD from '@salesforce/schema/Product_Review__c.Name';
import COMMENT_FIELD from '@salesforce/schema/Product_Review__c.Comment__c';
import REVIEW_ID from '@salesforce/schema/Product_Review__c.Id';
import ACCEPTED_REVIEW from '@salesforce/schema/Product_Review__c.AcceptReview__c';

import MS_Edit_Label from '@salesforce/label/c.MS_Edit_Label';
import MS_User_Review from '@salesforce/label/c.MS_User_Review';
import MS_Cancel_Button from '@salesforce/label/c.MS_Cancel_Button';
import MS_Submit from '@salesforce/label/c.MS_Submit';
import MS_Updated_Review from '@salesforce/label/c.MS_Updated_Review';
import MS_Administrator_Check from '@salesforce/label/c.MS_Administrator_Check';
import MS_Updating_Review from '@salesforce/label/c.MS_Updating_Review';

const fields = [RATING_FIELD, PRODUCT_REVIEW_OBJECT,NAME_FIELD, COMMENT_FIELD];

export default class ModalPopupLWC extends LightningElement {
    @track isModalOpen = true;
    @api productReview;
    @track rating = 0;
    @track name;
    @track comment;
    @track isLoading = false;
    disabled = true;

    label={
        MS_Edit_Label, 
        MS_User_Review,
        MS_Cancel_Button, 
        MS_Submit
    }

    productReviewObject = PRODUCT_REVIEW_OBJECT;
    nameField = NAME_FIELD;
    commentField = COMMENT_FIELD;

    closeModal() {
        this.isModalOpen = false;
        this.handleSendEventCloseModal();
    }

    connectedCallback(){
        this.rating = this.productReview.Rating__c;
        this.name = this.productReview.Name;
        this.comment = this.productReview.Comment__c;
    }

    handleUpdateRatingField(){
        const fieldRatingToUpate = {};
        fieldRatingToUpate[REVIEW_ID.fieldApiName] = this.productReview.Id;
        fieldRatingToUpate[RATING_FIELD.fieldApiName] = this.rating;
        fieldRatingToUpate[ACCEPTED_REVIEW.fieldApiName] = false;
        const recordInput = {fields: fieldRatingToUpate};
        setTimeout(()=>{
            this.isLoading = false;
        },2000);
        updateRecord(recordInput)
                .then(() => {
                    const updatedreview = new CustomEvent('updatedreview');
                    this.dispatchEvent(updatedreview);  
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: MS_Updating_Review,
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });

    }

    submitDetails(event) {
        event.preventDefault();
        this.isLoading = true;
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
        this.handleUpdateRatingField();
    
        const toastEvent = new ShowToastEvent ({
            title: MS_Updated_Review,
            message: MS_Administrator_Check,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);

        this.handleSendEventCloseModal();
        this.isModalOpen = false;
    }

    handleSuccess(){
        this.handleSendEventCloseModal();
        this.isModalOpen = false;
    }

    handleChangeName(event) {
        this.name = event.target.value;
        this.checkActualValues();
    }

    handleChangeComment(event) {
        this.comment = event.target.value;
        this.checkActualValues();
    }

    handleSendEventCloseModal(){
        const closed = new CustomEvent('closed');
        this.dispatchEvent(closed);  
    }

    handleRatingChanged(event) {
        this.rating = event.detail.rating;
        this.checkActualValues();
    }

    checkActualValues(){
        if(this.productReview.Rating__c != this.rating || this.productReview.Name != this.name ||  this.productReview.Comment__c != this.comment){
            this.disabled = false;
        }else{
            this.disabled = true;
        }
    }
}