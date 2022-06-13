public without sharing class PW_CustomSearchCommunityController {
  @AuraEnabled
    public static List<Product2> searchForIds(String searchText) {
      List<Product2> results = new List<Product2>();
      if(searchText.containsAny('%')){
        return results;
      }
      
      String inputSearch = '%'+searchText+'%';
      results = [SELECT Id, DisplayUrl, Family, Model__c, Name, Producer__c FROM Product2 WHERE isActive = true AND (
      Name LIKE :inputSearch OR 
      Model__c LIKE :inputSearch OR 
      Producer__c LIKE :inputSearch OR 
      Family LIKE :inputSearch)];
      return results;
    }
  }