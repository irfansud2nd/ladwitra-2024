import image from "@/public/images/not-logged-in.png";
import PageInfo from "./PageInfo";

const NotLoggedIn = () => {
  return (
    <PageInfo
      text="Maaf, login terlebih dahulu untuk melanjutkan"
      image={image}
    />
  );
};
export default NotLoggedIn;
