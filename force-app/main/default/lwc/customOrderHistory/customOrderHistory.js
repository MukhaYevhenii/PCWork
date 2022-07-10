import { LightningElement, wire, track} from 'lwc';
import Id from '@salesforce/user/Id';
import getOrdersForUser from '@salesforce/apex/PW_CacheManage.getOrdersForUser';
import MS_Order_History from '@salesforce/label/c.MS_Order_History';

export default class CustomOrderHistory extends LightningElement {
    @track ordersList;
    @track order;
    @track isModalOpen = false;
    wiredActivities;
    label={MS_Order_History}

    @wire(getOrdersForUser, {userId: Id})
    wiredResulted(result){
        this.wiredActivities = result;
        this.ordersList = [];
        const{data, error} = result;
            if(data){
               this.ordersList = data;
            }
        if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title:  error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    handleOpenModal(event){
        this.isModalOpen = true;
        this.order = event.detail;
    }

    handleCloseModal(){
        this.isModalOpen = false;
    }
}