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
  className?: string;
  disable?: boolean;
};
const SelectComponent = ({
  value,
  placeholder,
  options,
  onChange,
  disable,
  className,
}: Props) => {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value)}
      disabled={disable}
    >
      <SelectTrigger className={`w-fit ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem value={item} key={item} className={className}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectComponent;
