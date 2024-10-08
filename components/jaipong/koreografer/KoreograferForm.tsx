import InputFile from "@/components/inputs/InputFile";
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import {
  ResetForm,
  SetSubmitting,
  SetFieldValue,
} from "@/utils/form/FormConstants";
import { setFieldValues } from "@/utils/form/FormFunctions";
import {
  addKoreograferRedux,
  setKoreograferToEditRedux,
  updateKoreograferRedux,
} from "@/utils/redux/jaipong/koreografersSlice";
import { RootState } from "@/utils/redux/store";
import {
  KoreograferState,
  jabatanKoreografers,
  jenisKelaminDewasa,
  koreograferInitialValue,
  koreograferValidationSchema,
  koreograferValidationSchemaWithoutFile,
} from "@/utils/jaipong/koreografer/koreograferConstants";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendKoreografer,
  updateKoreografer,
} from "@/utils/jaipong/koreografer/koreograferFunctions";
import { updateSanggarRedux } from "@/utils/redux/jaipong/sanggarSlice";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const KoreograferForm = ({ setOpen }: Props) => {
  const sanggar = useSelector((state: RootState) => state.sanggar.registered);
  const koreograferToEdit = useSelector(
    (state: RootState) => state.koreografers.toEdit
  );

  const dispatch = useDispatch();
  const session = useSession();

  const handleSubmit = (
    koreografer: KoreograferState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (koreograferToEdit.id) {
      updateKoreografer(koreografer)
        .then((koreografer) => {
          dispatch(updateKoreograferRedux(koreografer));
          resetForm();
          setOpen(false);
        })
        .finally(() => setSubmitting(false));
    } else {
      sendKoreografer(koreografer, sanggar)
        .then(({ koreografer, sanggar }) => {
          dispatch(addKoreograferRedux(koreografer));
          dispatch(updateSanggarRedux(sanggar));
          resetForm();
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    setOpen(false);
    dispatch(setKoreograferToEditRedux(koreograferInitialValue));
    resetForm();
  };

  const setForm = (
    setFieldValue: SetFieldValue,
    values: KoreograferState,
    koreograferToEdit?: KoreograferState
  ) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    if (sanggar) {
      !values.idSanggar && setFieldValue("idSanggar", sanggar.id);
      !values.namaSanggar && setFieldValue("namaSanggar", sanggar.nama);
    }
    if (koreograferToEdit?.id && !values.id) {
      setFieldValues(setFieldValue, koreograferToEdit);
    }
  };

  return (
    <Formik
      initialValues={koreograferInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={
        koreograferToEdit.id
          ? koreograferValidationSchemaWithoutFile
          : koreograferValidationSchema
      }
    >
      {(props: FormikProps<KoreograferState>) => {
        setForm(props.setFieldValue, props.values, koreograferToEdit);
        return (
          <Form className="grid grid-rows-[1fr_auto]">
            <div className="flex gap-1 flex-wrap">
              <InputFile
                label="Pas Foto"
                name="fotoFile"
                urlName="downloadFotoUrl"
                formik={props}
                className="w-[150px]"
              />
              <div>
                <InputText
                  label="Nama Lengkap"
                  name="nama"
                  upperCase
                  formik={props}
                />
                <InputText
                  label="Nama sanggar"
                  name="namaSanggar"
                  formik={props}
                />
                <InputSelect
                  label="Jenis Kelamin"
                  name="jenisKelamin"
                  options={jenisKelaminDewasa}
                  formik={props}
                />
                <InputSelect
                  label="Jabatan"
                  name="jabatan"
                  options={jabatanKoreografers}
                  formik={props}
                  showOnEditOnly
                />
              </div>
            </div>
            <div className="flex gap-1 w-full justify-end">
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
export default KoreograferForm;
