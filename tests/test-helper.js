import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';

import './registered-helpers';

setResolver(resolver);
