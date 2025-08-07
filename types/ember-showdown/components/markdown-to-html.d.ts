import Component from '@glimmer/component';

interface MarkdownToHtmlSignature {
  Args: {
    markdown: string | null | undefined;
  };
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class MarkdownToHtml extends Component<MarkdownToHtmlSignature> {}
