import { LightningElement, api, track } from 'lwc';
import MS_Order from '@salesforce/label/c.MS_Order';
import MS_Start_date from '@salesforce/label/c.MS_Start_date';
import MS_Total_Amount_Small from '@salesforce/label/c.MS_Total_Amount_Small';
import MS_Butt_Details from '@salesforce/label/c.MS_Butt_Details';

export default class CustomOrderHistoryCard extends LightningElement {
    @api order;
    @track orderDetailLink;
    @track isModalOpen = false;
    label = {MS_Order, MS_Start_date, MS_Total_Amount_Small, MS_Butt_Details}

    handleCloseModal(){
        this.isModalOpen = false;
    }

    connectedCallback(){
        if(this.order != undefined){
            let baseURL = '/s';
            this.orderDetailLink = baseURL.concat('/order/',this.order.Id);
        }
    }
    
    handleOpenModal(){
        this.isModalOpen = true;
        const openModal = new CustomEvent('openmodal', {detail: this.order});
        this.dispatchEvent(openModal);  
    }
}