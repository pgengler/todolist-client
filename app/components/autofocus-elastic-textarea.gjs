import ElasticTextarea from './elastic-textarea';
import autofocusAndSelect from '../modifiers/autofocus-and-select';

<template>
  <ElasticTextarea
    @value={{@value}}
    @onEnterPressed={{@onEnterPressed}}
    @onEscapePressed={{@onEscapePressed}}
    {{autofocusAndSelect}}
    ...attributes
  />
</template>
