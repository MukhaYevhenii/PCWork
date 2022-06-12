@IsTest
public with sharing class PW_ContentDistributionLinksTest {
    @TestSetup
    public static void testSetup() {
        ContentVersion cv=new Contentversion();
        cv.title='ABC';
        cv.PathOnClient ='test';
        Blob b=Blob.valueOf('Unit Test Attachment Body');
        cv.versiondata=EncodingUtil.base64Decode('Unit Test Attachment Body');
        insert cv;
    }

    @IsTest
    public static void shouldReturnDownloadLink() {
        ContentVersion contentVersionTemp = [SELECT Id FROM ContentVersion LIMIT 1];
        String downloadLink = PW_ContentDistributionLinks.getContentDownloadUrl(contentVersionTemp.Id);
        System.assertNotEquals('',downloadLink);
    }
}
