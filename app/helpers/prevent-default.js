import { helper } from '@ember/component/helper';

export default helper(function preventDefault([fn] /*, hash*/) {
  return (event) => {
    event.preventDefault();
    if (fn) fn(event);
  };
});
