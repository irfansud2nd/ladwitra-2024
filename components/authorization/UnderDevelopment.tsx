import image from "@/public/images/under-development.png";
import PageInfo from "./PageInfo";

const UnderDevelopment = () => {
  return (
    <PageInfo
      text="Maaf, halaman ini masih dalam tahap pengembangan"
      image={image}
    />
  );
};
export default UnderDevelopment;
