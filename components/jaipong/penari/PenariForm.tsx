"use client";
import InputDate from "@/components/inputs/InputDate";
import InputFile from "@/components/inputs/InputFile";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import { Button } from "@/components/ui/button";
import {
  ResetForm,
  SetSubmitting,
  jenisKelaminPeserta,
  SetFieldValue,
} from "@/utils/form/FormConstants";
import { setFieldValues } from "@/utils/form/FormFunctions";
import {
  PenariState,
  penariInitialValue,
  penariValidationSchema,
  penariValidationSchemaWithoutFile,
} from "@/utils/jaipong/penari/penariConstants";
import {
  sendPenari,
  updatePenari,
} from "@/utils/jaipong/penari/penariFunctions";
import {
  addPenariRedux,
  setPenariToEditRedux,
  updatePenariRedux,
} from "@/utils/redux/jaipong/penarisSlice";
import { updateSanggarRedux } from "@/utils/redux/jaipong/sanggarSlice";
import { RootState } from "@/utils/redux/store";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PenariForm = ({ setOpen }: Props) => {
  const sanggar = useSelector((state: RootState) => state.sanggar.registered);
  const penariToEdit = useSelector((state: RootState) => state.penaris.toEdit);
  const dispatch = useDispatch();
  const session = useSession();

  const handleSubmit = (
    penari: PenariState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (penariToEdit.id) {
      updatePenari(penari)
        .then((penari) => {
          dispatch(setPenariToEditRedux(penariInitialValue));
          dispatch(updatePenariRedux(penari));
          resetForm();
          setOpen(false);
        })
        .finally(() => setSubmitting(false));
    } else {
      sendPenari(penari, sanggar)
        .then(({ penari, sanggar }) => {
          dispatch(addPenariRedux(penari));
          dispatch(updateSanggarRedux(sanggar));
          resetForm();
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    resetForm();
    dispatch(setPenariToEditRedux(penariInitialValue));
    setOpen(false);
  };

  const setForm = (
    setFieldValue: SetFieldValue,
    values: PenariState,
    penariToEdit?: PenariState
  ) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    if (sanggar) {
      !values.idSanggar && setFieldValue("idSanggar", sanggar.id);
      !values.namaSanggar && setFieldValue("namaSanggar", sanggar.nama);
    }
    if (penariToEdit?.id && !values.id) {
      setFieldValues(setFieldValue, penariToEdit);
    }
  };

  return (
    <Formik
      initialValues={penariInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={
        penariToEdit.id
          ? penariValidationSchemaWithoutFile
          : penariValidationSchema
      }
    >
      {(props: FormikProps<PenariState>) => {
        setForm(props.setFieldValue, props.values, penariToEdit);
        return (
          <Form className="grid grid-rows-[1fr_auto] gap-y-1">
            <div className="flex gap-1 flex-col sm:flex-row justify-center min-[830px]:flex-nowrap *:input_group">
              <div>
                <InputFile
                  label="Pas Foto"
                  name="fotoFile"
                  urlName="downloadFotoUrl"
                  formik={props}
                />
              </div>
              <div>
                <InputText
                  label="Nama Lengkap"
                  name="nama"
                  upperCase
                  formik={props}
                />
                {/* <InputText label="NIK" name="NIK" formik={props} /> */}
                <InputSelect
                  label="Jenis Kelamin"
                  name="jenisKelamin"
                  options={jenisKelaminPeserta}
                  formik={props}
                  showOnEditOnly
                />
                <InputTextArea
                  label="Alamat Lengkap"
                  name="alamatLengkap"
                  formik={props}
                />
                <InputText
                  label="Tempat Lahir"
                  name="tempatLahir"
                  formik={props}
                />
              </div>
              <div>
                <InputDate formik={props} />
                <InputText label="Email" name="email" formik={props} />
                <InputText label="No HP" name="noHp" formik={props} />
                <InputText
                  label="Nama Sanggar"
                  name="namaSanggar"
                  formik={props}
                  forceDisabled
                />
                {/* <InputFile
                  label="KTP"
                  name="ktpFile"
                  urlName="downloadKtpUrl"
                  formik={props}
                  under17
                  landscape
                />
                <InputFile
                  label="Kartu Keluarga"
                  name="kkFile"
                  urlName="downloadKkUrl"
                  formik={props}
                  landscape
                /> */}
              </div>
            </div>
            <div className="flex w-full gap-1 justify-end">
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => handleCancel(props.resetForm)}
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
export default PenariForm;
