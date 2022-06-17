import { LightningElement, track, api } from 'lwc';
import searchProductsByFilters from '@salesforce/apex/PW_CustomSearchCommunityController.searchProductsByFilters';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import MS_Filter from '@salesforce/label/c.MS_Filter';
import 	MS_Error from '@salesforce/label/c.MS_Error';
import 	MS_Submit from '@salesforce/label/c.MS_Submit';

export default class FiltersForCustomSearch extends LightningElement {
    @track productFamily;
    @track producerValue;
    @track productPriceFrom = 10;
    @track productPriceTo = 700;
    @api listOfProducts;

    label= {MS_Filter,MS_Submit}

    handleMessage(message){
        this.listOfProducts = message.recordData;
    }

    handleGetFamilyValue(event){
        this.productFamily = event.detail;
    }
    
    handleProducerChange(event){
        this.producerValue = event.detail;
    }

    handlePriceChange(event){
        this.productPriceFrom = event.detail.start;
        this.productPriceTo = event.detail.end;
    }

    handleClick(event){
        searchProductsByFilters({
            producer: this.producerValue,
            family: this.productFamily,
            minPrice: this.productPriceFrom,
            maxPrice: this.productPriceTo,
            ids: this.listOfProducts
        })
        .then(result => {
            const prodEvent = new CustomEvent("changeproducts",{
                detail: {products: result }
            });
    
            this.dispatchEvent(prodEvent);
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 	MS_Error,
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }
}