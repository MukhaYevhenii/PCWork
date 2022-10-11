import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from "@salesforce/apex";
import { NavigationMixin } from 'lightning/navigation';
import getFromCache from '@salesforce/apex/PW_CacheManage.getFromCache';
import removeFromCache from '@salesforce/apex/PW_CacheManage.removeFromCache';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import MS_Your_Order from '@salesforce/label/c.MS_Your_Order';
import MS_You_Have from '@salesforce/label/c.MS_You_Have';
import MS_Items_In_cart from '@salesforce/label/c.MS_Items_In_cart';
import MS_Continue_Shopp from '@salesforce/label/c.MS_Continue_Shopp';
import MS_Details_Price from '@salesforce/label/c.MS_Details_Price';
import MS_Price_Without_Symbol from '@salesforce/label/c.MS_Price_Without_Symbol';
import MS_Items from '@salesforce/label/c.MS_Items';
import MS_Total_Amount from '@salesforce/label/c.MS_Total_Amount';
import MS_Checkout from '@salesforce/label/c.MS_Checkout';
import MS_Deleted_From_Cart from '@salesforce/label/c.MS_Deleted_From_Cart';
import MS_Delete_Product from '@salesforce/label/c.MS_Delete_Product';
import MS_Sure_To_Delete from '@salesforce/label/c.MS_Sure_To_Delete';

export default class CustomCartPage extends  NavigationMixin(LightningElement) {
    @track resultList = [];
    @track totalPrice = 0;
    @track totalCount = 0;
    @track isLoading = true;
    @track isModalOpen = false;
    recordIdToDelete;
    subscription = null;
    idsProducts = {};
    wiredActivities;

    label = {
        MS_Your_Order, 
        MS_You_Have, 
        MS_Items_In_cart, 
        MS_Continue_Shopp, 
        MS_Details_Price, 
        MS_Price_Without_Symbol, 
        MS_Items, 
        MS_Total_Amount, 
        MS_Checkout,
        MS_Delete_Product,
        MS_Sure_To_Delete
    }

    connectedCallback(){
        refreshApex(this.wiredActivities);
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
        }, 2000);
    }

    @wire(getFromCache)
    wiredResulted(result){
        this.wiredActivities = result;
        const{data, error} = result;
            if(data){
                this.resultList = [];
                this.isLoading = false;
                if(data.length != 0){
                    this.resultList = data;
                    this.sumPrice();
                }
            }
        if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title:  error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    handleChangeTotalPriceByNumber(){
        refreshApex(this.wiredActivities);
    }

    sumPrice(){
        this.totalPrice  = 0;
        this.totalCount  = 0;
        this.resultList.forEach(element => {
            this.totalPrice += (element.price * element.count);
            this.totalCount += element.count;
        });
    }

    handleChangeTotalPrice(event){
        let temp = event.detail.price * event.detail.number;
        this.totalPrice +=  temp;
    }

    handleOpenConfirmModal(event){
        this.recordIdToDelete = event.detail;
        this.isModalOpen = true;
    }

    handleCloseModal(event){
        this.isModalOpen = false;
        let confirm = event.detail;
        if(confirm){
            removeFromCache({product: this.recordIdToDelete})
            .then(result => {})
            .catch(error => {})
            .finally(()=>{
                refreshApex(this.wiredActivities);
                const toastEvent = new ShowToastEvent ({
                    message: MS_Deleted_From_Cart,
                    variant: "success"
                });
                this.dispatchEvent(toastEvent);
            })
        }
    }
}