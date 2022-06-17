({
    handleClick : function(component, event, helper) {
      helper.handleClick(component, event, helper);
    },

    keyCheck : function(component, event, helper){
      if (event.which == 13){
          helper.handleClick(component, event);
      }    
  }
})