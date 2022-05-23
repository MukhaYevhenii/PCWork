({
    init: function(cmp, evt, helper) {
        var myPageRef = cmp.get("v.pageReference");
        var firstname = myPageRef.state.RecordId;
        cmp.set("v.firstname", firstname);
    }
})
