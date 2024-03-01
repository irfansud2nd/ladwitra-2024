import ProfileButton from "./ProfileButton";
import ThemeSwitcher from "./ThemeSwitcher";
import Container from "../ui/container";
import Link from "next/link";
import Nav from "./Nav";

import MobileSideMenu from "../utils/MobileSideMenu";

const Header = () => {
  return (
    <header className="py-3 px-4 border-b">
      <Container className="flex justify-between items-center">
        <MobileSideMenu />
        <Link href={"/"} className="flex gap-2 items-center">
          <img
            src="/images/logo-ladwitra.png"
            alt=""
            className="size-6 sm:size-8 dark:bg-primary-foreground rounded-full"
          />
          <h1 className="font-extrabold text-2xl sm:text-3xl bg-gradient-to-tr from-primary to-yellow-500 bg-clip-text text-transparent whitespace-nowrap">
            La Dwitra
            <span className="max-[350px]:hidden"> 2024</span>
          </h1>
        </Link>
        <div className="flex gap-1 items-center">
          <Nav />
          <ThemeSwitcher className="hidden sm:flex" />
          <ProfileButton />
        </div>
      </Container>
    </header>
  );
};
export default Header;
