import { BiLoader } from "react-icons/bi";

type Props = {
  text?: string;
  overlay?: boolean;
};

const FullLoading = ({ text, overlay }: Props) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-3 items-center">
        <BiLoader className="animate-spin size-10 sm:size-20" />
        <h1 className="text-xl sm:text-3xl font-bold">
          {text ?? "Memuat data"}
        </h1>
      </div>
    </div>
  );
};
export default FullLoading;
