import { LightningElement, wire, track } from 'lwc';
import getNewestProduct from '@salesforce/apex/PW_ProductsContentPage.getNewestProduct';
import getNumberOfRecords from '@salesforce/apex/PW_ProductsContentPage.getNumberOfRecords';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContentSlider extends LightningElement {

    @track productList = [];
    @track offset = 0;
    @track isFirstPage = true;
    @track isLastPage = false;
    @track numberOfNewProducts = 0;
    @track isLoading = false;

    @wire(getNewestProduct, {offsetNumber: '$offset'})
    wiredResulted(result){
        const {data, error} = result;
        this.productList = [];
        if(data){
            data.forEach(r=> {
                let record = Object.assign({}, r);
                record.DisplayUrl = r.Product2.DisplayUrl;
                record.Family = r.Product2.Family;
                record.Id = r.Product2.Id;
                record.Name = r.Product2.Name;
                this.productList.push(record);
            });
        }
        if(error){ 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    @wire(getNumberOfRecords)
    wiredNumberOfNewProducts(result){
        const {data, error} = result;
        if(data){
            data.forEach(r=> {
                this.numberOfNewProducts = r.totalRecords;
            });
            if((this.offset + 3) >= this.numberOfNewProducts){
                this.isLastPage = true;
            }
        }
        if(error){ 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    handleNextChangeOffset(){
        this.isLoading = true;
        if((this.offset + 1) + 3 >= this.numberOfNewProducts){
            this.isLastPage = true;
            this.isFirstPage = false;
        }else{
            this.isLastPage = false;
            this.isFirstPage = false;

        }
        this.offset = this.offset + 1;
        setTimeout(()=>{
            this.isLoading = false;
        },200);
    }

    handlePreviousChangeOffset(){
        this.isLoading = true;
        if((this.offset - 1) == 0 ){
            this.isFirstPage = true;
        }
        this.isLastPage = false;

        this.offset = this.offset - 1;
        setTimeout(()=>{
            this.isLoading = false;
        },200);
    }
}