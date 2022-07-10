import { LightningElement, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import { NavigationMixin } from 'lightning/navigation';
import ShippingAddress from '@salesforce/schema/Order.ShippingAddress';
import BillingAddress from '@salesforce/schema/Order.BillingAddress';
import createContract from '@salesforce/apex/PW_CacheManage.createContract';
import getFromCache from '@salesforce/apex/PW_CacheManage.getFromCache';
import getAccount from '@salesforce/apex/PW_CacheManage.getAccount';
import getStandardPricebook from '@salesforce/apex/PW_CacheManage.getStandardPricebook';
import parseWrapperToOrderItem from '@salesforce/apex/PW_CacheManage.parseWrapperToOrderItem';
import clearShoppingCart from '@salesforce/apex/PW_CacheManage.clearShoppingCart';

import Id from '@salesforce/user/Id';
import UserName from '@salesforce/schema/User.Name';
import UserEmail from '@salesforce/schema/User.Email';
import UserPhone from '@salesforce/schema/User.Phone';

import MS_Not_Found from '@salesforce/label/c.MS_Not_Found';
import MS_Order_Created from '@salesforce/label/c.MS_Order_Created';
import MS_Product_Order from '@salesforce/label/c.MS_Product_Order';
import MS_Place_Order from '@salesforce/label/c.MS_Place_Order';
import MS_Place_Order_Title from '@salesforce/label/c.MS_Place_Order_Title';
import MS_Full_Name from '@salesforce/label/c.MS_Full_Name';
import MS_Email from '@salesforce/label/c.MS_Email';
import MS_Phone from '@salesforce/label/c.MS_Phone';
import MS_Place_Order_Butt from '@salesforce/label/c.MS_Place_Order_Butt';
import MS_Your_Order from '@salesforce/label/c.MS_Your_Order';
import MS_Total_Price from '@salesforce/label/c.MS_Total_Price';
import MS_Bank_Transfer from '@salesforce/label/c.MS_Bank_Transfer';
import MS_Text_Bank_Transfer from '@salesforce/label/c.MS_Text_Bank_Transfer';
import MS_Cash from '@salesforce/label/c.MS_Cash';
import MS_Card from '@salesforce/label/c.MS_Card';

const fieldsSt = [UserName, UserEmail, UserPhone];

export default class CustomOrderPage extends  NavigationMixin(LightningElement) {
    @track resultList = [];
    @track totalPrice = 0;
    @track totalCount = 0;
    @track isLoading = false;
    @track disableShipping = false;
    @track userName;
    @track userEmail;
    @track userPhone;
    @track isModalOpen = false;
    date;
    userId;
    paymentValue = 'cash';
    contractId;
    fields;
    
    label={
        MS_Product_Order, 
        MS_Place_Order, 
        MS_Place_Order_Title, 
        MS_Full_Name, 
        MS_Email, 
        MS_Phone, 
        MS_Your_Order, 
        MS_Place_Order_Butt,
        MS_Total_Price, 
        MS_Bank_Transfer,
        MS_Text_Bank_Transfer,
        MS_Cash,
        MS_Card}

    idsProducts = {};
    shippingAddress = ShippingAddress;
    billingAddress = BillingAddress;
    wiredActivities;


    connectedCallback(){
        refreshApex(this.wiredActivities);
        let today = new Date();
        this.date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
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

    @wire(getAccount) accountId;
    @wire(getStandardPricebook) standardPricebook;

    @wire(getRecord, { recordId: Id, fields: fieldsSt }) 
    userDetails({error, data}) {
        if (data) {
            this.userName = data.fields.Name.value;
            this.userEmail = data.fields.Email.value;
            this.userPhone = data.fields.Phone.value;
            if(this.userPhone == null){
                this.userPhone = MS_Not_Found;
            }
        } else if (error) {
            this.error = error ;
        }
    }
 
    handleChangeCheckbox(event){
        this.disableShipping = event.target.checked;
    }

    sumPrice(){
        this.totalPrice  = 0;
        this.totalCount  = 0;
        this.resultList.forEach(element => {
            this.totalPrice += (element.price * element.count);
            this.totalCount += element.count;
        });
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => { field.reset(); });
        }
    }

    handleClearShoppingCart(){
        clearShoppingCart()
        .then(result => {
        })
        .catch(error => {
        })
        .finally(()=>{
            refreshApex(this.wiredActivities);
            this.totalPrice = 0;
        });
    }

    handleSuccess(event){
        this.handleClearShoppingCart();
        this.handleReset();
        const createdRecord = event.detail.id;
        this.resultList.forEach(element => {
            parseWrapperToOrderItem({orderWrapper: element, orderId: createdRecord })
            .then(result => {
            })
            .catch(error => {
            })
            .finally(()=>{
                setTimeout(()=>{
                    this.isLoading = false;
                },500);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: MS_Order_Created,
                        variant: 'success'
                    })
                );

                let baseURL = '/s';
                this.sfdcBaseURL = baseURL.concat('/order/',createdRecord);

                setTimeout(()=>{
                    this[NavigationMixin.GenerateUrl]({
                        type: 'standard__webPage',
                        attributes: {
                            url:  this.sfdcBaseURL
                        }
                    }).then(generatedUrl => {
                        window.open(generatedUrl,"_self");
                    });
                },500);
            });
        });
    }

    handleChangePayment(event){
        this.paymentValue = event.target.value;
    }

    handleSubmit(event){
        const fields = event.detail.fields;
        fields.AccountId = this.accountId.data;
        fields.Pricebook2Id = this.standardPricebook.data;
        fields.OwnerId = Id;
        fields.Payment__c = this.paymentValue;
        fields.EffectiveDate = this.date;
        fields.ContractId = this.contractId;
        fields.Status = 'Draft';

        if(this.disableShipping){
            fields.BillingCity = fields.ShippingCity;
            fields.BillingCountry = fields.ShippingCountry;
            fields.BillingPostalCode = fields.ShippingPostalCode;
            fields.BillingState = fields.ShippingState;
            fields.BillingStreet = fields.ShippingStreet;
        }

        this.fields = fields;
        this.isModalOpen = true;
    }

    handleCloseModal(event){
        this.isModalOpen = false;
        let confirm = event.detail;
        if(confirm){
            createContract()
            .then(result => {
                this.contractId = result;
            })
            .catch(error => {})
            .finally(()=>{
            })
            this.template.querySelector('lightning-record-edit-form').submit(this.fields);
            this.isLoading= true;
        }
    }
}