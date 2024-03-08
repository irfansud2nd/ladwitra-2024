"use client";
import { useEffect, useState } from "react";
import { Card, CardTitle } from "../ui/card";
import axios from "axios";
import { formatToRupiah, toastFirebaseError } from "@/utils/functions";
import InlineLoading from "../loadings/InlineLoading";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
  title: string;
  apiUrl?: string;
  link?: string;
  money?: boolean;
  onComplete?: (result: number) => void;
  count?: number;
  disableRefresh?: boolean;
};

const CountFirestore = ({
  title,
  apiUrl,
  link,
  money,
  onComplete,
  count,
  disableRefresh,
}: Props) => {
  const [result, setResult] = useState(0);
  const [loading, setLoading] = useState(true);
  const getResult = () => {
    if (!apiUrl) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(apiUrl)
      .then((res) => {
        setResult(res.data.result);
        onComplete && onComplete(res.data.result);
      })
      .catch((error) => {
        toastFirebaseError(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!count) getResult();
  }, []);

  useEffect(() => {
    if (count) {
      result != count && setResult(count);
      setLoading(false);
    }
  }, [count]);

  return (
    <Card className="p-2 w-[200px] flex flex-col gap-1 items-center whitespace-nowrap">
      <CardTitle>{title}</CardTitle>
      <div className="flex gap-1 flex-col items-center">
        <span className="text-xl font-bold">
          {loading ? (
            <InlineLoading />
          ) : money ? (
            formatToRupiah(result)
          ) : (
            result
          )}
        </span>
        <div className="flex justify-around gap-1">
          <Button onClick={getResult} size={"sm"} disabled={disableRefresh}>
            Refresh
          </Button>
          {link && (
            <Button size={"sm"}>
              <Link href={link}>Open</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
export default CountFirestore;
