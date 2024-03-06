"use client";

import { useState } from "react";
import SelectComponent from "../inputs/SelectComponent";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  disable?: boolean;
};

const SearchBar = ({ setQuery, disable }: Props) => {
  const [property, setProperty] = useState("nama");
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex gap-1 items-center max-w-[96vw]">
      <SelectComponent
        options={["nama", "creatorEmail"]}
        value={property}
        onChange={(value) => setProperty(value)}
        placeholder=""
        disable={disable}
        className="w-[150px] capitalize"
      />
      <Input
        type="text"
        className="w-fit"
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
        disabled={disable}
      >
        Cari
      </Button>
    </div>
  );
};
export default SearchBar;
