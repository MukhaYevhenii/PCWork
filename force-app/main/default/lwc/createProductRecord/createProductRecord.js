import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

import MS_Product_Created_Success from '@salesforce/label/c.MS_Product_Created_Success';
import MS_Product_Create_ID from '@salesforce/label/c.MS_Product_Create_ID';
import MS_Cancel_Button from '@salesforce/label/c.MS_Cancel_Button';
import MS_SaveNext from '@salesforce/label/c.MS_SaveNext';
import MS_Price from '@salesforce/label/c.MS_Price';



export default class CreateProductRecord extends LightningElement {
    label = {
        MS_Cancel_Button,
        MS_SaveNext,
        MS_Price
    }
    @track productPrice;
    @track isModalImageOpen = false;
    @track isModalOpen = true;
    @track Id;

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handlePriceChange(event){
        this.productPrice = event.target.value;
    }

    handleSubmit(event){
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
        this.closeModal();
    }

    handleSuccess(event){
        const recordId = event.detail.id;
        const toastEvent = new ShowToastEvent ({
            title: MS_Product_Created_Success,
            message: MS_Product_Create_ID + recordId,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);

        this.Id = recordId;
        let fields = {'Pricebook2Id' : '01s7Q000007TMpKQAW', 'Product2Id' : recordId, 'UnitPrice' : this.productPrice};
        let objRecordInput = {'apiName' : 'PricebookEntry', fields};
        createRecord(objRecordInput).then(response => {
        }).catch(error => {
        });

        this.isModalImageOpen = true;
    }
} 