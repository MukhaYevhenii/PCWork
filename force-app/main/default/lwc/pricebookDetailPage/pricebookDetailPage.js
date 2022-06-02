import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/Record_Select__c';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import PRICEBOOK_NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import { NavigationMixin } from 'lightning/navigation';
const PRICEBOOK_FIELDS = [PRICEBOOK_NAME_FIELD];

import MS_Pricebook_Product from '@salesforce/label/c.MS_Pricebook_Product';
import MS_Select_Pricebook from '@salesforce/label/c.MS_Select_Pricebook';



export default class PricebookDetailPage extends NavigationMixin(LightningElement) {
    subscription = null;
    @wire(MessageContext)
    messageContext;
    recordId = '';
    _wiredResult;

    label = {MS_Pricebook_Product, MS_Select_Pricebook}

    @wire(getRecord, {
        recordId: '$recordId',
        fields: PRICEBOOK_FIELDS
      })
      pricebook2;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
          this.messageContext,
          recordSelected,
          (message) => this.handleMessage(message)
        );
    }

    handleMessage(message){
        this.recordId = message.recordId;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: "Pricebook2",
                actionName: "view"
            },
        });
    }

    get pricebookName(){
        return getFieldValue(this.pricebook2.data,PRICEBOOK_NAME_FIELD );
    }

    get column(){
        return cols;
    }
}