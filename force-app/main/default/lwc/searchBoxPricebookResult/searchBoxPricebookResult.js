import { LightningElement, track, api} from 'lwc';

const cols = [
    { label: "Name", fieldName:'Name', type: 'text'},
    { label: "Start date", fieldName:'Start_Date__c', type: 'date', typeAttributes:
    {year: "numeric",
    month: "long",
    day: "2-digit",}},
    { label: "End date", fieldName:'End_Date__c', type: 'date', typeAttributes:
    {year: "numeric",
    month: "long",
    day: "2-digit",}},
    { label: "IsActive", fieldName:'IsActive', type: 'boolean'},
];

export default class SearchBoxPricebookResult extends LightningElement {
    @api pricebook;
    @track pricebookList = [];
    
    connectedCallback(){
        this.pricebookList.push(this.pricebook);
    }

    get column(){
        return cols;
    }
}