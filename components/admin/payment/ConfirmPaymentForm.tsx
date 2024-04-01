import InputFile from "@/components/inputs/InputFile";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { SetFieldValue } from "@/utils/form/FormConstants";
import {
  ConfirmPaymentState,
  PaymentState,
  confirmPaymentInitialValue,
  confirmPaymentValidationSchema,
} from "@/utils/payment/paymentConstants";
import { Form, Formik, FormikProps } from "formik";
import ShowFile from "../ShowFile";
import { useSession } from "next-auth/react";
import { confirmPayment } from "@/utils/payment/paymentFunctions";
import { useDispatch } from "react-redux";
import Link from "next/link";
import useConfirmationDialog from "@/hooks/UseAlertDialog";

type Props = {
  payment: PaymentState;
};

const ConfirmPaymentForm = ({ payment }: Props) => {
  const session = useSession();
  const dispatch = useDispatch();

  const setForm = (
    setFieldValue: SetFieldValue,
    values: ConfirmPaymentState
  ) => {
    if (payment.confirmed) {
      !values.confirmedBy && setFieldValue("confirmedBy", payment.confirmedBy);
      return;
    }
    !values.totalPembayaran &&
      payment.totalPembayaran &&
      setFieldValue("totalPembayaran", payment.totalPembayaran);
    !values.confirmedBy &&
      setFieldValue("confirmedBy", session.data?.user?.email);
  };

  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  const handleSubmit = async (values: ConfirmPaymentState) => {
    const { confirmed } = payment;
    const title = confirmed ? "Batalkan Konfrimasi" : "Konfirmasi Pembayaran";
    const result = await confirm(title, "Apakah anda yakin?");

    result && confirmPayment(payment, values.confirmedBy, dispatch, confirmed);
  };

  return (
    <>
      <ConfirmationDialog />
      <Formik
        onSubmit={(values) => handleSubmit(values)}
        initialValues={confirmPaymentInitialValue}
        // validationSchema={confirmPaymentValidationSchema}
      >
        {(props: FormikProps<ConfirmPaymentState>) => {
          setForm(props.setFieldValue, props.values);
          return (
            <Form className="grid grid-rows-[1fr_auto] gap-2">
              <div className="flex gap-1 flex-col sm:flex-row">
                <ShowFile
                  label="Bukti Pembayararan"
                  src={payment.downloadBuktiUrl}
                />
                <div className="input_group justify-normal">
                  <InputText
                    label="Total Pembayaran"
                    name="totalPembayaran"
                    formik={props}
                    forceDisabled
                  />
                  {/* <div className="relative">
                  <InputText
                    label="Total Pembayaran Dikonfirmasi"
                    name="confirmedTotalPembayaran"
                    formik={props}
                    />
                    <Button
                    type="button"
                    size={"sm"}
                    className="absolute right-0.5 top-5 scale-105"
                    onClick={() =>
                      props.setFieldValue(
                        "confirmedTotalPembayaran",
                        payment.totalPembayaran
                        )
                      }
                      >
                      All
                      </Button>
                    </div> */}
                  <InputText
                    label="Confirmed By"
                    name="confirmedBy"
                    formik={props}
                    forceDisabled
                  />
                </div>
              </div>
              <div className="flex gap-2 max-sm:flex-col justify-center">
                <Button
                  type="submit"
                  variant={payment.confirmed ? "destructive" : "default"}
                >
                  {payment.confirmed ? "Batalkan Konfimasi" : "Konfirmasi"}
                </Button>

                <Button asChild variant={"destructive"}>
                  <Link href={`/admin/payment/${payment.source}/${payment.id}`}>
                    Batalkan Pembayaran
                  </Link>
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
export default ConfirmPaymentForm;
