import SingleLineTextarea from './single-line-textarea';
import elasticTextarea from '../modifiers/elastic-textarea';

<template>
  <SingleLineTextarea
    @value={{@value}}
    @onEnterPressed={{@onEnterPressed}}
    @onEscapePressed={{@onEscapePressed}}
    {{elasticTextarea}}
    ...attributes
  />
</template>
