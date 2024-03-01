import CountFirestore from "@/components/utils/CountFirestore";

const page = () => {
  return (
    <div className="flex gap-2 flex-wrap">
      <CountFirestore title="Kontingen" apiUrl="/api/kontingens/count" />
      <CountFirestore title="Official" apiUrl="/api/officials/count" />
      <CountFirestore title="Atlet" apiUrl="/api/atlets/count" />
      <CountFirestore
        title="Registered Atlet"
        apiUrl="/api/atlets/count/registered"
      />
      <CountFirestore
        title="Total Payment"
        apiUrl="/api/payments/all/count"
        money
      />
      <CountFirestore
        title="Confirmed Payment"
        apiUrl="/api/payments/confirmed/count"
        money
      />
      <CountFirestore
        title="Unconfirmed Payment"
        apiUrl="/api/payments/unconfirmed/count"
        money
      />
    </div>
  );
};
export default page;
