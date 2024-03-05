"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};
const SelectComponent = ({ value, placeholder, options, onChange }: Props) => {
  return (
    <Select value={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem value={item} key={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectComponent;
