import Component from '@glimmer/component';

interface FaIconSignature {
  Args: {
    icon: string;
    prefix?: string;
  };
  Element: HTMLDivElement;
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class FaIcon extends Component<FaIconSignature> {}
