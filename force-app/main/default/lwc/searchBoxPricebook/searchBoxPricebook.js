import { LightningElement, wire, track } from 'lwc';
import getPricebook from '@salesforce/apex/PW_CustomSearchPricebook.getPricebook';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { publish, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/Record_Select__c';

import MS_Record_Not_Found from '@salesforce/label/c.MS_Record_Not_Found';
import MS_Fields_Empty from '@salesforce/label/c.MS_Fields_Empty';
import MS_Search from '@salesforce/label/c.MS_Search';
import MS_Search_Product from '@salesforce/label/c.MS_Search_Product';
import MS_Clear from '@salesforce/label/c.MS_Clear';
import MS_New_Pricebook from '@salesforce/label/c.MS_New_Pricebook';



const cols = [
    { label: "Name", fieldName:'Url', type: 'url',  typeAttributes: {label: { fieldName: 'UrlName' }}},
    { label: "Start date", fieldName:'Start_Date__c', type: 'date', typeAttributes:
    {year: "numeric",
    month: "long",
    day: "2-digit",}},
    { label: "End date", fieldName:'End_Date__c', type: 'date', typeAttributes:
    {year: "numeric",
    month: "long",
    day: "2-digit",}},
    { label: "IsActive", fieldName:'IsActive', type: 'boolean'},
];
export default class SearchBoxPricebook extends NavigationMixin(LightningElement){
    @wire(MessageContext)
    messageContext;
    label = {
        MS_Search,
        MS_Search_Product,
        MS_Clear,
        MS_New_Pricebook
    }
    @track pricebookName;
    @track modalTemplateOpen = false;
    @track isActive;
    @track startDate;
    @track endDate;
    @track pricebookList = [];
    @track isLoading = false;
    @track isNotEmpty = false;

    handleEndDateChanged(event){
        this.endDate = event.detail;
    }

    handlePricebookSelect(event){
        const payload = {recordId: event.target.pricebook.Id};
        publish(this.messageContext, recordSelected, payload);
    }

    handleChangeModalOpen(event){
        this.modalTemplateOpen = event.detail;
    }

    openNewProductModal(){
        this.modalTemplateOpen = true;
    }

    get columns(){
        return cols;
    }

    handleStartDateChanged(event){
        this.startDate = event.detail;
    }

    handleProducerChange(event){
        this.producerValue = event.detail;
    }

    handleIsActiveChange(event){
        this.isActive = event.detail;
    }

    handleNameChange(event){
        this.pricebookName = event.detail;
    }

    handleSearchKeyword(){
        this.isLoading = true;
        console.log(this.startDate, this.endDate, this.pricebookName);
        if (this.pricebookName !== undefined || this.startDate !== undefined || this.endDate !== undefined) {
            getPricebook({
                pricebookName: this.pricebookName,
                isActive: this.isActive,
                startDatetime: new Date(this.startDate),
                endDatetime: new Date (this.endDate)
                })
                .then(result => {
                    this.pricebookList = [];
                    result.forEach(r=> {
                        let record =  Object.assign({}, r);
                        record.Url = `/lightning/r/Pricebook2/${r.Id}/view`;
                        record.UrlName = r.Name;
                        record.Name = r.Name;

                        this.pricebookList.push(record);
                    });
                    if(this.pricebookList.length === 0) {
                        this.isNotEmpty = false;
                        this.isLoading = false;
                        const event = new ShowToastEvent({
                            message: MS_Record_Not_Found
                        });
                        this.dispatchEvent(event); 
                    } else {
                        this.isNotEmpty = true;
                        this.isLoading = false;
                    }
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    this.pricebookList = null;
                    this.isNotEmpty = false;
                    this.isLoading = false;
                });
        } else {
            this.isNotEmpty = false;
            const event = new ShowToastEvent({
                message: MS_Fields_Empty
            });
            this.dispatchEvent(event);   
            this.isLoading = false;
        }
    }

    handleClearKeyword(){
        this.isLoading = true;
        this.pricebookName = '';
        this.isActive = false; 
        this.startDate = '';
        this.endDate = '';
        this.isNotEmpty = false;
        this.isLoading = false;
        eval("$A.get('e.force:refreshView').fire();");
    }
}