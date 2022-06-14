({
    init: function(component, event, helper) {
      let idsJson = sessionStorage.getItem('customSearch--recordIds');
      if (!$A.util.isUndefinedOrNull(idsJson)) {
        let ids = JSON.parse(idsJson);
        component.set('v.recordIds', ids);
        sessionStorage.removeItem('customSearch--recordIds');
      }
    },
    
    handleChanged: function(cmp, message, helper) {
      if (message != null && message.getParam('recordData') != null) {
          let objects = message.getParam('recordData').value;
          cmp.set('v.recordIds', objects);
      }
    }
})