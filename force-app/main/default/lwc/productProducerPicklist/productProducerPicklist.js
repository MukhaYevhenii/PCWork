import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Producer from '@salesforce/schema/Product2.Producer__c';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Product2_object from '@salesforce/schema/Product2';

export default class ProductProducerPicklist extends LightningElement {
    producerValue='';
    @wire(getObjectInfo, { objectApiName: Product2_object })
    productInfo;

    @wire(getPicklistValues,
        {
            recordTypeId: '$productInfo.data.defaultRecordTypeId',
            fieldApiName: Producer
        }
    )
    leadSourceValues;

    handleChange(event){
        this.producerValue = event.target.value;
        const producerEvent = new CustomEvent("getproducervalue",{
            detail: this.producerValue
        });

        this.dispatchEvent(producerEvent);
    }
}