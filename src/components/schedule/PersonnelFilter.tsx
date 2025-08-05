import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PersonnelFilterProps {
  personnelFilter: 'all' | 'workSystem';
  onPersonnelFilterChange: (value: 'all' | 'workSystem') => void;
}

const PersonnelFilter = ({ personnelFilter, onPersonnelFilterChange }: PersonnelFilterProps) => {
  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">人員篩選</label>
      <RadioGroup
        value={personnelFilter}
        onValueChange={value => onPersonnelFilterChange(value as 'all' | 'workSystem')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all" className="text-white text-sm">
            全部門人員
          </Label>
        </div>
        {/* <div className="flex items-center space-x-2">
           <RadioGroupItem value="workSystem" id="workSystem" />
           <Label htmlFor="workSystem" className="text-white text-sm">
             套用該工時制人員
           </Label>
         </div> */}
      </RadioGroup>
    </div>
  );
};

export default PersonnelFilter;
