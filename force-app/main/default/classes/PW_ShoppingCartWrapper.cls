global without sharing class PW_ShoppingCartWrapper {
    @AuraEnabled
    global String Id {get;set;}
    @AuraEnabled
    global Integer count {get;set;}
    @AuraEnabled
    global Decimal price {get;set;}

    global PW_ShoppingCartWrapper() {

    }

    global PW_ShoppingCartWrapper(Id product, Integer count, Decimal price) {
        this.Id = product;
        this.count = count;
        this.price = price;
    }
}