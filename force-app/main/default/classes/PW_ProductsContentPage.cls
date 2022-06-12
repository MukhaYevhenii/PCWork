public without sharing class PW_ProductsContentPage {
        @AuraEnabled(cacheable=true)
        public static List<PricebookEntry> getNewestProduct(Integer offsetNumber){
                return [SELECT Product2.Name, Product2.DisplayUrl, Product2.Model__c, Product2.Family, Product2.Producer__c, UnitPrice, Product2.CreatedDate 
                        FROM PricebookEntry WHERE Product2.CreatedDate >= LAST_N_DAYS:7 AND Product2.IsActive = true LIMIT 3 OFFSET :offsetNumber];
        }

        @AuraEnabled(cacheable = true)
        public static List<AggregateResult> getNumberOfRecords() {
                return [SELECT COUNT(Id) totalRecords FROM Product2 WHERE CreatedDate >= LAST_N_DAYS:7 AND Product2.IsActive=true];
        }
}
