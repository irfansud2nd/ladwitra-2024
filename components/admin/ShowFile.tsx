"use client";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Props = {
  label: string;
  src: string;
  landscape?: boolean;
  newTab?: boolean;
};

const ShowFile = ({ label, src, landscape, newTab }: Props) => {
  const [skeleton, setSkeleton] = useState(true);
  return (
    <div className="flex flex-col gap-1 items-center w-fit">
      <Label>{label}</Label>
      <div
        className={`border rounded-md flex justify-center items-center relative
        ${landscape ? "w-[250px] h-[150px]" : "w-[150px] h-[200px]"}`}
      >
        <img
          src={src}
          className={`transition-all
        ${skeleton ? "opacity-0" : "opacity-100"}
        ${landscape ? "w-fit h-full" : "w-full h-fit"}`}
          onLoad={() => setSkeleton(false)}
        />
        {skeleton && <Skeleton className="w-full h-full absolute" />}
      </div>
      {newTab && (
        <Button size={"sm"}>
          <Link href={src}>Open in New Tab</Link>
        </Button>
      )}
    </div>
  );
};
export default ShowFile;
