@IsTest
public with sharing class PW_CacheManageTest {
    @TestSetup
    public static void makeData(){
        Pricebook2 standartPricebook = new Pricebook2(
            Id=Test.getStandardPricebookId(),
            IsActive=true);
        Product2 productTest = new Product2(
            Name='GPU i5',
            Model__c='i8-2034',
            Producer__c='Intel',
            ProductCode='KK90',
            Family='GPU',
            IsActive=true);
        insert productTest;
        PricebookEntry standartPrice = new PricebookEntry(
            UnitPrice=1000,
            Product2Id=productTest.Id, 
            Pricebook2Id=standartPricebook.Id, 
            IsActive=true);
        insert standartPrice;

        Account account = new Account(Name='Test Account');
        insert account;

        Order order = new Order(
            Name = 'Test Order', 
            Status = 'Draft', 
            EffectiveDate = system.today(), 
            AccountId = account.Id, 
            Pricebook2Id =  standartPricebook.Id);
        insert order;

        OrderItem item = new OrderItem(
            OrderId = order.Id,
            Quantity = 1,
            UnitPrice = 1000,
            Product2id = productTest.Id,
            PricebookEntryId = standartPrice.Id);
        insert item;

    }

    @IsTest
    public static void shouldCreateWrapperListInCache(){
        Product2 idProduct = [SELECT Id FROM Product2 WHERE Name = 'GPU i5'];
        PW_CacheManage.addToCache(idProduct.Id);
        PW_CacheManage.addToCache(idProduct.Id);
        List<PW_ShoppingCartWrapper> wrapperProductList = PW_CacheManage.getFromCache();
        System.assertEquals(2,wrapperProductList[0].count);
    }

    @IsTest
    public static void shouldClearCache(){
        Product2 idProduct = [SELECT Id FROM Product2 WHERE Name = 'GPU i5'];
        PW_CacheManage.addToCache(idProduct.Id);
        PW_CacheManage.clearShoppingCart();
        List<PW_ShoppingCartWrapper> wrapperProductList = PW_CacheManage.getFromCache();
        System.assertEquals(0,wrapperProductList.size());
    }

    @IsTest
    public static void shouldRemoveItemFromCache(){
        Product2 idProduct = [SELECT Id FROM Product2 WHERE Name = 'GPU i5'];
        PW_CacheManage.addToCache(idProduct.Id);
        PW_CacheManage.removeFromCache(idProduct.Id);
        List<PW_ShoppingCartWrapper> wrapperProductList = PW_CacheManage.getFromCache();
        System.assertEquals(0,wrapperProductList.size());
    }

    @IsTest
    public static void shouldUpdateCountOfProductInCahce(){
        Product2 idProduct = [SELECT Id FROM Product2 WHERE Name = 'GPU i5'];
        PW_CacheManage.addToCache(idProduct.Id);
        PW_CacheManage.updateCountProductCache(idProduct.Id, 5);
        List<PW_ShoppingCartWrapper> wrapperProductList = PW_CacheManage.getFromCache();
        System.assertEquals(5,wrapperProductList[0].count);
    }

    @IsTest
    public static void shouldGetStandardProductPrice(){
        Product2 product = [SELECT Id FROM Product2 WHERE Name = 'GPU i5'] ;
        PricebookEntry entry = PW_CacheManage.getProductPrice(product.Id);
        System.assertEquals(1000,entry.UnitPrice);
    }

    @IsTest
    public static void shouldReturnAccountId(){
        Id accountTest = PW_CacheManage.getAccount();
        Id account = [SELECT Id FROM Account WHERE Name = 'Test Account'].Id;
        System.assertEquals(account,accountTest);
    }

    @IsTest
    public static void shouldCreateContract(){
        Id contractID = PW_CacheManage.createContract();
        List<Contract> contractList = [SELECT Id, ContractTerm FROM Contract WHERE Id = :contractID];
        System.assertEquals(24,contractList[0].ContractTerm);
    }

    @IsTest
    public static void shouldParseWrapperToOrder(){
        Order order = [SELECT Id FROM Order WHERE Name='Test Order'];
        PW_ShoppingCartWrapper wrapper = new PW_ShoppingCartWrapper([SELECT Id FROM Product2 WHERE Name = 'GPU i5'].Id, 10, 1000);
        PW_CacheManage.parseWrapperToOrderItem(wrapper, order.Id);
        List<OrderItem> orderItem = [SELECT Id FROM OrderItem];
        System.assertEquals(2,orderItem.size());
    }

    @IsTest
    public static void shouldGetProductsOfOrder(){
        Order order = [SELECT Id FROM Order WHERE Name='Test Order'];
        System.assertEquals(1,PW_CacheManage.getProductsOfOrder(order.Id).size());
    }
}