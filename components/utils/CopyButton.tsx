import { FaRegCopy } from "react-icons/fa6";
import { Button } from "../ui/button";

const CopyButton = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      onClick={() => navigator.clipboard.writeText(text)}
    >
      <FaRegCopy className={`size-4 ${className}`} />
    </Button>
  );
};
export default CopyButton;
