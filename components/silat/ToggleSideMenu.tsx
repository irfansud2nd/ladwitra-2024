"use client";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { RootState } from "@/utils/redux/store";
import { setSideMenu } from "@/utils/redux/pendaftaran/sideMenuSlice";
import { MdMenuOpen } from "react-icons/md";

const ToggleSideMenu = () => {
  const show = useSelector((state: RootState) => state.sideMenu.normal);
  const dispatch = useDispatch();
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="absolute"
      onClick={() => dispatch(setSideMenu(!show))}
    >
      <MdMenuOpen
        className={`size-6 transition-transform ${!show && "rotate-180"}`}
      />
    </Button>
  );
};
export default ToggleSideMenu;
