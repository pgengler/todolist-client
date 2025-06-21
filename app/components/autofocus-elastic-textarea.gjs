import ElasticTextarea from "./elastic-textarea.gjs";
import autofocusAndSelect from "../modifiers/autofocus-and-select.js";
<template><ElasticTextarea @value={{@value}} @onEnterPressed={{@onEnterPressed}} @onEscapePressed={{@onEscapePressed}} {{autofocusAndSelect}} ...attributes /></template>