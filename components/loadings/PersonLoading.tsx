import { Skeleton } from "../ui/skeleton";

const PersonLoading = () => {
  return (
    <div className="max-w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex justify-between items-center mb-1">
        <Skeleton className="sm:ml-10 w-[150px] h-9" />
        <Skeleton className="w-[150px] h-9" />
      </div>
      <Skeleton className="w-full h-full" />
    </div>
  );
};
export default PersonLoading;
