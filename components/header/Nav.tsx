import Link from "next/link";
import { Button } from "../ui/button";

const Nav = () => {
  const navs = [
    {
      label: "Pencak Silat",
      href: "/silat/atlet",
    },
    {
      label: "Tari Jaipong",
      href: "/jaipong/penari",
    },
  ];
  return (
    <nav className="hidden gap-1 sm:flex">
      {navs.map((nav) => (
        <Button variant={"link"} key={nav.href} asChild>
          <Link href={nav.href}>{nav.label}</Link>
        </Button>
      ))}
    </nav>
  );
};
export default Nav;
