import ElasticTextarea from './elastic-textarea';
import autofocusAndSelect from '../modifiers/autofocus-and-select';
import type { TOC } from '@ember/component/template-only';

interface AutofocusElasticTextareaSignature {
  Args: {
    onEnterPressed?: (value: string) => void;
    onEscapePressed?: () => void;
    value: string;
  };
  Element: HTMLTextAreaElement;
}

export default <template>
  <ElasticTextarea
    @value={{@value}}
    @onEnterPressed={{@onEnterPressed}}
    @onEscapePressed={{@onEscapePressed}}
    {{autofocusAndSelect}}
    ...attributes
  />
</template> satisfies TOC<AutofocusElasticTextareaSignature>;
