public without sharing class PW_CacheManage {
    
    @AuraEnabled(cacheable=true)
    public static void addToCache(Id product){
        List<PW_ShoppingCartWrapper> wrapperProductList = (List<PW_ShoppingCartWrapper> ) Cache.Session.get('CacheCurrency');
        if(wrapperProductList == null){
            wrapperProductList = new  List<PW_ShoppingCartWrapper>();
            wrapperProductList.add(new PW_ShoppingCartWrapper(product, 1, PW_ProductPage.getProductPrice(product)[0].UnitPrice));
            Cache.Session.put('CacheCurrency', wrapperProductList);
        }
        else {
            Boolean checkForProduct = false;
            for (Integer i = 0; i < wrapperProductList.size(); i++) {
                if(wrapperProductList[i].Id == product){
                    wrapperProductList[i].count++;
                    checkForProduct = true;
                }
            }
            if(!checkForProduct){
                wrapperProductList.add(new PW_ShoppingCartWrapper(product, 1, PW_ProductPage.getProductPrice(product)[0].UnitPrice));
            }
            
            Cache.Session.put('CacheCurrency', wrapperProductList);
        } 
    }

    @AuraEnabled(cacheable=true)
    public static void clearShoppingCart(){
        List<PW_ShoppingCartWrapper> wrapperProductList = (List<PW_ShoppingCartWrapper> ) Cache.Session.get('CacheCurrency');
        wrapperProductList = new  List<PW_ShoppingCartWrapper>();
        Cache.Session.put('CacheCurrency', wrapperProductList);
    }

    @AuraEnabled(cacheable=true)
    public static List<PW_ShoppingCartWrapper> getFromCache(){
        return (List<PW_ShoppingCartWrapper> ) Cache.Session.get('CacheCurrency');
    }

    @AuraEnabled
    public static void removeFromCache(Id product){
        List<PW_ShoppingCartWrapper> wrapperProductList = (List<PW_ShoppingCartWrapper> ) Cache.Session.get('CacheCurrency');

        if(wrapperProductList != null){
            for (Integer i = 0; i < wrapperProductList.size(); i++) {
                if(wrapperProductList[i].Id == product){
                    wrapperProductList.remove(i); 
                }
            }
            Cache.Session.put('CacheCurrency', wrapperProductList);
        }
    }

    @AuraEnabled
    public static void updateCountProductCache(Id product, Integer count){
        List<PW_ShoppingCartWrapper> wrapperProductList = (List<PW_ShoppingCartWrapper> ) Cache.Session.get('CacheCurrency');
            for (Integer i = 0; i < wrapperProductList.size(); i++) {
                if(wrapperProductList[i].Id == product){
                    wrapperProductList[i].count = count;

                }
            }
            Cache.Session.put('CacheCurrency', wrapperProductList);
    }

    @AuraEnabled(cacheable = true)
    public static Id getStandardPricebook(){
        return [SELECT Id, Name FROM Pricebook2 WHERE Name='Standard Price Book' LIMIT 1].Id;
    }

    @AuraEnabled(cacheable = true)
    public static Id getAccount(){
        return [SELECT Id FROM account WHERE Name = 'Test Account' LIMIT 1].Id;
    }

    @AuraEnabled
    public static Id createContract(){
        Contract contract = new Contract(
            AccountId = getAccount(),
            StartDate = System.today(),
            ContractTerm = 24
        );
        insert contract;
        return contract.Id;
    }

    @AuraEnabled
    public static PricebookEntry getProductPrice(String productId){
        return [SELECT Id, UnitPrice FROM PricebookEntry WHERE Product2Id =: productId LIMIT 1];
    }

    @AuraEnabled
    public static void parseWrapperToOrderItem(PW_ShoppingCartWrapper orderWrapper, Id orderId) {
        OrderItem orderItem = new OrderItem( 
            OrderId = orderId,
            Product2Id = orderWrapper.Id,
            Quantity = orderWrapper.count, 
            UnitPrice = orderWrapper.price,
            PricebookEntryId = getProductPrice(orderWrapper.Id).Id

            );
        insert orderItem;
    }

    @AuraEnabled(cacheable = true)
    public static List<Order> getOrdersForUser(Id userId){
        return [SELECT Id, Status, TotalAmount, EffectiveDate, OrderNumber FROM Order WHERE OwnerId =:userId];
    }
    
    @AuraEnabled(cacheable = true)
    public static List<OrderItem> getProductsOfOrder(Id orderId){
        return [SELECT Id, Quantity, Product2Id , UnitPrice, Product2.Name, Product2.DisplayUrl, TotalPrice FROM OrderItem WHERE OrderId =:orderId];
    }
}
