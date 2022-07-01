import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';
import getProductPrice from '@salesforce/apex/PW_ProductPage.getProductPrice';
import getProductReview from '@salesforce/apex/PW_ProductPage.getProductReview';
import getImages from '@salesforce/apex/PW_ProductPage.getImages';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRODUCTCODE_FIELD from '@salesforce/schema/Product2.ProductCode';
import PRODUCTFAMILY_FIELD from '@salesforce/schema/Product2.Family';
import PRODUCER_FIELD from '@salesforce/schema/Product2.Producer__c';
import MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Product2.Description';
import AVAILABLE_FIELD from '@salesforce/schema/Product2.Available__c';

import MS_Review_Count from '@salesforce/label/c.MS_Review_Count';
import MS_Error from '@salesforce/label/c.MS_Error';
import MS_Price_Without_Symbol from '@salesforce/label/c.MS_Price_Without_Symbol';
import MS_About_Item from '@salesforce/label/c.MS_About_Item';
import MS_Available_Column from '@salesforce/label/c.MS_Available_Column';
import MS_In_Strore from '@salesforce/label/c.MS_In_Strore';
import MS_Not_Available from '@salesforce/label/c.MS_Not_Available';
import MS_Category from '@salesforce/label/c.MS_Category';
import MS_Product_Code_Placeholder from '@salesforce/label/c.MS_Product_Code_Placeholder';
import MS_Add_To_Cart from '@salesforce/label/c.MS_Add_to_cart';

const fields = [NAME_FIELD, PRODUCER_FIELD, PRODUCTCODE_FIELD, PRODUCTFAMILY_FIELD, MODEL_FIELD, DESCRIPTION_FIELD, AVAILABLE_FIELD];

export default class CustomCommunityProductDetailPage extends LightningElement {
    @api recordId;
    @track poductImagesList;
    @track mainImage;
    @track price;
    @track rating;
    @track countRatig;

    label={
        MS_Review_Count,
        MS_Price_Without_Symbol,
        MS_About_Item,
        MS_Available_Column,
        MS_In_Strore,
        MS_Not_Available,
        MS_Category,
        MS_Product_Code_Placeholder,
        MS_Add_To_Cart
    }

    @wire(getImages, {recordId: '$recordId'})
    wiredResulted(result){
        const {data, error} = result;
        this.poductImagesList  = [];
        if(data){
            data.forEach(element => {
                this.poductImagesList.push('/sfc/servlet.shepherd/document/download/' + element.ContentDocumentId);
            });
            this.mainImage = this.poductImagesList[0];
        }
        if(error){ 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Error,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    @wire(getProductReview, {recordId: '$recordId'})
    wiredResultedReview(result){
        const {data, error} = result;
        this.rating = '';
        this.countRatig = '';
        if(data){
          this.rating = data[0].AverageRating;
          this.countRatig = data[0].CountRating;
        }
        if(error){ 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Error,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    @wire(getProductPrice, {recordId: '$recordId'})
    wiredREsultedPrice(result){
        const {data, error} = result;
        this.price='';
        if(data){
            this.price = data[0].UnitPrice;
        }
        if(error){ 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Error,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    myImageFunction(event) {
        this.mainImage = event.target.dataset.value;
    }

    @wire(getRecord, {recordId: '$recordId', fields })
    product;

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

    get available(){
        return getFieldValue(this.product.data, AVAILABLE_FIELD);
    }
}