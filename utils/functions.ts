import { revalidateTag } from "next/cache";
import { toast } from "sonner";

// CAPITALIZE
export const capitalize = (text: string, collection: boolean = false) => {
  if (collection)
    return `${text.charAt(0).toUpperCase() + text.slice(1, text.length - 1)}`;
  return `${text.charAt(0).toUpperCase() + text.slice(1)}`;
};

// TOAST FIREBASE ERROR
export const toastFirebaseError = (error: any, id?: string | number) => {
  toast.error(`${error.response.data.message} | ${error.response.data.code}`, {
    id,
  });
};

//COMPARE FOR DATA SORTER
export const compare = (query: string, type: "asc" | "desc") => {
  return (a: any, b: any) => {
    if (a[query] < b[query]) {
      return type == "asc" ? -1 : 1;
    }
    if (a[query] > b[query]) {
      return type == "asc" ? 1 : -1;
    }
    return 0;
  };
};

// FORMAT TANGGAL =
export const formatDate = (
  inputDate: number | string,
  withoutHour: boolean = false
) => {
  const formattedDate = new Date(inputDate);
  const date = formattedDate.getDate();
  const year = formattedDate.getFullYear();
  const month = formattedDate.toLocaleString("id", { month: "short" });
  const hour = formattedDate.getHours().toString().padStart(2, "0");
  const minute = formattedDate.getMinutes().toString().padStart(2, "0");

  let result = `${date} ${month}, `;

  withoutHour ? (result += `${year}`) : (result += `${hour}:${minute}`);

  return result;
};

export const formatToRupiah = (input: string | number, rerverse?: boolean) => {
  if (rerverse) {
    return input.toString().replace(/[^0-9]/g, "");
  }
  return `${Number(input) < 0 ? "- " : ""} Rp ${Math.abs(
    Number(input)
  ).toLocaleString("id")}`;
};

export default async function refreshCount() {
  revalidateTag("test");
}
