@IsTest
public with sharing class PW_CustomSearchCommunityControllerTest {
    @TestSetup
    public static void testSetup() {
        Product2 productTest = new Product2(Name='CPU i5',Model__c='i5-4434',Producer__c='Intel',ProductCode='G88E',isActive=true,Family='CPU');
        insert productTest;
    }

    @IsTest
    public static void shouldReturnNothingSQLInjectionInput() {
        List<Product2> products = PW_CustomSearchCommunityController.searchForIds('%');
        System.assertEquals(0,products.size());
    }

    @IsTest
    public static void shouldReturnIdIntelProduct() {
        Product2 product = [SELECT Id FROM Product2 WHERE ProductCode='G88E'];
        List<Product2> ids = PW_CustomSearchCommunityController.searchForIds('Intel');
        System.assertEquals(product.Id,ids[0].Id);
    }

}


