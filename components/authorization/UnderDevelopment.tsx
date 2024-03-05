import image from "@/public/images/under-development.png";

const UnderDevelopment = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="w-[450px] max-w-[90vw] grid grid-cols-2 items-center gap-5 ">
        <h1 className="font-bold text-xl sm:text-3xl">
          Maaf, halaman ini masih dalam tahap pengembangan
        </h1>
        <img src={image.src} alt="not logged in" className="w-full h-fit" />
      </div>
    </div>
  );
};
export default UnderDevelopment;
