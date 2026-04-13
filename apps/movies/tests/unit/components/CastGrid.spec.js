import { mount } from '@vue/test-utils';
import CastGrid from '../../../src/components/CastGrid.vue';

const cast = [
  { id: 1, credit_id: 'one', name: 'Actor One', character: 'Hero', profile_path: '/one.jpg' },
  { id: 2, credit_id: 'two', name: 'Actor Two', character: '', profile_path: null }
];

describe('CastGrid', () => {
  it('renders the cast heading', () => {
    const wrapper = mount(CastGrid, { props: { cast } });

    expect(wrapper.text()).toContain('Top billed actors');
  });

  it('renders one card per cast member', () => {
    const wrapper = mount(CastGrid, { props: { cast } });

    expect(wrapper.findAll('.cast-card')).toHaveLength(2);
  });

  it('shows actor names', () => {
    const wrapper = mount(CastGrid, { props: { cast } });

    expect(wrapper.text()).toContain('Actor One');
  });

  it('falls back when a role is unavailable', () => {
    const wrapper = mount(CastGrid, { props: { cast } });

    expect(wrapper.text()).toContain('Role unavailable');
  });
});
