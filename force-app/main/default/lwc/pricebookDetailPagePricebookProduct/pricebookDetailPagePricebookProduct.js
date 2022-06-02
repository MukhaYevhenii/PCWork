import { LightningElement, track, wire, api } from 'lwc';
import getPricebooksProduct from '@salesforce/apex/PW_GetProductsFromPricebook.getProducts';
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

import MS_Price_Updated from '@salesforce/label/c.MS_Price_Updated';
import MS_Success from '@salesforce/label/c.MS_Success';
import MS_Error from '@salesforce/label/c.MS_Error';
import MS_Error_Occured from '@salesforce/label/c.MS_Error_Occured';
import MS_Pricebook_Not_Contain from '@salesforce/label/c.MS_Pricebook_Not_Contain';
import MS_Price_Editing_Advanced from '@salesforce/label/c.MS_Price_Editing_Advanced';

const cols = [
    { label: "Name", fieldName:'Name', type: 'text'},
    { label: "List price", fieldName:'UnitPrice',   type: 'currency', editable: true, sortable: true,
    typeAttributes: { currencyCode: 'EUR', step: '0.01' },
    cellAttributes: { alignment: 'center' }},
];

export default class PricebookDetailPagePricebookProduct extends LightningElement {

    label = {MS_Pricebook_Not_Contain, MS_Price_Editing_Advanced}

    @track pricebooksProduct =[];
    @api recordId;
    @track isEmpty;
    @track selectedRows = [];
    @track modalTemplateOpen = false;
    disableBool = true;
    sortedBy;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    fldsItemValues = [];
    wiredActivities;

    openEditPriceModal(){
        this.getSelected();
        this.modalTemplateOpen = true;
    }

    @wire(getPricebooksProduct, {recordId: '$recordId'})
    wiredResulted(result){ 
        const {data, error} = result;
        this.wiredActivities = result;
        this.pricebooksProduct = [];
        if(data){
            data.forEach(r=> {
                let record = Object.assign({}, r);
                record.Name = r.Product2.Name;
                this.pricebooksProduct.push(record);
            });
            refreshApex(this.wiredActivities);
        }
        if(error){ 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Error,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    handleUpdatePrices(event){
        this.pricebooksProduct = (this.pricebooksProduct).map(obj => (event.detail).find(o => o.Id === obj.Id) || obj);
    }

    handleChangeModalOpen(event){
        this.modalTemplateOpen = event.detail;
    }

    handleSelected( event ) {
        const selectedRows = event.detail.selectedRows;
        if ( selectedRows.length > 0 ) {
            this.disableBool = false;
        } else {
            this.disableBool = true;
        }
    }

    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 	MS_Success,
                    message: MS_Price_Updated,
                    variant: 'success'
                })
            );
            this.fldsItemValues = [];
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Error,
                    message: MS_Error_Occured,
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fldsItemValues = [];
        });
    }

    onHandleSort( event ) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.pricebooksProduct];

        cloneData.sort( this.sortBy( sortedBy, sortDirection === 'asc' ? 1 : -1 ) );
        this.pricebooksProduct = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    sortBy( field, reverse, primer ) {
        const key = primer
            ? function( x ) {
                  return primer(x[field]);
              }
            : function( x ) {
                  return x[field];
              };

        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };
    }

    async refresh() {
        await refreshApex(this.wiredActivities);
    }

    getSelected() {
        this.selectedRows = [];
        this.selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
    }

    get column(){
        return cols;
    }
}