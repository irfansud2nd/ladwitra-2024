"use client";
import InputFile from "@/components/inputs/InputFile";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/utils/CopyButton";
import {
  ResetForm,
  SetSubmitting,
  SetFieldValue,
} from "@/utils/form/FormConstants";
import { formatToRupiah } from "@/utils/functions";
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import { getBiayaPenaris } from "@/utils/jaipong/penari/penariFunctions";
import {
  PaymentState,
  paymentInitialValue,
  paymentValidationSchema,
} from "@/utils/payment/paymentConstants";
import { sendJaipongPayment } from "@/utils/payment/paymentFunctions";
import { updatePenariRedux } from "@/utils/redux/jaipong/penarisSlice";
import { updateSanggarRedux } from "@/utils/redux/jaipong/sanggarSlice";
import { addPaymentRedux } from "@/utils/redux/silat/paymentsSlice";
import { RootState } from "@/utils/redux/store";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  selectedPenaris: PenariState[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PenariPaymentForm = ({ selectedPenaris, setOpen }: Props) => {
  const sanggar = useSelector((state: RootState) => state.sanggar.registered);
  const allPenaris = useSelector((state: RootState) => state.penaris.all);

  const session = useSession();
  const dispatch = useDispatch();

  const handleSubmit = (
    payment: PaymentState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    sendJaipongPayment(payment, selectedPenaris, allPenaris, sanggar)
      .then(({ penaris, sanggar, payment }) => {
        dispatch(updateSanggarRedux(sanggar));
        dispatch(addPaymentRedux(payment));
        penaris.map((penari) => dispatch(updatePenariRedux(penari)));
        resetForm();
        setOpen(false);
      })
      .finally(() => setSubmitting(false));
  };

  const setForm = (setFieldValue: SetFieldValue, values: PaymentState) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    !values.pembayaran.total &&
      setFieldValue(
        "pembayaran.total",
        formatToRupiah(getBiayaPenaris(selectedPenaris))
      );
  };

  const getTotalPembayaran = (noHp: string) => {
    if (noHp.length >= 3) {
      return Number(getBiayaPenaris(selectedPenaris) / 1000 + noHp.slice(-3));
    } else {
      return getBiayaPenaris(selectedPenaris);
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
                  <CardDescription>an Sophie</CardDescription>
                  <div className="flex justify-between w-full items-center">
                    <p className="font-bold text-lg">+6281220209499</p>
                    <CopyButton text="6281220209499" />
                    <Button type="button" variant={"ghost"} size={"icon"}>
                      <Link
                        href={"https://wa.me/6281220209499"}
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
export default PenariPaymentForm;
