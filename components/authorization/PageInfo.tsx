import { StaticImageData } from "next/image";

const PageInfo = ({
  text,
  image,
}: {
  text: string;
  image: StaticImageData;
}) => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="w-[450px] max-w-[90vw] grid grid-cols-2 items-center gap-5 ">
        <h1 className="font-bold text-xl sm:text-3xl">{text}</h1>
        <img
          src={image.src}
          alt="not logged in"
          className="max-w-[50vw] w-[150px] sm:w-[250px]"
        />
      </div>
    </div>
  );
};
export default PageInfo;
