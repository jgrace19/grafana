import { render, screen, within } from 'test/test-utils';

import { OrgRole } from '@grafana/data';
import { type Role } from 'app/types/accessControl';

import { RolePicker } from './RolePicker';

const role = (name: string, displayName: string, group: string, extra: Partial<Role> = {}): Role => ({
  uid: name,
  name,
  displayName,
  group,
  description: '',
  filteredDisplayName: `${group}:${displayName}`,
  created: '',
  updated: '',
  version: 1,
  delegatable: true,
  ...extra,
});

const dashboardsReader = role('fixed:dashboards:reader', 'Reader', 'Dashboards');
const dashboardsWriter = role('fixed:dashboards:writer', 'Writer', 'Dashboards');
const usersReader = role('fixed:users:reader', 'Reader', 'Users');
const roleOptions = [dashboardsReader, dashboardsWriter, usersReader];

const setup = (props: Partial<React.ComponentProps<typeof RolePicker>> = {}) =>
  render(
    <RolePicker
      pickerId={`test-${Math.random()}`}
      appliedRoles={[dashboardsReader]}
      roleOptions={roleOptions}
      basicRole={OrgRole.Viewer}
      showBasicRole
      onRolesChange={jest.fn()}
      {...props}
    />
  );

describe('RolePicker', () => {
  it('shows the basic role and the number of applied roles', () => {
    setup();

    expect(screen.getByText('Viewer')).toBeInTheDocument();
    expect(screen.getByText('+1 role')).toBeInTheDocument();
  });

  it('opens the menu with the basic roles and role groups', async () => {
    const { user } = setup();

    await user.click(screen.getByText('+1 role'));

    const menu = screen.getByLabelText('Role picker menu');
    expect(within(menu).getByRole('radio', { name: 'Viewer' })).toBeChecked();
    expect(within(menu).getByText('Fixed roles')).toBeInTheDocument();
    expect(within(menu).getByText('Dashboards')).toBeInTheDocument();
    expect(within(menu).getByText('Users')).toBeInTheDocument();
    expect(screen.getByTestId('role-picker-input')).toHaveFocus();
  });

  it('marks a partially selected group and lists its roles in a submenu', async () => {
    const { user } = setup();

    await user.click(screen.getByText('+1 role'));
    const [dashboards, users] = screen.getAllByLabelText('Role picker option');
    // The partial state is drawn by RoleMenuGroupOption.css through this class.
    expect(within(dashboards).getByRole('checkbox').closest('label')).toHaveClass('gf-role-picker-checkbox-partial');
    expect(within(users).getByRole('checkbox').closest('label')).not.toHaveClass('gf-role-picker-checkbox-partial');

    await user.hover(dashboards);

    const subMenu = screen.getByLabelText('Role picker submenu');
    expect(within(subMenu).getByText('Reader')).toBeInTheDocument();
    expect(within(subMenu).getByText('Writer')).toBeInTheDocument();
  });

  it('filters the roles when searching', async () => {
    const { user } = setup();

    await user.click(screen.getByText('+1 role'));
    await user.type(screen.getByTestId('role-picker-input'), 'users');

    const menu = screen.getByLabelText('Role picker menu');
    expect(within(menu).getByText('Users:Reader')).toBeInTheDocument();
    expect(within(menu).queryByText('Dashboards')).not.toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    const { user } = setup({ disabled: true });

    await user.click(screen.getByText('+1 role'));

    expect(screen.queryByLabelText('Role picker menu')).not.toBeInTheDocument();
  });
});
