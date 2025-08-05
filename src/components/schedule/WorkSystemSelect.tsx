import SearchableSelect from '@/components/ui/SearchableSelect';

interface WorkSystemSelectProps {
  selectedWorkSystem: string;
  onWorkSystemChange: (value: string) => void;
}

const WorkSystemSelect = ({ selectedWorkSystem, onWorkSystemChange }: WorkSystemSelectProps) => {
  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">工時制</label>
      <SearchableSelect
        className="w-full bg-white/10 border-white/20 text-white rounded-md"
        options={[
          { value: 'standard', label: '標準工時制' },
          { value: 'flexible', label: '彈性工時制' },
        ]}
        value={selectedWorkSystem}
        onChange={onWorkSystemChange}
        placeholder="請選擇工時制"
      />
    </div>
  );
};

export default WorkSystemSelect;
