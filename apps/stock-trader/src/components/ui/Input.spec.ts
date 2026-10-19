import { expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from './Input.vue';
import Button from './Button.vue';
import Badge from './Badge.vue';
it('defaults to a blank text input and emits strings', async () => {
  const wrapper = mount(Input);
  expect(wrapper.element.value).toBe('');
  await wrapper.get('input').setValue('AAPL');
  expect(wrapper.emitted('update:modelValue')).toEqual([['AAPL']]);
});
it('preserves numeric input constraints and emits numbers', async () => {
  const wrapper = mount(Input, {
    props: { type: 'number', modelValue: 2, min: 1, max: 10, step: 1 },
  });
  await wrapper.get('input').setValue('3');
  expect(wrapper.emitted('update:modelValue')).toEqual([[3]]);
  expect(wrapper.attributes()).toMatchObject({ min: '1', max: '10', step: '1' });
});
it('renders explicit submit buttons and default badge content', () => {
  const button = mount(Button, {
    props: { type: 'submit', size: 'lg', variant: 'secondary', class: 'px-8' },
    slots: { default: 'Save' },
  });
  expect(button.attributes('type')).toBe('submit');
  expect(button.classes()).toContain('px-8');
  expect(mount(Badge, { slots: { default: 'Ready' } }).text()).toBe('Ready');
});
