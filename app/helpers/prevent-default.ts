export default function preventDefault(fn?: (event: Event) => void) {
  return (event: Event) => {
    event.preventDefault();
    if (fn) fn(event);
  };
}
