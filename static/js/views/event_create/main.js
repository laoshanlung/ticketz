define([
  'underscore'
  , 'marionette'
  , 'views/event_create/edit/main'
  , 'views/event_create/design/main'
], function(_, Marionette, EditTabView, DesignTabView){
  return Marionette.Layout.extend({
    template: '#ec-layout-template',
    regions: {
      
    },

    onRender: function() {
      var self = this;
      self.renderTab('edit');

      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var tabName = $(e.target).attr('href');
        tabName = tabName.substr(1, tabName.length);
        self.renderTab(tabName);
      });
    },

    tabs: {
      'edit': EditTabView,
      'design': DesignTabView
    },

    renderTab: function(tabName) {
      if (!this[tabName]) {
        var tabView = new this.tabs[tabName]({
          el: '#'+tabName,
          model: this.model
        });
        tabView.render();
        this[tabName] = tabView;          
      }
    }
  });
})