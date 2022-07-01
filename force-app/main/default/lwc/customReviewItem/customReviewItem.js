import { LightningElement, api, track, wire } from 'lwc';
import uId from '@salesforce/user/Id';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import userHasReviewCheck from '@salesforce/apex/PW_ProductPage.userHasReviewCheck';
import { refreshApex } from "@salesforce/apex";

import MS_Review_Deleted from '@salesforce/label/c.MS_Review_Deleted';

export default class CustomReviewItem extends LightningElement {
    @api productReview;
    userId = uId;
    @track deleteIcon;
    @api productId;
    isLoading;
    wiredActivities;
    @track isModalOpen = false;

    connectedCallback(){
        if(this.productReview.CreatedById == this.userId){
            this.deleteIcon = true;
        }else{
            this.deleteIcon = false;
        }
    }

    handleOpenEditModal(){
        this.isModalOpen = true;
    }

    handleCloseEditModal(){
        this.isModalOpen = false;
    }

 
    @wire(userHasReviewCheck, {userID: '$userId', productId: '$productId'})
    wiredResulted(result){
        this.wiredActivities = result;
        const{data, error} = result;
            if(data){
                if(data.length != 0){
                    const hasReview = new CustomEvent('hasreview', {detail: data[0].AcceptReview__c});
                    this.dispatchEvent(hasReview);  
                }
            }
        if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title:  error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    handleSendDeleteRevieEvent(){
        const deleteReviewEvent = new CustomEvent('deletereview');
        this.dispatchEvent(deleteReviewEvent);  
    }

    handleRefreshApexEvent(){
        refreshApex(this.wiredActivities);
        const refreshpPrintList = new CustomEvent('refreshprintlist');
        this.dispatchEvent(refreshpPrintList);   
    }

    handleDeleteReview(){
        this.isLoading = true;
        deleteRecord(this.productReview.Id)
        .then(() => {
            refreshApex(this.wiredActivities);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Review_Deleted,
                    variant: 'success'
                })
            );
            setTimeout(()=>{
                this.isLoading = false;
                this.handleSendDeleteRevieEvent();
            },1000);
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}