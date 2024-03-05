"use client";

import { useState } from "react";
import SelectComponent from "../inputs/SelectComponent";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  targetCollection: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  query: string;
};

const SearchBar = ({ targetCollection, setQuery, query }: Props) => {
  const [property, setProperty] = useState("nama");
  const [keyword, setKeyword] = useState("");

  const handleClick = () => {
    const currentQuery = `${property}/${keyword}`;
    if (currentQuery != query) setQuery(currentQuery);
  };

  return (
    <div className="flex gap-1 items-center">
      <SelectComponent
        options={[targetCollection]}
        value={targetCollection}
        onChange={() => {}}
        placeholder=""
      />
      <SelectComponent
        options={["nama", "creatorEmail"]}
        value={property}
        onChange={(value) => setProperty(value)}
        placeholder=""
      />
      <Input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button size={"sm"} onClick={handleClick}>
        Cari
      </Button>
    </div>
  );
};
export default SearchBar;
