import { computed } from '@ember/object';

export function filterBy(arrProp, field, val) {
  return computed(`${arrProp}.@each.${field}`, {
    get() {
      return this.get(arrProp).filterBy(field, val);
    }
  });
}

export function sortBy(arrProp, sortField, func) {
  return computed(`${arrProp}.@each.${sortField}`, {
    get() {
      if (func) {
        return this.get(arrProp).toArray().sort(function(a, b) {
          let modifiedA = func(a.get(sortField));
          let modifiedB = func(b.get(sortField));
          return (modifiedA < modifiedB) ? -1 : ((modifiedA > modifiedB) ? 1 : 0);
        });
      } else {
        return this.get(arrProp).toArray().sortBy(sortField);
      }
    }
  });
}
