import { on } from '@ember/modifier';
import preventDefault from '../helpers/prevent-default';
import { Input } from '@ember/component';

<template>
  <form class="login-form" {{on "submit" (preventDefault @controller.login)}}>
    <table>
      <tbody>
        <tr>
          <td>
            <label for="email">Email address</label>
          </td>
          <td>
            <Input @type="text" @value={{@controller.email}} id="email" />
          </td>
        </tr>
        <tr>
          <td>
            <label for="password">Password</label>
          </td>
          <td>
            <Input @type="password" @value={{@controller.password}} id="password" />
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="submit">Log in</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</template>
