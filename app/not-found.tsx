import image from "@/public/images/not-found.png";

const NotLoggedIn = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="w-[450px] max-w-[90vw] grid grid-cols-2 items-center gap-5 ">
        <h1 className="font-bold text-xl sm:text-3xl">
          Maaf, halaman yang anda cari tidak tersedia
        </h1>
        <img src={image.src} alt="not found" className="w-full h-fit" />
      </div>
    </div>
  );
};
export default NotLoggedIn;
