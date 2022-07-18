import { LightningElement, wire, track } from 'lwc';
import getKnowledgeRecord from '@salesforce/apex/PW_CaseFormManage.getKnowledgeRecord';

export default class CustomFAQForm extends LightningElement {
    @track listKnowledge = [];
    @wire(getKnowledgeRecord)
    wiredResulted(result){
        const{data, error} = result;
        console.log( JSON.parse(JSON.stringify(result)));
            if(data){
                let tempList = data;
                tempList.forEach(element => {
                    if(element.DataCategoryGroupName == 'FAQ'){
                        this.listKnowledge.push(element);
                    }
                });
            }
        if(error){
           
        }
    }

}