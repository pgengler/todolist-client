import SingleLineTextarea from './single-line-textarea';
import elasticTextarea from '../modifiers/elastic-textarea';
import type { TOC } from '@ember/component/template-only';

interface ElasticTextareaSignature {
  Args: {
    onEnterPressed?: (value: string) => void;
    onEscapePressed?: () => void;
    value: string;
  };
  Element: HTMLTextAreaElement;
}

export default <template>
  <SingleLineTextarea
    @value={{@value}}
    @onEnterPressed={{@onEnterPressed}}
    @onEscapePressed={{@onEscapePressed}}
    {{elasticTextarea}}
    ...attributes
  />
</template> satisfies TOC<ElasticTextareaSignature>;
