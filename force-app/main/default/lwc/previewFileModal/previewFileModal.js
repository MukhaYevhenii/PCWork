import { LightningElement, api } from 'lwc';
import MS_File_Preview from '@salesforce/label/c.MS_File_Preview';
import MS_Cancel_Button from '@salesforce/label/c.MS_Cancel_Button';


export default class PreviewFileModal extends LightningElement {
    label = {MS_File_Preview, MS_Cancel_Button}
    @api url;
    @api fileExtension;
    showFrame = false;
    showModal = false;

    @api show(){
        if(this.fileExtension === "pdf") this.showFrame = true;
        else this.showFrame = false;
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;
    }
}