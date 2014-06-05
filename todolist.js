(function() {

var App = Ember.Application.create();
App.ApplicationAdapter = DS.FixtureAdapter.extend();

Ember.Handlebars.helper('formatDate', function(value) {
	if (value) {
		return value.strftime('%a (%m/%d)');
	}
	return "--";
});

Ember.Handlebars.helper('formatTimes', function(startTime, endTime) {
    if (startTime && endTime) {
        return startTime + '-' + endTime;
    } else if (startTime) {
        return startTime;
    } else if (endTime) {
        return '-' + endTime;
    }
    return "";
});

App.Router.map(function() {
	this.route('items');
	this.route('tags');
});

App.ItemsRoute = Ember.Route.extend({
	model: function() {
		return this.store.findAll('item');
	}
});

App.TagsRoute = Ember.Route.extend({
	model: function() {
		return this.store.findAll('tag');
	}
});

App.ItemsController = Ember.ArrayController.extend({
	sortProperties: [ 'date', 'startTime', 'endTime', 'event', 'location' ]
});

App.ItemController = Ember.ObjectController.extend({
   isCurrent: function() {
       return datesEqual(this.get('date'), new Date());
   }.property('model.date'),
    isPast: function() {
        return dateLessThan(this.get('date'), new Date());
    }.property('model.date'),
    isFuture: function() {
        return dateGreaterThan(this.get('date'), new Date());
    }.property('model.date'),
    isUndated: function() {
        return !this.get('date');
    }.property('model.date')
});

App.Item = DS.Model.extend({
	done: DS.attr('boolean'),
	date: DS.attr('date'),
	event: DS.attr('string'),
	location: DS.attr('string'),
	startTime: DS.attr('number'),
	endTime: DS.attr('number'),

	tags: DS.hasMany('tag', { async: true })
});

App.Tag = DS.Model.extend({
	style: DS.attr('number'),
	name: DS.attr('string'),
	items: DS.hasMany('item', { async: true }),

	styleClass: function() {
		return "style" + this.get('style');
	}.property('style')
});

App.Item.FIXTURES = [
	{ id: 1, done: false, date: new Date(), event: "Rewrite todolist UI with Ember", location: null, startTime: null, endTime: null, tags: [ 1, 2 ] },
	{ id: 2, done: true, date: new Date(), event: "Create some fixture data", location: null, startTime: null, endTime: null, tags: [ ] },
	{ id: 3, done: false, date: new Date(), event: "With a start time only", location: null, startTime: '0400', endTime: null, tags: [ ] },
	{ id: 4, done: false, date: new Date(), event: "With an end time only", location: null, startTime: null, endTime: '1600', tags: [ ] },
	{ id: 5, done: false, date: new Date(), event: "With start and times", location: null, startTime: '0400', endTime: '1600', tags: [ ] },
	{ id: 6, done: false, date: null, event: "Item without a date", location: null, startTime: null, endTime: null, tags: [ ] },
	{ id: 7, done: false, date: new Date("2014-04-07T23:59:59"), event: "Item with an older date", location: null, startTime: null, endTime: null, tags: [ ] },
	{ id: 8, done: false, date: new Date("2999-01-01T12:00:00"), event: "Way-in-the-future item", location: null, startTime: null, endTime: null, tags: [ ] }
];

App.Tag.FIXTURES = [
	{ id: 1, style: 1, name: 'first tag', items: [ 1 ] },
	{ id: 2, style: 2, name: 'second tag' },
	{ id: 3, style: 0, name: 'third tag' }
];

function datesEqual(a, b)
{
    if (!a && !b) {
        return true;
    }
    if ((a && !b) || (!a && b)) {
        return false;
    }
	return (a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate());
}

function dateLessThan(a, b)
{
	if (!a && !b) {
		// null on both sides is considered equal
		return false;
	}

	if (!a && b) {
		// null on the left is considered less than any value on the right
		return true;
	}

	if (!b) {
		// null on the right will never be less than any value on the left
		return false;
	}

	if (a.getFullYear() < b.getFullYear()) {
		return true;
	} else if (a.getFullYear() > b.getFullYear()) {
		return false;
	}
	if (a.getMonth() < b.getMonth()) {
		return true;
	} else if (a.getMonth() > b.getMonth()) {
		return false;
	}
	return (a.getDate() < b.getDate());
}

function dateGreaterThan(a, b)
{
	return (!datesEqual(a, b) && !dateLessThan(a, b));
}

})();
