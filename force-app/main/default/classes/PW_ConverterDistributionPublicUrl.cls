public with sharing class PW_ConverterDistributionPublicUrl {
    @AuraEnabled(cacheable=true)
    public static String convertPublicUrlToImageTag(String contectVersionId){
        ContentDistribution contDistribution = [select Id, DistributionPublicUrl FROM ContentDistribution WHERE ContentVersionId = :contectVersionId];
        String finalUrl = System.Url.getOrgDomainUrl().toExternalForm() + '/sfc/dist/version/renditionDownload?rendition=THUMB720BY480&versionId=';
        finalUrl += contectVersionId + '&operationContext=DELIVERY&contentID=';
        finalUrl += 'abc';
        String publicUrl = (String)contDistribution.get('DistributionPublicUrl');
        publicUrl = !String.isEmpty(publicUrl) ? publicUrl.split('/a') [publicUrl.split('/a').size() - 1] : '';
        finalUrl += '&page=0&d=/a' + publicUrl + '&oid=' + UserInfo.getOrganizationId();
        return finalUrl;
    }
}