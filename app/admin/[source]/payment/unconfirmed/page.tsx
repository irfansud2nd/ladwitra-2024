import UnconfirmedPaymentTable from "@/components/admin/payment/UnconfirmedPaymentTable";

const page = ({ params }: { params: { source: string } }) => {
  const source = params.source as "jaipong" | "silat";
  return <UnconfirmedPaymentTable source={source} />;
};
export default page;
