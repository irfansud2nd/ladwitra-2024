import image from "@/public/images/not-authorized.png";
import PageInfo from "./PageInfo";

const NotAuthorized = () => {
  return (
    <PageInfo
      text="Maaf, anda tidak memiliki izin untuk mengakses halaman ini"
      image={image}
    />
  );
};
export default NotAuthorized;
