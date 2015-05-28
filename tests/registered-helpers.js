import Ember from 'ember';

Ember.Test.registerHelper( 'create', function (app, objType, properties) {
	Ember.run(function() {
		properties = Ember.$.extend({ id: createGuid() }, properties);
		store(app).push(objType, properties);
	});
	return store(app).getById(objType, properties.id);
});

function createGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r & 0x3 | 0x8 );
		return v.toString(16);
	});
}

function store(app) {
	return container(app).lookup('store:main');
}

function container(app) {
	return app.__container__;
}
