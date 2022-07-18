trigger PW_CreateContentDocumentLink on ContentDocumentLink (after insert) {
    // List <ContentDocumentLink> contenDocLinkToUpdate = new List<ContentDocumentLink>();
    // String idOfRecord = '';
    // for(ContentDocumentLink c: Trigger.New){
    //     idOfRecord = c.Id;
    // }
    // List <ContentDocumentLink> contDocLink = [SELECT  Id, ShareType, Visibility FROM ContentDocumentLink WHERE Id =:idOfRecord];
        
    // for(ContentDocumentLink content: contDocLink){
    //     content.ShareType = 'V';
    //     content.Visibility = 'AllUsers';
    //     contenDocLinkToUpdate.add(content);
    // }
    // update contenDocLinkToUpdate; 
}