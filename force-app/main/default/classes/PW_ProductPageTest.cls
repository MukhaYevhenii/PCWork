@IsTest
public with sharing class PW_ProductPageTest {

    @TestSetup
    public static void testSetup() {
        Pricebook2 standartPricebook = new Pricebook2(
            Id=Test.getStandardPricebookId(), 
            IsActive=true);
        update  standartPricebook;

        Product2 productTest = new Product2(
            Name='GPU i5',
            Model__c='i8-2034',
            Producer__c='Intel',
            ProductCode='KK90',
            Family='GPU',
            IsActive=true);
        insert productTest;

        Product2 productTest2 = new Product2(
            Name='GPU XSDA123',
            Model__c='XSDA',
            Producer__c='Samsung',
            ProductCode='MM827',
            Family='GPU',
            IsActive=true);
        insert productTest2;

        PricebookEntry standartPrice = new PricebookEntry(
            UnitPrice=500,
            Product2Id=productTest.Id, 
            Pricebook2Id=standartPricebook.Id, 
            IsActive=true);
        insert standartPrice;

        Product_Review__c reviewProd = new Product_Review__c(
            Name='Test',
            Product__c=productTest.Id,
            Rating__c=2,
            AcceptReview__c=true);
        insert reviewProd;

        ContentVersion content=new ContentVersion(); 
        content.Title='Title_Picture'; 
        content.FirstPublishLocationId = productTest.Id;
        content.PathOnClient='/' + content.Title + '.jpg'; 
        Blob bodyBlob=Blob.valueOf('Test ContentVersion Body'); 
        content.VersionData=bodyBlob; 
        insert content;
    }

    @IsTest
    public static void shouldReturnProductUnitPrice() {
        Product2 product = [
            SELECT Id 
            FROM Product2 
            WHERE ProductCode='KK90'];
        List<PricebookEntry> productPrice = PW_ProductPage.getProductPrice(product.Id);
        System.assertEquals(500,productPrice[0].UnitPrice);
    }

    @IsTest
    public static void shouldReturnProductAllReviews() {
        Product2 product = [
            SELECT Id 
            FROM Product2 
            WHERE ProductCode='KK90'];
        List<Product_Review__c> reviews = PW_ProductPage.getAllReviews(product.Id);
        System.assertEquals(1,reviews.size());
    }

    @IsTest
    public static void shouldReturnProductAverageRating() {
        Product2 product = [
            SELECT Id 
            FROM Product2 
            WHERE ProductCode='KK90'];
        List<AggregateResult> productReviews = PW_ProductPage.getProductReview(product.Id);
        Decimal temp = (Decimal) productReviews[0].get('AverageRating');
        System.assertEquals(2,temp);
    }

    @IsTest
    public static void shouldReturnContentProductLink() {
        Product2 product = [
            SELECT Id 
            FROM Product2 
            WHERE ProductCode='KK90'];
        List<ContentDocumentLink> contentDocumentLink = PW_ProductPage.getImages(product.Id);
        System.assertEquals(1,contentDocumentLink.size());
    }

    @IsTest
    public static void shouldReturnOneReviewProduct() {
        Product2 product = [
            SELECT Id,CreatedBy.Id 
            FROM Product2 
            WHERE ProductCode='KK90'];

        List<Product_Review__c> reviewProduct = PW_ProductPage.userHasReviewCheck(product.CreatedBy.Id,product.Id);
        System.assertEquals(1,reviewProduct.size());
    }
}