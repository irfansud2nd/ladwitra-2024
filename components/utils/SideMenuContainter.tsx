import React from "react";

const SideMenuContainter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sm:border-2 rounded-md ml-2 h-full flex-col justify-around p-2 flex">
      <div className="flex flex-col justify-around h-full">{children}</div>
    </div>
  );
};

export default SideMenuContainter;
