import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/customSearchSobject.getProducts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

const cols = [
    { label:'Product name', fieldName:'Url', type: 'url',  typeAttributes: {label: { fieldName: 'UrlName' }, 
    target: '_blank'}},
    { label:'Producer', fieldName:'Producer__c', type: 'text'},
    { label:'Model', fieldName:'Model__c', type: 'text'},
    { label:'Product Family', fieldName:'Family', type: 'text'},
    { label:'Product Code', fieldName:'ProductCode', type: 'text'},
    { label:'Available', fieldName:'Available__c', type: 'boolean'},
];

export default class SearchBox extends NavigationMixin(LightningElement) {
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
                            message: 'Records were not found.'
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
                message: 'All of the search fields are empty.'
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