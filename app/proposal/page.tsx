import { redirect } from "next/navigation";

const page = () => {
  redirect(
    "https://firebasestorage.googleapis.com/v0/b/ladwitra-2024.appspot.com/o/proposal%2FProposal%20Kejuaraan%20La%20Dwitra%202024.pdf?alt=media&token=9b3d59de-b529-4237-beed-8dff15ce241f"
  );
};
export default page;
