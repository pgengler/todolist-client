import Application from 'ember-todo/app';
import config from 'ember-todo/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

import './helpers/flash-message';

setApplication(Application.create(config.APP));

start();
