import { LightningElement, api, wire, track } from 'lwc';
import getProductsOfOrder from '@salesforce/apex/PW_CacheManage.getProductsOfOrder';
import MS_Cancel_Button from '@salesforce/label/c.MS_Cancel_Button';
import MS_Ok from '@salesforce/label/c.MS_Ok';
import MS_Close_Butt from '@salesforce/label/c.MS_Close_Butt';
import MS_Order from '@salesforce/label/c.MS_Order';
import MS_Image_Column from '@salesforce/label/c.MS_Image_Column';
import MS_Name from '@salesforce/label/c.MS_Name';
import MS_Price from '@salesforce/label/c.MS_Price';
import MS_Quantity from '@salesforce/label/c.MS_Quantity';

const columns = [
    { label: MS_Image_Column, fieldName: 'Image', type: 'image' },
    { label: MS_Name, fieldName:'Url', type: 'url',  typeAttributes: {label: { fieldName: 'UrlName' }}},
    { label: MS_Price, fieldName: 'UnitPrice', type: 'price' },
    { label: MS_Quantity, fieldName: 'Quantity'}
];

export default class CustomOrderProductsModal extends LightningElement {
    @api order;
    @track orderItemsList = [];
    columns = columns;
    label={MS_Cancel_Button,MS_Ok,MS_Close_Butt, MS_Order}

    connectedCallback(){
        if(this.order != undefined){
            getProductsOfOrder({orderId: this.order.Id})
            .then(result => {
                this.orderItemsList = [];
                result.forEach(r=> {
                    let record =  Object.assign({}, r);
                    record.Url = `/s/detail/${r.Product2Id}`;
                    record.UrlName = r.Product2.Name;
                    record.Image = r.Product2.DisplayUrl;
                    this.orderItemsList.push(record);
                });
            });
        }
    }

    closeModal(){
        const closeModal = new CustomEvent('closemodal');
        this.dispatchEvent(closeModal);  
    }
}