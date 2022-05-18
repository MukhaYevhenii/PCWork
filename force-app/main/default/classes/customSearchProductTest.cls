@IsTest
public with sharing class customSearchProductTest {

    @TestSetup
    public static void testSetup() {
        Product2 productTest = new Product2(Name='CPU i5',Model__c='i5-4434',Producer__c='Intel',ProductCode='G88E',Available__c=true,Family='CPU');
        Product2 productTest2 = new Product2(Name='GPU AMD',Model__c='i5-4334',Producer__c='AMD',ProductCode='G82E',Available__c=true,Family='GPU');
        insert productTest2;
        insert productTest;
    }

    @IsTest
    public static void shouldReturnProductFromDatabaseWithConditions() {
        Product2 product = [SELECT Id, Name, Model__c, Producer__c, ProductCode, Available__c, Family FROM Product2 WHERE ProductCode='G88E'];
        List<Product2> productListFromDatabase = customSearchSobject.getProducts('CPU i5','i5-4434','G88E','Intel','CPU');
        Product2 productFromDatabse = productListFromDatabase.get(0);
        System.assertEquals(product.Id,productFromDatabse.Id);
    }


    @IsTest
    public static void shouldReturnProductFromDatabaseWithConditions2() {
        Product2 product = [SELECT Id, Name, Model__c, Producer__c, ProductCode, Available__c, Family FROM Product2 WHERE ProductCode='G88E'];
        List<Product2> productListFromDatabase = customSearchSobject.getProducts('GPU AMD','i5-4334','G82E','AMD','GPU');
        Product2 productFromDatabse = productListFromDatabase.get(0);
        System.assertEquals(product.Id,productFromDatabse.Id);
    }

}