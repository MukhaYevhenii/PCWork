({
    handleClick : function(component, event, helper) {
      var searchText = component.get('v.searchText');
      var action = component.get('c.searchForIds');
      action.setParams({searchText: searchText});
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === 'SUCCESS') {
          var objects = response.getReturnValue();
          if(objects.length==0){
            var toastEvent = $A.get("e.force:showToast");
              toastEvent.setParams({
                 "title": 'Information',
                 "message": 'No products were found.',
                 "type": 'info'
              });
              toastEvent.fire();
              var navEvt = $A.get('e.force:navigateToURL');
              navEvt.setParams({url: '/'});
              navEvt.fire();
              return;
          }
          sessionStorage.setItem('customSearch--recordIds', JSON.stringify(objects));
          var navEvt = $A.get('e.force:navigateToURL');
          navEvt.setParams({url: '/custom-search-results'});
          navEvt.fire();
        }
      });
      $A.enqueueAction(action);
    }
})