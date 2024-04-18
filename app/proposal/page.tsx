import { redirect } from "next/navigation";

const page = () => {
  redirect(
    "https://firebasestorage.googleapis.com/v0/b/ladwitra-2024.appspot.com/o/proposal%2FProposal%20Kejuaraan%20La%20Dwitra%202024.pdf?alt=media&token=525362cb-5551-440c-b30d-28e87963d8fc"
  );
};
export default page;
