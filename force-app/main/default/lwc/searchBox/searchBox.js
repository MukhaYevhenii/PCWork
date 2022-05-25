import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/customSearchSobject.getProducts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

import MS_Available_Column from '@salesforce/label/c.MS_Available_Column';
import MS_Model_Column from '@salesforce/label/c.MS_Model_Column';
import MS_Producer_Column from '@salesforce/label/c.MS_Producer_Column';
import MS_Product_Family_Column from '@salesforce/label/c.MS_Product_Family_Column';
import MS_Product_Name_Column from '@salesforce/label/c.MS_Product_Name_Column';
import MS_Product_Code_Column from '@salesforce/label/c.MS_Product_Code_Column';
import MS_Record_Not_Found from '@salesforce/label/c.MS_Record_Not_Found';
import MS_Fields_Empty from '@salesforce/label/c.MS_Fields_Empty';
import MS_Search from '@salesforce/label/c.MS_Search';
import MS_Search_Product from '@salesforce/label/c.MS_Search_Product';
import MS_Clear from '@salesforce/label/c.MS_Clear';

const cols = [
    { label: MS_Product_Name_Column, fieldName:'Url', type: 'url',  typeAttributes: {label: { fieldName: 'UrlName' }}},
    { label: MS_Producer_Column, fieldName:'Producer__c', type: 'text'},
    { label: MS_Model_Column, fieldName:'Model__c', type: 'text'},
    { label: MS_Product_Family_Column, fieldName:'Family', type: 'text'},
    { label: MS_Product_Code_Column, fieldName:'ProductCode', type: 'text'},
    { label: MS_Available_Column, fieldName:'Available__c', type: 'boolean'},
];

export default class SearchBox extends NavigationMixin(LightningElement) {
    label = {
        MS_Search,
        MS_Search_Product,
        MS_Clear
    }
    @track productName;
    @track model;
    @track productCode;
    @track productList = [];
    @track productFamily;
    @track isLoading = false;
    @track producerValue;
    @track isNotEmpty = false;

    handleGetFamilyValue(event){
        this.productFamily = event.detail;
    }

    get columns(){
        return cols;
    }

    handlegetProductCodeValue(event){
        this.productCode = event.detail;
    }

    handleProducerChange(event){
        this.producerValue = event.detail;
    }

    handleModelChange(event){
        this.model = event.detail;
    }

    handleNameChange(event){
        this.productName = event.detail;
    }

    handleSearchKeyword(){
        this.isLoading = true;
        if (this.productName !== '' || this.model !== '' || this.productCode !== '' || this.producerValue !== '' || this.productFamily !== '') {
            getProducts({
                productName: this.productName,
                model: this.model,
                productCode: this.productCode,
                producer: this.producerValue,
                family: this.productFamily
                })
                .then(result => {
                    this.productList = [];
                    result.forEach(r=> {
                        let record =  Object.assign({}, r);
                        record.Url = `/lightning/r/Product2/${r.Id}/view`;
                        record.UrlName = r.Name;
                        record.Name = r.Name;
                        this.productList.push(record);
                    });
                    if(this.productList.length === 0) {
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
                    this.productList = null;
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
        this.productName = '';
        this.productModel = ''; 
        this.productCode = '';
        this.producer = '';
        this.productFamily = '';
        this.isNotEmpty = false;
        this.isLoading = false;
        eval("$A.get('e.force:refreshView').fire();");
    }
}