import Ember from 'ember';

export function filterBy(arrProp, field, val) {
	return Ember.computed(arrProp + '.@each.' + field, {
		get() {
			return this.get(arrProp).filterBy(field, val);
		}
	});
}

export function sortBy(arrProp, sortField, func) {
	return Ember.computed(arrProp, {
		get() {
			if (func) {
				return this.get(arrProp).toArray().sort(function(a, b) {
					const modifiedA = func(a.get(sortField));
					const modifiedB = func(b.get(sortField));
					return (modifiedA < modifiedB) ? -1 : ((modifiedA > modifiedB) ? 1 : 0);
				});
			} else {
				return this.get(arrProp).toArray().sortBy(sortField);
			}
		}
	});
}
