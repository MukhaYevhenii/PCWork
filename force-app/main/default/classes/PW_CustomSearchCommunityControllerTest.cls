@IsTest
public with sharing class PW_CustomSearchCommunityControllerTest {
    
    @TestSetup
    public static void testSetup() {
        Pricebook2 standartPricebook = new Pricebook2(Id=Test.getStandardPricebookId(), IsActive=true);
        update  standartPricebook;
        Product2 productTest = new Product2(Name='CPU i5',Model__c='i5-4434',Producer__c='Intel',ProductCode='G88E',Family='CPU',IsActive=true);
        insert productTest;
        PricebookEntry standartPrice = new PricebookEntry(UnitPrice=1000,Product2Id=productTest.Id, Pricebook2Id=standartPricebook.Id, IsActive=true);
        insert standartPrice;
    }

    @IsTest
    public static void shouldReturnNothingSQLInjectionInput() {
        List<PricebookEntry> products = PW_CustomSearchCommunityController.searchForIds('%');
        System.assertEquals(0,products.size());
    }

    @IsTest
    public static void shouldReturnIdIntelProduct() {
        List<PricebookEntry> ids = PW_CustomSearchCommunityController.searchForIds('Intel');
        PricebookEntry psr = ids[0];
        Product2 product = [SELECT Id FROM Product2 WHERE Id = :psr.Product2Id];
        System.assertEquals(product.Id,ids[0].Product2Id);
    }

    @IsTest
    public static void shouldReturnIdIntelProductUsingFilters() {
        List<PricebookEntry> firstList = PW_CustomSearchCommunityController.searchForIds('Intel');
        List<PricebookEntry> filtredList = PW_CustomSearchCommunityController.searchProductsByFilters('Intel','CPU',0,2000,firstList);
        PricebookEntry psr = filtredList[0];
        Product2 product = [SELECT Id FROM Product2 WHERE Id = :psr.Product2Id];
        System.assertEquals(product.Id,filtredList[0].Product2Id);
    }
}