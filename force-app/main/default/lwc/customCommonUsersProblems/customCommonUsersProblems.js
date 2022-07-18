import { LightningElement, wire, track } from 'lwc';
import getKnowledgeRecord from '@salesforce/apex/PW_CaseFormManage.getKnowledgeRecord';
import MS_Common_Users_Problems from '@salesforce/label/c.MS_Common_Users_Problems';
export default class CustomCommonUsersProblems extends LightningElement {
    label = {MS_Common_Users_Problems}
    @track listKnowledge = [];
    @wire(getKnowledgeRecord)
    wiredResulted(result){
        const{data, error} = result;
        console.log( JSON.parse(JSON.stringify(result)));
            if(data){
                let tempList = data;
                tempList.forEach(element => {
                    if(element.DataCategoryGroupName == 'Common_User_Problems'){
                        this.listKnowledge.push(element);
                    }
                });
            }
        if(error){
           
        }
    }
}