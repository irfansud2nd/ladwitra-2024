"use client";
import InputFile from "@/components/inputs/InputFile";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CopyButton from "@/components/utils/CopyButton";
import {
  ResetForm,
  SetSubmitting,
  setFieldValue,
} from "@/utils/form/FormConstants";
import { formatToRupiah } from "@/utils/functions";
import {
  PaymentState,
  paymentInitialValue,
  paymentValidationSchema,
} from "@/utils/payment/paymentConstants";
import { sendSilatPayment } from "@/utils/payment/paymentFunctions";
import { RootState } from "@/utils/redux/store";
import { AtletState, biayaAtlet } from "@/utils/silat/atlet/atletConstats";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaRegCopy, FaWhatsapp } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

const AtletPaymentForm = ({
  selectedAtlets,
}: {
  selectedAtlets: AtletState[];
}) => {
  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );
  const allAtlets = useSelector((state: RootState) => state.atlets.all);

  const session = useSession();
  const dispatch = useDispatch();

  const handleSubmit = (
    payment: PaymentState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    sendSilatPayment(
      payment,
      selectedAtlets,
      allAtlets,
      kontingen,
      dispatch,
      resetForm,
      setSubmitting
    );
  };

  const setForm = (setFieldValue: setFieldValue, values: PaymentState) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    !values.totalPembayaran &&
      setFieldValue(
        "totalPembayaran",
        formatToRupiah(selectedAtlets.length * biayaAtlet)
      );
  };

  const getTotalPembayaran = (noHp: string) => {
    if (noHp.length >= 3) {
      return Number(
        (selectedAtlets.length * biayaAtlet) / 1000 + noHp.slice(-3)
      );
    } else {
      return selectedAtlets.length * biayaAtlet;
    }
  };

  return (
    <Formik
      initialValues={paymentInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={paymentValidationSchema}
    >
      {(props: FormikProps<PaymentState>) => {
        setForm(props.setFieldValue, props.values);
        return (
          <Form className="grid grid-rows-[1fr_auto] gap-y-1">
            <div className="flex gap-1 flex-wrap justify-center">
              <div className="flex flex-col justify-around *:p-2">
                {/* BANK ACCOUNT CARD */}
                <Card>
                  <CardTitle>Transfer ke BNI</CardTitle>
                  <CardDescription>an Pesilat Championship</CardDescription>
                  <div className="flex justify-between w-full items-center">
                    <p className="font-bold text-lg">1559946363</p>
                    <CopyButton text="1559946363" />
                  </div>
                </Card>
                {/* WHATSAPP CARD */}
                <Card>
                  <CardTitle>Konfirmasi via Whatsapp</CardTitle>
                  <CardDescription>an Hanna Safitri</CardDescription>
                  <div className="flex justify-between w-full items-center">
                    <p className="font-bold text-lg">+6281394706019</p>
                    <CopyButton text="6281394706019" />
                    <Button type="button" variant={"ghost"} size={"icon"}>
                      <Link
                        href={"https://wa.me/6281394706019"}
                        target="_blank"
                      >
                        <FaWhatsapp className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
                {/* TOTAL PEMBAYARAN */}
                <Card>
                  <CardTitle>Total Pembayaran</CardTitle>
                  <div className="flex justify-between w-full items-center">
                    <p className="font-bold text-lg">
                      {formatToRupiah(getTotalPembayaran(props.values.noHp))}
                    </p>
                    <CopyButton
                      text={`${getTotalPembayaran(props.values.noHp)}`}
                    />
                  </div>
                </Card>
              </div>
              <div className="input_group">
                <InputText name="noHp" label="No HP" formik={props} />
                <InputFile
                  name="buktiFile"
                  label="Bukti Pembayaran"
                  urlName="downloadBuktiUrl"
                  formik={props}
                />
              </div>
            </div>
            <div className="flex gap-1 w-full justify-end">
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => props.resetForm()}
                disabled={props.isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={props.isSubmitting}>
                Simpan
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
export default AtletPaymentForm;
