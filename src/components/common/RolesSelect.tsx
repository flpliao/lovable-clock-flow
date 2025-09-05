import SearchableSelect from '@/components/ui/SearchableSelect';
import { useRoles } from '@/hooks/useRoles';
import { cn } from '@/lib/utils';
import { useRoleStore } from '@/stores/roleStore';
import { useEffect } from 'react';

interface RolesSelectProps {
  selectedRole: string;
  onRoleChange: (value: string) => void;
  className?: string;
}

const RolesSelect = ({ selectedRole, onRoleChange, className }: RolesSelectProps) => {
  const roles = useRoleStore(state => state.roles);
  const { loadRoles } = useRoles();

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <SearchableSelect
      className={cn('w-full', className)}
      options={roles.map(role => ({
        value: role.name,
        label: role.name,
      }))}
      value={selectedRole}
      onChange={onRoleChange}
      placeholder="請選擇職位"
      searchPlaceholder="搜尋職位..."
    />
  );
};

export default RolesSelect;
