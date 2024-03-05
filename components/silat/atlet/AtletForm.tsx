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
  setFieldValue,
} from "@/utils/form/FormConstants";
import { setFieldValues } from "@/utils/form/FormFunctions";
import { setAtletToEditRedux } from "@/utils/redux/silat/atletsSlice";
import { RootState } from "@/utils/redux/store";
import {
  AtletState,
  atletInitialValue,
  atletValidationSchema,
  atletValidationSchemaWithoutFile,
} from "@/utils/silat/atlet/atletConstats";
import { sendAtlet, updateAtlet } from "@/utils/silat/atlet/atletFunctions";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AtletForm = ({ setOpen }: Props) => {
  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );
  const atletToEdit = useSelector((state: RootState) => state.atlets.toEdit);
  const dispatch = useDispatch();
  const session = useSession();

  const handleSubmit = (
    atlet: AtletState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (atletToEdit.id) {
      updateAtlet(atlet, dispatch, {
        setSubmitting,
        onComplete: () => {
          resetForm();
          dispatch(setAtletToEditRedux(atletInitialValue));
        },
        withoutStatus: true,
      });
    } else {
      sendAtlet(atlet, kontingen, dispatch, setSubmitting, resetForm);
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    resetForm();
    dispatch(setAtletToEditRedux(atletInitialValue));
    setOpen(false);
  };

  const setForm = (
    setFieldValue: setFieldValue,
    values: AtletState,
    atletToEdit?: AtletState
  ) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    if (kontingen) {
      !values.idKontingen && setFieldValue("idKontingen", kontingen.id);
      !values.namaKontingen && setFieldValue("namaKontingen", kontingen.nama);
    }
    if (atletToEdit?.id && !values.id) {
      setFieldValues(setFieldValue, atletToEdit);
    }
  };

  return (
    <Formik
      initialValues={atletInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={
        atletToEdit.id
          ? atletValidationSchemaWithoutFile
          : atletValidationSchema
      }
    >
      {(props: FormikProps<AtletState>) => {
        setForm(props.setFieldValue, props.values, atletToEdit);
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
                <InputText
                  label="Nama Lengkap"
                  name="nama"
                  upperCase
                  formik={props}
                />
                <InputSelect
                  label="Jenis Kelamin"
                  name="jenisKelamin"
                  options={jenisKelaminPeserta}
                  formik={props}
                />
                <InputTextArea
                  label="Alamat Lengkap"
                  name="alamatLengkap"
                  formik={props}
                />
              </div>
              <div>
                <InputText label="NIK" name="NIK" formik={props} />
                <InputText
                  label="Tempat Lahir"
                  name="tempatLahir"
                  formik={props}
                />
                <InputDate formik={props} />
                <InputText
                  label="Berat Badan"
                  name="beratBadan"
                  formik={props}
                  helperText="(KG)"
                />
                <InputText
                  label="Tinggi Badan"
                  name="tinggiBadan"
                  formik={props}
                  helperText="(CM)"
                />
                <InputText label="Email" name="email" under17 formik={props} />
                <InputText label="No HP" name="noHp" under17 formik={props} />
              </div>
              <div>
                <InputText
                  label="Nama Kontingen"
                  name="namaKontingen"
                  formik={props}
                  forceDisabled
                />
                <InputFile
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
                />
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
export default AtletForm;
