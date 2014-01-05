define([
  'underscore'
  , 'backbone'
  , 'models/validator'
  , 'models/controls/input'
  , 'models/controls/wysiwyg'
], function(_, Backbone, Validator, InputControlView, WysiwygControlView){
  return Backbone.Maze.Model.extend({
    controls: {
      'input': InputControlView,
      'wysiwyg': WysiwygControlView
    },

    rules: [],

    attributeLabels: {

    },

    getAttributeLabel: function(attr) {
      return this.attributeLabels[attr] || "NOT FOUND";
    },

    isValid: function() {
      return _.size(this.validationError) == 0;
    },

    validate: function(attributes, options) {
      attributes = attributes || this.attributes;
      var self = this;
      var errors = {};
      _.each(self.rules, function(rule){
        var attrs = rule[0].split(',');
        var validatorName = rule[1];
        var validatorOptions = rule[2];
        validatorOptions = validatorOptions || {};
        _.each(attrs, function(_attr){
          _attr = _.trim(_attr);
          _attr = _attr.split(' ');
          _.each(_attr, function(attr){
            if (typeof(attributes[attr]) != 'undefined') {
              if (self.get('scenario') && validatorOptions['on']) {
                if (_.indexOf(validatorOptions['on'], self.get('scenario')) == -1) {
                  return;
                }
              }

              if (_.isFunction(validatorOptions.message)) {
                validatorOptions.message = validatorOptions.message.apply(self, [attr]);
              }

              var result = null;
              if (Validator[validatorName]) {
                result = Validator[validatorName].apply(self, [attributes[attr], validatorOptions, attr]);  
              } else {
                result = self[validatorName].apply(self, [attributes[attr], validatorOptions, attr]);
              }
              
              if (result) {
                errors[attr] = errors[attr] || [];
                errors[attr].push(result);
              }
            }
          });
        });
      });

      if (_.size(errors) == 0) {
        return undefined;
      }
      return errors;
    },

    buildControl: function(options) {
      options.model = this;

      var control = new this.controls[options.type](options);
      control.render();
      return control;
    },
  });
})