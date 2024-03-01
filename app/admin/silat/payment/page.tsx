import CountFirestore from "@/components/utils/CountFirestore";

const page = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <CountFirestore
        title="Total"
        apiUrl="/api/payments/all/silat/count"
        money
      />
      <CountFirestore
        title="Confirmed"
        apiUrl="/api/payments/confirmed/silat/count"
        money
      />
      <CountFirestore
        title="Unconfirmed"
        apiUrl="/api/payments/unconfirmed/silat/count"
        link="payment/unconfirmed"
        money
      />
    </div>
  );
};
export default page;
