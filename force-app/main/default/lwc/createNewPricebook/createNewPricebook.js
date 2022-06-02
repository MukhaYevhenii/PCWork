import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateActivityPricebookById from '@salesforce/apex/PW_NewPricebookController.updateActivityPricebookById';

import MS_Cancel_Button from '@salesforce/label/c.MS_Cancel_Button';
import MS_SaveNew from '@salesforce/label/c.MS_SaveNew';
import MS_Save_Butt from '@salesforce/label/c.MS_Save_Butt';
import MS_Close_Butt from '@salesforce/label/c.MS_Close_Butt';
import MS_Pricebook_Created from '@salesforce/label/c.MS_Pricebook_Created';
import MS_Created_Pricebook_Done from '@salesforce/label/c.MS_Created_Pricebook_Done';
import MS_Error_Pricebook_Title from '@salesforce/label/c.MS_Error_Pricebook';
import MS_Error_Pricebook_Message from '@salesforce/label/c.MS_Error_Pricebook_Message';
import MS_New_Pricebook from '@salesforce/label/c.MS_New_Pricebook';

export default class CreateNewPricebook extends LightningElement {

    @track isLoading = false;
    @track isModalOpen = true;
    @track isSaveAndNew = false;
    
    label = {
        MS_Cancel_Button,
        MS_SaveNew,
        MS_Save_Butt,
        MS_Close_Butt,
        MS_New_Pricebook
    }

    handleSubmit(event){
        this.isLoading = true;
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
    }

    handleSaveAndNew(event){
        this.isLoading = true;
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
        this.isSaveAndNew = true;
    }

    handleReset() {
        this.isLoading = true;
        const formInputFields = this.template.querySelectorAll('lightning-input-field');
        if (formInputFields) {
            formInputFields.forEach(field =>{
                field.reset();
            })
        }
        setTimeout(()=>{
            this.isLoading = false;
        },800);
    }

    handleSuccess(event){
        const Id = event.detail.id;
        const toastEvent = new ShowToastEvent ({
            title: MS_Pricebook_Created,
            message: MS_Created_Pricebook_Done + Id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);

        updateActivityPricebookById({pricebookId: Id})
        .then(result => {
        })
        .catch(error => {
        });

        setTimeout(()=>{
            this.isLoading = false;
        },5000);

        if(this.isSaveAndNew === true){
            this.handleReset();
            this.isSaveAndNew = false;
        }else{
            this.closeModal();
        }
    }

    handleError(){
        this.template.querySelectorAll('lightning-input-field').forEach(element => console.log(element.reportValidity()));
        const toastEvent = new ShowToastEvent ({
            title: MS_Error_Pricebook_Title,
            message: MS_Error_Pricebook_Message,
            variant: "error"
        });
        this.dispatchEvent(toastEvent);
        setTimeout(()=>{
            this.isLoading = false;
        },5000);
        eval("$A.get('e.force:refreshView').fire();");
    }

    handleChangeModalOpen(){
        const modalEvent = new CustomEvent("getmodalvalue", {detail:this.isModalOpen});
        this.dispatchEvent(modalEvent);
    }

    closeModal() {
        this.isModalOpen = false;
        this.handleChangeModalOpen();
    }
}