define([
  'underscore'
  , 'backbone'
  , 'marionette'
], function(_, Backbone, Marionette){
  var View = Marionette.ItemView.extend({
    template: '#tv-ticket-grid-item-template',
    tagName: 'tr',

    serializeData: function(){
      return {
        model: this.model
      };
    },

    onRender: function() {
      
    }
  });

  return View;
});