({
    init: function(component, event, helper) {
      var idsJson = sessionStorage.getItem('customSearch--recordIds');
      if (!$A.util.isUndefinedOrNull(idsJson)) {
        var ids = JSON.parse(idsJson);
        console.log(ids);
        component.set('v.recordIds', ids);
        sessionStorage.removeItem('customSearch--recordIds');
      }
    }
  })