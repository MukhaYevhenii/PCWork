global class PW_GoogleAuth implements Auth.RegistrationHandler{

global User createUser(Id portalId, Auth.UserData data){
        Contact contact = new Contact();
        contact.accountId = [SELECT Id FROM account WHERE Name = 'Test Account' LIMIT 1].Id;
        contact.email = data.email;
        contact.firstName = data.firstName;
        
        if(String.IsNotBlank(data.lastName)){
            contact.lastName = data.lastName;
        }
        else{
            contact.lastName = '  ';
        }

        insert(contact);
        
        User u = new User();
        Profile p = [SELECT Id FROM profile WHERE name='Community Customer'];
        u.username = data.email.substring(0,data.email.indexOf('@')) + '@pcwork.com';
        
        u.CommunityNickname = data.firstName + '' + data.lastName;
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        String alias = data.email.substring(0,data.email.indexOf('@'));
        if(alias.length() > 8) {
            alias = alias.substring(0, 8);
        }
        u.alias = alias;
        u.languagelocalekey = 'en_US';
        u.localesidkey = 'en_US';
        u.emailEncodingKey = 'UTF-8';
        u.timeZoneSidKey = 'America/Los_Angeles';
        u.profileId = p.Id;
        u.contactId = contact.Id;
        return u;
}
    
global void updateUser(Id userId, Id portalId, Auth.UserData data){
    User u = new User(id=userId);
    u.email = data.email;
    u.lastName = data.lastName;
    u.firstName = data.firstName;
    update(u);
}
}