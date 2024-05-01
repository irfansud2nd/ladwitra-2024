"use client";

import { useState } from "react";
import SelectComponent from "../inputs/SelectComponent";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  setTargetCollection: React.Dispatch<React.SetStateAction<string>>;
  targetCollection: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  disable?: boolean;
};

const SearchBar = ({
  setQuery,
  disable,
  setTargetCollection,
  targetCollection,
}: Props) => {
  const [property, setProperty] = useState("nama");
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex max-sm:flex-col gap-1 items-center max-w-[96vw]">
      <div className="flex max-sm:w-full gap-1">
        <SelectComponent
          options={[
            "kontingen",
            "official",
            "atlet",
            "sanggar",
            "koreografer",
            "penari",
          ]}
          value={targetCollection}
          onChange={(value) => setTargetCollection(value)}
          placeholder=""
          disable={disable}
          className="w-full sm:w-[150px] capitalize"
        />
        <SelectComponent
          options={["nama", "creatorEmail"]}
          value={property}
          onChange={(value) => setProperty(value)}
          placeholder=""
          disable={disable}
          className="w-full sm:w-[150px] capitalize"
        />
      </div>
      <div className="flex max-sm:w-full gap-1">
        <Input
          type="text"
          className="w-full sm:w-fit"
          value={keyword}
          onChange={(e) =>
            setKeyword(
              property == "creatorEmail"
                ? e.target.value
                : e.target.value.toUpperCase()
            )
          }
          disabled={disable}
        />
        <Button
          size={"sm"}
          onClick={() => setQuery(`${property}/${keyword}`)}
          disabled={disable || !keyword}
        >
          Cari
        </Button>
      </div>
    </div>
  );
};
export default SearchBar;
