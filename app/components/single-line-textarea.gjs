<textarea
  {{on "keydown" this.handleKeyDown}}
  {{on "keyup" this.handleKeyUp}}
  ...attributes
>{{@value}}</textarea>