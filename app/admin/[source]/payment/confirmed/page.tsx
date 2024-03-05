import ConfirmedPaymentTable from "@/components/admin/payment/ConfirmedPaymentTable";

const page = ({ params }: { params: { source: "jaipong" | "silat" } }) => {
  const { source } = params;
  return <ConfirmedPaymentTable source={source} />;
};
export default page;
