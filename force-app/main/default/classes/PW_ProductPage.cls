public without sharing class PW_ProductPage {
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentLink> getImages(Id recordId){
        String query = 'SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId';
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> getProductPrice(String recordId){
        return [SELECT UnitPrice 
                FROM PricebookEntry 
                WHERE Product2Id =:recordId];
    }

    @AuraEnabled
    public static List<Product_Review__c> getAllReviews(String productId) {
        return [SELECT Id, Name, Comment__c, Rating__c,  LastModifiedDate, AcceptReview__c, CreatedDate, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedById, CreatedBy.PhotoUrl__c
                FROM Product_Review__c
                WHERE Product__c =:productId
                AND AcceptReview__c = true
                ORDER BY CreatedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getProductReview(String recordId){
        return [SELECT COUNT(Id) CountRating, 
                AVG(Rating__c) AverageRating 
                FROM Product_Review__c 
                WHERE Product__r.Id = :recordId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product_Review__c> userHasReviewCheck(Id userID, Id productId){
        return [SELECT Id, CreatedBy.Id, AcceptReview__c FROM Product_Review__c WHERE CreatedBy.Id = :userID AND Product__c = :productId];
    }
}