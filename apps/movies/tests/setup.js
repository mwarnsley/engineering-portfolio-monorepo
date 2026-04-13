import { config } from '@vue/test-utils';
import { defineComponent } from 'vue';

window.scrollTo = vi.fn();

config.global.stubs.RouterLink = defineComponent({
  props: {
    to: {
      type: [String, Object],
      required: true
    }
  },
  template:
    '<a :href="typeof to === \'string\' ? to : (to.path || \'\')"><slot /></a>'
});

config.global.stubs.RouterView = defineComponent({
  template: '<div class="router-view-stub"></div>'
});
