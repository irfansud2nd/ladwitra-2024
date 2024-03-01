"use client";
import { FiUser } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

const ProfileButton = () => {
  const session = useSession();

  if (!session?.data?.user?.email)
    return (
      <Button variant={"outline"} onClick={() => signIn("google")}>
        Login
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-6 sm:size-8">
          <AvatarImage src={session.data.user.image || ""} />
          <AvatarFallback>
            <FiUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>irfansud2nd@gmail.com</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Button
          asChild
          onClick={() => signOut()}
          variant={"ghost"}
          className="w-full"
        >
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileButton;
