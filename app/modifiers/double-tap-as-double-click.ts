import { modifier } from 'ember-modifier';

type TouchEventInfo = {
  clientX: number;
  clientY: number;
  when: number;
};

export default modifier(function doubleTapAsDoubleClick(element: Element) {
  let lastTouchEndEventInfo: TouchEventInfo | null = null;

  const touchEndHandler = function (event: TouchEvent) {
    const now = Date.now();
    const touch = event.changedTouches[0];
    if (!touch) return;

    const previousTouchEndEventInfo = lastTouchEndEventInfo;
    lastTouchEndEventInfo = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      when: now,
    };
    if (!previousTouchEndEventInfo) {
      return;
    }

    if (now - previousTouchEndEventInfo.when < 500) {
      const xDistance = Math.abs(previousTouchEndEventInfo.clientX - touch.clientX);
      const yDistance = Math.abs(previousTouchEndEventInfo.clientY - touch.clientY);

      if (xDistance < 40 && yDistance < 40) {
        const doubleClickEvent = document.createEvent('MouseEvents');
        doubleClickEvent.initMouseEvent(
          'dblclick',
          true, // click bubbles
          true, // click cancelable
          event.view ?? window, // copy view
          2, // click count
          // copy coordinates
          touch.screenX,
          touch.screenY,
          touch.clientX,
          touch.clientY,
          // copy key modifiers
          event.ctrlKey,
          event.altKey,
          event.shiftKey,
          event.metaKey,
          0, // mouse button; 0: left, 1: middle, 2: right
          null // relatedTarget
        );

        event.target?.dispatchEvent(doubleClickEvent);
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };

  element.addEventListener('touchend', touchEndHandler as EventListener);

  return () => {
    element.removeEventListener('touchend', touchEndHandler as EventListener);
  };
});
