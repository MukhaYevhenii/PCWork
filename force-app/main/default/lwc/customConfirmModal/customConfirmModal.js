import { LightningElement,api, wire} from 'lwc';
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import MS_Cancel_Button	from '@salesforce/label/c.MS_Cancel_Button';
import MS_Close_Butt from '@salesforce/label/c.MS_Close_Butt';
import MS_Yes from '@salesforce/label/c.MS_Yes';

const fields = [NAME_FIELD];

export default class CustomConfirmModal extends LightningElement {
    @api recordId;
    @api content;
    @api title;
    isConfirm = false;

    label={MS_Cancel_Button, MS_Close_Butt, MS_Yes}

    @wire(getRecord, {recordId: '$recordId', fields })
    product;

    closeModalSuccess(){
        this.isConfirm = true;
        const closeModal = new CustomEvent('closemodal',{detail: this.isConfirm});
        this.dispatchEvent(closeModal);  
        this.isConfirm = false;
    }

    closeModal(){
        const closeModal = new CustomEvent('closemodal',{detail: this.isConfirm});
        this.dispatchEvent(closeModal);  
    }

    get name(){
        return getFieldValue(this.product.data, NAME_FIELD);
    }

}