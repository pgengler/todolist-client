import { modifier } from 'ember-modifier';

export default modifier(
  function elasticTextarea(element) {
    let resize = () => {
      element.style.height = '1px';
      window.requestAnimationFrame(() => {
        element.style.height = `${element.scrollHeight}px`;
      });
    };
    element.addEventListener('input', resize);
    resize();

    return () => {
      element.removeEventListener('input', resize);
    };
  },
  { eager: false },
);
