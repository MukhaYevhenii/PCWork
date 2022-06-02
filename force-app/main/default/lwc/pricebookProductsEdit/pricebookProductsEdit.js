import { LightningElement, api, track} from 'lwc';
import PRICE_FIELD from '@salesforce/schema/PricebookEntry.UnitPrice';
import ID_FIELD from '@salesforce/schema/PricebookEntry.Id';
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import MS_Price_Update from '@salesforce/label/c.MS_Price_Update';
import MS_Success from '@salesforce/label/c.MS_Success';
import MS_Advanced_Price_Label from '@salesforce/label/c.MS_Advanced_Price_Label';
import MS_Edit_By_Percent from '@salesforce/label/c.MS_Edit_By_Percent';
import MS_Label_Preview from '@salesforce/label/c.MS_Label_Preview';
import MS_Edit_By_Euro from '@salesforce/label/c.MS_Edit_By_Euro';
import MS_Cancel_Button from '@salesforce/label/c.MS_Cancel_Button';
import MS_Save_Butt from '@salesforce/label/c.MS_Save_Butt';
import MS_Product_Name from '@salesforce/label/c.MS_Product_Name';
import MS_Price from '@salesforce/label/c.MS_Price';

export default class PricebookProductsEdit extends LightningElement {
    @api productsList = [];
    @track isModalOpen = true;
    @track percentNumber;
    @track priceEuroNumber = 0;
    @track tempProductList = [];
    @track blockedPercent = false;
    @track blockedEuro = false;

    label = {MS_Advanced_Price_Label,MS_Edit_By_Percent, MS_Edit_By_Euro, MS_Label_Preview,MS_Cancel_Button, MS_Save_Butt, MS_Product_Name, MS_Price}

    connectedCallback(){
        this.tempProductList = this.productsList;
    }

    closeModal() {
        this.isModalOpen = false;
        this.handleChangeModalOpen();
    }

    handleChangePriceByPercent(){
        let tempList = [];
        this.tempProductList = this.productsList;
        this.tempProductList.forEach(r=> {
            let record = Object.assign({}, r);
            record.UnitPrice = Math.round(((this.percentNumber * (r.UnitPrice / 100)) + r.UnitPrice) *100)/100;
            tempList.push(record);
        });
        this.tempProductList = tempList;
    }

    handleChangePriceByEuro(){
        let tempList = [];
        
        this.tempProductList = this.productsList;
        this.tempProductList.forEach(r=> {
            let record = Object.assign({}, r);
            record.UnitPrice = Math.round((record.UnitPrice + Math.round(this.priceEuroNumber * 100)/100) * 100)/100;
            if(record.UnitPrice < 0){
                record.UnitPrice = 0;
            }
            tempList.push(record);
        });
        this.tempProductList = tempList;
    }

    managerChangePrice(){
        if(this.blockedPercent){
            this.handleChangePriceByEuro();
        }
        else{
            this.handleChangePriceByPercent();
        }
    }


    handleChangePriceOnInput(event){
        if(this.priceEuroNumber !== 0 || this.priceEuroNumber !== '' || this.priceEuroNumber !== undefined){
            this.blockedEuro = true;
            this.percentNumber = event.target.value;
        }
        if(event.target.value === 0 || event.target.value == '' || event.target.value == undefined){
            this.blockedEuro = false;
            this.percentNumber = event.target.value;
        }
    }

    handleChangePriceEuroOnInput(event){
        if(this.percentNumber !== 0 || this.percentNumber !== '' || this.percentNumber !== undefined){
            this.blockedPercent = true;
            this.priceEuroNumber = event.target.value;
        }
        if(event.target.value === 0 || event.target.value == '' || event.target.value == undefined){
            this.blockedPercent = false;
            this.priceEuroNumber = event.target.value;
        }
    }

    saveRecordsUpdate(){
    this.managerChangePrice();

        const fields = {};
        this.tempProductList.forEach(r=> {
            fields[ID_FIELD.fieldApiName] = r.Id;
            fields[PRICE_FIELD.fieldApiName] = r.UnitPrice;
            const recordInput = {
                fields: fields
            };
            updateRecord(recordInput).then((record) => {
          
          });
    });
    this.productsList = this.tempProductList;

    this.dispatchEvent(
        new ShowToastEvent({
            title: 	MS_Success,
            message: MS_Price_Update,
            variant: 'success'
        })
    );

        this.handleChangePrices();
    }

    handleChangePrices(){
        const updatePrices = new CustomEvent("getupdatedprices", {detail:this.productsList});
        this.dispatchEvent(updatePrices);
    }


    handleChangeModalOpen(){
        const modalEvent = new CustomEvent("getmodalvalue", {detail:this.isModalOpen});
        this.dispatchEvent(modalEvent);
    }
}