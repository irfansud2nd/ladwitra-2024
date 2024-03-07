import SilatPaymentSummary from "@/components/admin/payment/silat/SilatPaymentSummary";

const page = ({ params }: { params: { source: string } }) => {
  if (params.source) return <SilatPaymentSummary />;
};
export default page;
