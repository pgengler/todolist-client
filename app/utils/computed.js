import Ember from 'ember';

export function filterBy(arrProp, field, val) {
	return Ember.computed(arrProp + '.@each.' + field, function() {
		return this.get(arrProp).filterBy(field, val);
	});
}

export function sortBy(arrProp, sortField, func) {
	return Ember.computed(arrProp, function() {
		if (func) {
			return this.get(arrProp).toArray().sort(function(a, b) {
				var modifiedA = func(a.get(sortField));
				var modifiedB = func(b.get(sortField));
				return (modifiedA < modifiedB) ? -1 : ((modifiedA > modifiedB) ? 1 : 0);
			});
		} else {
			return this.get(arrProp).toArray().sortBy(sortField);
		}
	});
}
