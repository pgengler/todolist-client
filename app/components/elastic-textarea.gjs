import SingleLineTextarea from "./single-line-textarea.gjs";
import elasticTextarea from "../modifiers/elastic-textarea.js";
<template><SingleLineTextarea @value={{@value}} @onEnterPressed={{@onEnterPressed}} @onEscapePressed={{@onEscapePressed}} {{elasticTextarea}} ...attributes /></template>