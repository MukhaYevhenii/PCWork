import { LightningElement, api, track} from 'lwc';
import addToCache from '@salesforce/apex/PW_CacheManage.addToCache';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import MS_Was_Added_Cart from '@salesforce/label/c.MS_Was_Added_Cart';
import MS_Not_Available_In_Store from '@salesforce/label/c.MS_Not_Available_In_Store';

export default class ProductRecord extends LightningElement {
    @api productRecord;
    @api usingPrice = false;
    @track isLoading = false;
    sfdcBaseURL;    

    renderedCallback() {
        let baseURL = '/s';
        this.sfdcBaseURL = baseURL.concat('/detail/',this.productRecord.Id);
    }

    handleAddToCart(){
        console.log(JSON.parse(JSON.stringify(this.productRecord)));
        if(this.usingPrice == false){
            if(this.productRecord.Available__c == true){
                this.addToCart();
            }else{
                this.notAvailableToast();
            }
        }
        else{
            if(this.productRecord.Product2.Available__c == true){
                this.addToCart();
            }else{
                this.notAvailableToast();
            }
        }
    }

    addToCart(){
        this.isLoading = true;
        addToCache({product: this.productRecord.Id})
        .then(result => {
        })
        .catch(error => {})
        .finally(()=>{
            setTimeout(() => {
                this.isLoading = false;
                const toastEvent = new ShowToastEvent ({
                    message: MS_Was_Added_Cart,
                    variant: "success"
                })
                this.dispatchEvent(toastEvent);
            }, 1000);

            });
    }

    notAvailableToast(){
        const toastEvent = new ShowToastEvent ({
            message: MS_Not_Available_In_Store,
            variant: "error"
        })
        this.dispatchEvent(toastEvent);
    }
}