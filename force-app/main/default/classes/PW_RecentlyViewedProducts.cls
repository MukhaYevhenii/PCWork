public without sharing class PW_RecentlyViewedProducts {

    @AuraEnabled(cacheable=true)
    public static List<Product2> getRecentlyViewedProducts(Integer offsetNumber){
        List<RecentlyViewed> recentlyViewedProductsId = [SELECT Id FROM RecentlyViewed WHERE Type='Product2' AND LastViewedDate = LAST_N_DAYS:7 ORDER BY LastViewedDate DESC LIMIT 5];
        Set<Id> productIds = new Set<Id>();
        for (RecentlyViewed s : recentlyViewedProductsId) {
            productIds.add(s.Id);
        }
        return [SELECT Id, Name, Model__c, Family, Producer__c, DisplayUrl, Available__c FROM Product2 WHERE Id IN:productIds ORDER BY Name LIMIT 1 OFFSET :offsetNumber];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getNumberOfRecords() {
        return [SELECT COUNT(Id) totalRecords FROM RecentlyViewed  WHERE Type='Product2' AND LastViewedDate = LAST_N_DAYS:7];
    }
}