define([
  'underscore'
  , 'backbone'
  , 'basecollection'
  , 'models/ticket_type'
], function(_, Backbone, BaseCollection, Model){
  return BaseCollection.extend({
    model: Model
  });
})