import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { RxCaretSort } from "react-icons/rx";

const TableSortButton = ({
  column,
  text,
}: {
  column: Column<any>;
  text: string;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="px-0"
    >
      {text}
      <RxCaretSort className="ml-2 size-5" />
    </Button>
  );
};
export default TableSortButton;
