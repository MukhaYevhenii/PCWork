import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getStandardPriceProduct from '@salesforce/apex/PW_EditRecordController.getStandardPriceProduct';
import updateStandardPrice from '@salesforce/apex/PW_EditRecordController.updateStandardPrice';
import getRelatedFilesByRecordId from '@salesforce/apex/PW_FilePreviewAndDownloadController.getRelatedFilesByRecordId';
import deleteContentDocument from '@salesforce/apex/PW_FilePreviewAndDownloadController.deleteContentDocument';
import getContentDownloadUrl from '@salesforce/apex/PW_ContentDistributionLinks.getContentDownloadUrl';
import updateDisplayURL from '@salesforce/apex/PW_FilePreviewAndDownloadController.updateDisplayURL';
import { refreshApex } from "@salesforce/apex";
import { getRecord, getFieldValue} from 'lightning/uiRecordApi';
import {NavigationMixin} from 'lightning/navigation';
import DISPLAYURL_FIELD from '@salesforce/schema/Product2.DisplayUrl';

import MS_Price from '@salesforce/label/c.MS_Price';
import MS_Save_Butt from '@salesforce/label/c.MS_Save_Butt';
import MS_Cancel_Button from '@salesforce/label/c.MS_Cancel_Button';
import MS_Delete from '@salesforce/label/c.MS_Delete';
import MS_Preview from '@salesforce/label/c.MS_Preview';
import MS_File_Preview from '@salesforce/label/c.MS_File_Preview';
import MS_Price_Greater from '@salesforce/label/c.MS_Price_Greater';
import MS_Error_Load_Price from '@salesforce/label/c.MS_Error_Load_Price';
import MS_Error_Load_File from '@salesforce/label/c.MS_Error_Load_File';
import MS_File_Upload_Success from '@salesforce/label/c.MS_File_Upload_Success';
import MS_Success from '@salesforce/label/c.MS_Success';
import MS_Error_Delete_File from '@salesforce/label/c.MS_Error_Delete_File';
import MS_Error from '@salesforce/label/c.MS_Error';
import MS_Error_Selecting_Prof from '@salesforce/label/c.MS_Error_Selecting_Prof';
import MS_Product_Updated from '@salesforce/label/c.MS_Product_Updated';
import MS_Product_Update from '@salesforce/label/c.MS_Product_Update';
import MS_Error_Update_Price from '@salesforce/label/c.MS_Error_Update_Price';

const fields = [DISPLAYURL_FIELD];

export default class EditProductRecord extends NavigationMixin(LightningElement) {
    label = {
        MS_Price,
        MS_Save_Butt,
        MS_Cancel_Button,
        MS_Delete,
        MS_Preview,
        MS_File_Preview,
        MS_Price_Greater
    }
    @track productPrice;
    @track pricebookentry;
    @track isModalOpen = true;
    @api Id;
    @track filesList = [];
    wiredActivities;
    acceptedFormats = '.png,.jpg,.jpeg';

    @wire(getStandardPriceProduct, {productId: '$Id'})
    wiredResulted(result){ 
        const {data, error} = result;
        if(data){
            this.productPrice = data.UnitPrice;
            this.pricebookentry = data;
        }
        if(error){ 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Error_Load_Price,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    closeQuickAction() {
        const closeQA = new CustomEvent('close');
        this.dispatchEvent(closeQA);
    }

    @wire(getRelatedFilesByRecordId, {recordId: '$Id'})
    wiredResult(result){ 
       const { data, error } = result;
       this.wiredActivities = result;
       if(data){ 
           Promise.all( Object.keys(data).map( async item=>{
               this.contentVersionId = data[item].Id;
               const publicUrl = await this.displayUrlConverted();
               const temp =  {
                   "label":data[item].Title,
                    "value": data[item].ContentDocumentId,
                    "converturl":  publicUrl,
                    "imageurl":`/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${data[item].Id}&operationContext=CHATTER&contentId=${data[item].ContentDocumentId}`,
                    "fileextension": data[item].FileExtension,
                    "isProfileImage": this.isProfileImageCheck(publicUrl)
                   }
                   return temp;
            })).then((result) => {
               this.filesList = result;
            })
       }
       if(error){ 
           this.dispatchEvent(
               new ShowToastEvent({
                   title: MS_Error_Load_File,
                   message: error.body.message,
                   variant: 'error',
               }),
           );
       }
   }

   displayUrlConverted(){
       return new Promise( (resolutionFunc,rejectionFunc) => {
           getContentDownloadUrl({contentVersionId: this.contentVersionId})
           .then(result => {
               resolutionFunc(result);
           });
       }); 
   }
   

    @wire(getRecord, { recordId: '$Id', fields })
    product;

    get displayurl() {
        return getFieldValue(this.product.data, DISPLAYURL_FIELD);
    }
    
    isProfileImageCheck(url) {
        if(url == this.displayurl) {
            return true;
        }else {
            return false;
        }
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        refreshApex(this.wiredActivities);
        this.dispatchEvent(
          new ShowToastEvent({
            title: MS_Success,
            message: uploadedFiles.length +" " +MS_File_Upload_Success,
            variant: "success"
          })
        );

    }

    previewImage(event){
        let url = event.target.dataset.id
        window.open(url, "_blank");
    }

    handleDeleteFiles(event) {
        const Id = event.target.dataset.id;
        const url = event.target.value;
        refreshApex(this.product);
        deleteContentDocument({
            recordId: Id
        })
        .then(result => {
            refreshApex(this.wiredActivities);
            if(url == this.displayurl){
                updateDisplayURL({ recordId: this.Id, url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png'})
                .then(result => {
                    refreshApex(this.wiredActivities);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: MS_Error,
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 	MS_Error_Delete_File,
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }

    handleCheckBoxChange(event){
        if(event.target.checked){
            let url = event.target.value;
            updateDisplayURL({ recordId: this.Id, url: event.target.value})
            .then(result => {
                let selected = [...this.template.querySelectorAll('lightning-input')].filter(input => input.value != url);
                selected.forEach(element => element.checked=false)
                refreshApex(this.displayurl);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 	MS_Error_Selecting_Prof,
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        } else {
            updateDisplayURL({ recordId: this.Id, url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png'})
            .then(result => {
                refreshApex(this.wiredActivities);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: MS_Error,
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        if(this.displayurl == null){
            updateDisplayURL({ recordId: this.Id, url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png'});
        }
        this.isModalOpen = false;
        setTimeout(()=>{
            this.closeQuickAction();
        },1000);
    }

    handlePriceChange(event){
        this.productPrice = event.target.value;
    }

    handleSubmit(event){
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
        refreshApex(this.wiredActivities);
        this.closeModal();
    }

    handleSuccess(event){
        const toastEvent = new ShowToastEvent ({
            title: MS_Product_Updated,
            message: MS_Product_Update,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);

        updateStandardPrice({ pricebookentryId: this.pricebookentry.Id, price: this.productPrice})
        .then(result => {
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: MS_Error_Update_Price,
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
        refreshApex(this.wiredActivities);
        eval("$A.get('e.force:refreshView').fire();"); 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.Id,
                objectApiName: 'Product2',
                actionName: 'view'
            },
        });
        setTimeout(()=>{
        window.location.reload();
        }, 1000);
        setTimeout(()=>{
            eval("$A.get('e.force:refreshView').fire();"); 
            this.closeQuickAction();
        },1000);
    }
}