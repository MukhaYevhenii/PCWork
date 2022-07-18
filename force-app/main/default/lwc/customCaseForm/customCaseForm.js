import { LightningElement, track, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import Subject from '@salesforce/schema/Case.Subject';
import Description from '@salesforce/schema/Case.Description';
import Reason from '@salesforce/schema/Case.Reason';
import getProductsForUser from '@salesforce/apex/PW_CaseFormManage.getProductsForUser';
import CaseAssign from '@salesforce/apex/PW_CaseFormManage.CaseAssign';
import getOrderForProduct from '@salesforce/apex/PW_CaseFormManage.getOrderForProduct';
import uploadFile from '@salesforce/apex/PW_CaseFormManage.uploadFile';
import Id from '@salesforce/user/Id';

import MS_Send_Case_Modal from '@salesforce/label/c.MS_Send_Case_Modal';
import MS_Send_Case_Modal_Title from '@salesforce/label/c.MS_Send_Case_Modal_Title';
import MS_Contact_Supp_Title from '@salesforce/label/c.MS_Contact_Supp_Title';
import MS_Contact_Supp_Content from '@salesforce/label/c.MS_Contact_Supp_Content';
import MS_Case_Reason from '@salesforce/label/c.MS_Case_Reason';
import MS_Case_Title from '@salesforce/label/c.MS_Case_Title';
import MS_Case_Description from '@salesforce/label/c.MS_Case_Description';
import MS_Case_Product from '@salesforce/label/c.MS_Case_Product';
import MS_Product from '@salesforce/label/c.MS_Product';
import MS_Submit from '@salesforce/label/c.MS_Submit';
import MS_Case_Contact_EmpyPage from '@salesforce/label/c.MS_Case_Contact_EmpyPage';
import MS_Case_Contact_EmpyPage_Content from '@salesforce/label/c.MS_Case_Contact_EmpyPage_Content';
import MS_Case_Created from '@salesforce/label/c.MS_Case_Created';
import MS_Question from '@salesforce/label/c.MS_Question';
import MS_Order_Number from '@salesforce/label/c.MS_Order_Number';

export default class CustomCaseForm extends NavigationMixin(LightningElement) {
    caseSubject = Subject;
    caseDescription = Description;
    caseReason = Reason;
    @track valueProduct; 
    valueOrder;
    productValue;
    orderID;
    productPickList;
    orderPickList;
    @track caseCreated = false;
    @track isLoading = false;
    @track uploadedFile = [];
    @track confimModal = false;
    @track notNull = false;
    fieldsObject;
    fileData;
    confirm = false;
    label ={
        MS_Send_Case_Modal, 
        MS_Send_Case_Modal_Title,
        MS_Contact_Supp_Title,
        MS_Contact_Supp_Content,
        MS_Case_Reason,
        MS_Case_Title,
        MS_Case_Description,
        MS_Case_Product,
        MS_Product,
        MS_Submit,
        MS_Case_Contact_EmpyPage,
        MS_Case_Contact_EmpyPage_Content,
        MS_Question,
        MS_Order_Number}
    
    openfileUpload(event) { 
        for(let i=0; i< event.target.files.length; i++){
            const file = event.target.files[i];
            let reader = new FileReader();
            reader.onload = () => {
                let base64 = reader.result.split(',')[1];
                this.fileData = {
                    'filename': file.name,
                    'base64': base64,
                }
                this.uploadedFile.push(this.fileData);
            }
            reader.readAsDataURL(file);
        }
    }

    handleCloseModal(event){
        this.confimModal = false;
        this.confirm = event.detail;
        if(this.confirm){
            this.template.querySelector('lightning-record-edit-form').submit(this.fieldsObject);
            this.isLoading = true;
        }
    }

    handleDeleteFile(event){
        const tempFile = event.target.value;
        for (let i = this.uploadedFile.length - 1; i >= 0; i--) {
            if (this.uploadedFile[i].filename === tempFile) {
                this.uploadedFile.splice(i, 1);
            }
        }
    }
    
    @wire(getProductsForUser, { userId: Id})
    wiredResulted(result){
        const{data, error} = result;
            if(data){
                this.productPickList = Object.entries(data).map(([value,label]) => ({ value, label }));
                if(this.productPickList.length){
                    this.notNull = true;
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

    handleGetProduct(event){
        this.productValue = event.target.value;
        this.handleGetOrderNumbers();
    }

    handleGetOrder(event){
        this.orderID = event.target.value;
    }

    handleGetOrderNumbers(){
        getOrderForProduct({productId:  this.productValue, userId: Id})
            .then(result => {
                this.orderPickList = Object.entries(result).map(([value,label]) => ({ value, label }));
            })
            .catch(error => {
            })
    }

    handleSuccess(event){
            this.handleReset();
            const createdRecord = event.detail.id;
            let baseURL = '/s';
            this.sfdcBaseURL = baseURL.concat('/case/',createdRecord);
            this.isLoading = false;
            this.caseCreated = true;
            CaseAssign({CaseIds: createdRecord})
            .then(result => {
            })
            .catch(error => {
            })
            this.uploadedFile.forEach(element => {
                const {base64, filename} = element;
                uploadFile({ base64, filename, recordId: createdRecord})
                .then(result=>{
                })
                .catch(error =>{
                });
            });
    
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Case_Created,
                    variant: 'success'
                })
            );
    
            setTimeout(()=>{
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__webPage',
                    attributes: {
                        url:  this.sfdcBaseURL
                    }
                }).then(generatedUrl => {
                    window.open(generatedUrl,"_self");
                });
            },2000);
    }

    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        fields.OwnerId = Id;
        fields.ProductId = this.productValue;
        fields.Origin = 'Email';
        fields.OrderID__c = this.orderID;
        if(fields.Reason == 'Problem with delivery'){
            fields.Priority = 'High';
        }else{
            fields.Priority = 'Medium';
        }
        this.fieldsObject = fields;
        this.confimModal = true;
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => { field.reset(); });
        }
    }
}