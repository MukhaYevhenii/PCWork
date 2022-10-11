import { LightningElement, track, wire } from 'lwc';
import  getRecentlyViewedProducts from '@salesforce/apex/PW_RecentlyViewedProducts.getRecentlyViewedProducts';
import getNumberOfRecords from '@salesforce/apex/PW_RecentlyViewedProducts.getNumberOfRecords';

export default class RecentlyViewedProducts extends LightningElement {
    @track recentlyProductsList = [];
    @track isFirstPage = true;
    @track isLastPage = false;
    @track numberOfNewProducts = 0;
    @track offset = 0;
    @track isLoading = false;

    @wire(getRecentlyViewedProducts, {offsetNumber: '$offset'})
    wiredResulted(result){
        const {data, error} = result;
        this.recentlyProductsList  = [];
        if(data){
            data.forEach(r=> {
                this.recentlyProductsList.push(r);
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
                if(this.numberOfNewProducts > 5){
                    this.numberOfNewProducts = 5;
                }
            });
            if((this.offset + 1) >= this.numberOfNewProducts){
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
        if((this.offset + 1) + 1 >= this.numberOfNewProducts){
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