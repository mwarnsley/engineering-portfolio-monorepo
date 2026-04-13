import { mount } from '@vue/test-utils';
import SearchBar from '../../../src/components/SearchBar.vue';

describe('SearchBar', () => {
  it('renders the search label', () => {
    const wrapper = mount(SearchBar);

    expect(wrapper.text()).toContain('Search movies');
  });

  it('uses the provided model value', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'Batman'
      }
    });

    expect(wrapper.find('input').element.value).toBe('Batman');
  });

  it('updates the input when the prop changes', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'Batman'
      }
    });

    await wrapper.setProps({ modelValue: 'Superman' });

    expect(wrapper.find('input').element.value).toBe('Superman');
  });

  it('emits the search term on submit', async () => {
    const wrapper = mount(SearchBar);

    await wrapper.find('input').setValue('Interstellar');
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted('search')[0]).toEqual(['Interstellar']);
  });
});
