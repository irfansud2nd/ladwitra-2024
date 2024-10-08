"use client";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  ResetForm,
  SetSubmitting,
  SetFieldValue,
} from "@/utils/form/FormConstants";
import {
  KontingenState,
  kontingenInitialValue,
  kontingenValidationSchema,
} from "@/utils/silat/kontingen/kontingenConstants";
import { Form, Formik, FormikProps } from "formik";
import {
  sendKontingen,
  updateKontingen,
} from "../../../utils/silat/kontingen/kontingenFunctions";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setKontingenRedux,
  setKontingenToEditRedux,
  updateKontingenRedux,
} from "@/utils/redux/silat/kontingenSlice";
import { RootState } from "@/utils/redux/store";
import { setFieldValues } from "@/utils/form/FormFunctions";
import { addAtletsRedux } from "@/utils/redux/silat/atletsSlice";
import { addOfficialsRedux } from "@/utils/redux/silat/officialsSlice";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const KontingenForm = ({ setOpen }: Props) => {
  const kontingenToEdit = useSelector(
    (state: RootState) => state.kontingen.toEdit
  );
  const atlets = useSelector((state: RootState) => state.atlets.all);
  const officials = useSelector(
    (state: RootState) => state.officials.registered
  );

  const session = useSession();
  const dispatch = useDispatch();

  const handleSubmit = (
    values: KontingenState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (kontingenToEdit.id) {
      updateKontingen(values, kontingenToEdit, { officials, atlets })
        .then(({ atlets, officials }) => {
          dispatch(addAtletsRedux(atlets));
          dispatch(addOfficialsRedux(officials));
          dispatch(setKontingenToEditRedux(kontingenInitialValue));
          dispatch(updateKontingenRedux(values));
          resetForm();
          setOpen(false);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      sendKontingen(values)
        .then((kontingen) => {
          dispatch(setKontingenRedux(kontingen));
          setOpen(false);
        })
        .finally(() => {
          resetForm();
          setSubmitting(false);
        });
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    resetForm();
    dispatch(setKontingenToEditRedux(kontingenInitialValue));
    setOpen(false);
  };

  const setForm = (
    values: KontingenState,
    setFieldValue: SetFieldValue,
    kontingenToEdit?: KontingenState
  ) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    if (kontingenToEdit?.id && !values.id) {
      setFieldValues(setFieldValue, kontingenToEdit);
    }
  };

  return (
    <Formik
      onSubmit={(values, { resetForm, setSubmitting }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      initialValues={kontingenInitialValue}
      validationSchema={kontingenValidationSchema}
    >
      {(props: FormikProps<KontingenState>) => {
        setForm(props.values, props.setFieldValue, kontingenToEdit);
        return (
          <Form className="flex flex-col gap-2">
            <InputText
              name="nama"
              label="Nama Kontingen"
              upperCase
              formik={props}
            />
            <DialogFooter>
              <Button
                type="submit"
                variant="default"
                disabled={props.isSubmitting}
              >
                Simpan
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={props.isSubmitting}
                  onClick={() => handleCancel(props.resetForm)}
                >
                  Batal
                </Button>
              </DialogClose>
            </DialogFooter>
          </Form>
        );
      }}
    </Formik>
  );
};
export default KontingenForm;
