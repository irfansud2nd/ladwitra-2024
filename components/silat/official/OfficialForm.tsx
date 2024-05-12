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
import { updateKontingenRedux } from "@/utils/redux/silat/kontingenSlice";
import {
  addOfficialRedux,
  setOfficialToEditRedux,
  updateOfficialRedux,
} from "@/utils/redux/silat/officialsSlice";
import { RootState } from "@/utils/redux/store";
import {
  OfficialState,
  jabatanOfficials,
  jenisKelaminDewasa,
  officialInitialValue,
  officialValidationSchema,
  officialValidationSchemaWithoutFile,
} from "@/utils/silat/official/officialConstants";
import {
  sendOfficial,
  updateOfficial,
} from "@/utils/silat/official/officialFunctions";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OfficialForm = ({ setOpen }: Props) => {
  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );
  const officialToEdit = useSelector(
    (state: RootState) => state.officials.toEdit
  );

  const dispatch = useDispatch();
  const session = useSession();

  const handleSubmit = (
    official: OfficialState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (officialToEdit.id) {
      updateOfficial(official)
        .then((official) => {
          dispatch(updateOfficialRedux(official));
          resetForm();
          setOpen(false);
        })
        .finally(() => setSubmitting(false));
    } else {
      sendOfficial(official, kontingen)
        .then(({ official, kontingen }) => {
          dispatch(addOfficialRedux(official));
          dispatch(updateKontingenRedux(kontingen));
          resetForm();
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    setOpen(false);
    dispatch(setOfficialToEditRedux(officialInitialValue));
    resetForm();
  };

  const setForm = (
    setFieldValue: SetFieldValue,
    values: OfficialState,
    officialToEdit?: OfficialState
  ) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    if (kontingen) {
      !values.kontingen.id && setFieldValue("kontingen.id", kontingen.id);
      !values.kontingen.nama && setFieldValue("kontingen.nama", kontingen.nama);
    }
    if (officialToEdit?.id && !values.id) {
      setFieldValues(setFieldValue, officialToEdit);
    }
  };

  return (
    <Formik
      initialValues={officialInitialValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={
        officialToEdit.id
          ? officialValidationSchemaWithoutFile
          : officialValidationSchema
      }
    >
      {(props: FormikProps<OfficialState>) => {
        setForm(props.setFieldValue, props.values, officialToEdit);
        return (
          <Form className="grid grid-rows-[1fr_auto] gap-y-1">
            <div className="flex gap-1 flex-col sm:flex-row">
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
                  label="Nama Kontingen"
                  name="namaKontingen"
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
                  options={jabatanOfficials}
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
export default OfficialForm;
