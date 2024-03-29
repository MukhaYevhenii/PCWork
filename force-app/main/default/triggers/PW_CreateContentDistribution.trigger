trigger PW_CreateContentDistribution on ContentVersion (after insert) {
    for(ContentVersion tempVersion : Trigger.New){
        insert new ContentDistribution(Name = tempVersion.Title, 
        ContentVersionId = tempVersion.Id,
        PreferencesAllowViewInBrowser= true);
    }
}