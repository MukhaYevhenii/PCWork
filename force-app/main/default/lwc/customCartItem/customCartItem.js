import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';
import updateCountProductCache from '@salesforce/apex/PW_CacheManage.updateCountProductCache';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRODUCTCODE_FIELD from '@salesforce/schema/Product2.ProductCode';
import PRODUCTFAMILY_FIELD from '@salesforce/schema/Product2.Family';
import PRODUCER_FIELD from '@salesforce/schema/Product2.Producer__c';
import MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Product2.Description';
import AVAILABLE_FIELD from '@salesforce/schema/Product2.Available__c';
import DISPLAYURL from '@salesforce/schema/Product2.DisplayURl';

import MS_Category from '@salesforce/label/c.MS_Category';
import MS_Producer_Column from '@salesforce/label/c.MS_Producer_Column';
import MS_Remove_Item from '@salesforce/label/c.MS_Remove_Item';

const fields = [NAME_FIELD, PRODUCER_FIELD, PRODUCTCODE_FIELD, PRODUCTFAMILY_FIELD, MODEL_FIELD, DESCRIPTION_FIELD, AVAILABLE_FIELD, DISPLAYURL];

export default class CustomCartItem extends LightningElement {
    @api recordId;
    @api price;
    @api number;
    @track isModalOpen = true;
    isConfirm = false;
    wiredActivities;

    label = {MS_Category, MS_Producer_Column, MS_Remove_Item}

    @wire(getRecord, {recordId: '$recordId', fields })
    product;

    handleDeleteFromCart(){
        const deleteRecord = new CustomEvent('deleterecord', {detail: this.recordId});
        this.dispatchEvent(deleteRecord);  
    }

    handleChangeNumberProducts(event){
        let tempCount = event.target.value;
        if(tempCount < 1){
            tempCount = 1;
        }
        if(tempCount > 99){
            tempCount = 99;
        }
        updateCountProductCache({product: this.recordId, count:tempCount})
        .then(result=>{
            const priceProduct = new CustomEvent('changecount');
            this.dispatchEvent(priceProduct);  
            
        });        
    }

    handleCloseModal(event){
        this.isConfirm = event.detail;
        this.isModalOpen = false;
    }

    get name(){
        return getFieldValue(this.product.data, NAME_FIELD);
    }

    get code(){
        return getFieldValue(this.product.data, PRODUCTCODE_FIELD);
    }

    get category(){
        return getFieldValue(this.product.data, PRODUCTFAMILY_FIELD);
    }
    
    get producer(){
        return getFieldValue(this.product.data, PRODUCER_FIELD);
    }

    get model(){
        return getFieldValue(this.product.data, MODEL_FIELD);
    }

    get description(){
        return getFieldValue(this.product.data, DESCRIPTION_FIELD);
    }

    get image(){
        return getFieldValue(this.product.data, DISPLAYURL);
    }

    get available(){
        return getFieldValue(this.product.data, AVAILABLE_FIELD);
    }
}