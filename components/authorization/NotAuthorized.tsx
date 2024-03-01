import image from "@/public/images/not-authorized.png";

const NotAuthorized = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="w-[450px] max-w-[90vw] grid grid-cols-2 items-center gap-5 ">
        <h1 className="font-bold text-xl sm:text-3xl">
          Maaf, anda tidak memiliki izin untuk mengakses halaman ini
        </h1>
        <img src={image.src} alt="not logged in" className="w-full h-fit" />
      </div>
    </div>
  );
};
export default NotAuthorized;
