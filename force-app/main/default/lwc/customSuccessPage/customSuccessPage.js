import { LightningElement, api } from 'lwc';
import MS_Success_Page_Text from '@salesforce/label/c.MS_Success_Page_Text';
import MS_Success_Page_Text2 from '@salesforce/label/c.MS_Success_Page_Text2';

export default class CustomSuccessPage extends LightningElement {
    @api textReview = false;
    label = {MS_Success_Page_Text,MS_Success_Page_Text2}
}