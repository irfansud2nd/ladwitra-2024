"use client";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  ResetForm,
  SetSubmitting,
  setFieldValue,
} from "@/utils/form/FormConstants";
import { Form, Formik, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/utils/redux/store";
import { setFieldValues } from "@/utils/form/FormFunctions";
import {
  SanggarState,
  sanggarInitialValue,
  sanggarValidationSchema,
} from "@/utils/jaipong/sanggar/sanggarConstants";
import {
  setSanggarRedux,
  setSanggarToEditRedux,
} from "@/utils/redux/jaipong/sanggarSlice";
import {
  sendSanggar,
  updateSanggar,
} from "@/utils/jaipong/sanggar/sanggarFunctions";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SanggarForm = ({ setOpen }: Props) => {
  const sanggarToEdit = useSelector((state: RootState) => state.sanggar.toEdit);
  const penaris = useSelector((state: RootState) => state.penaris.all);
  const koreografers = useSelector(
    (state: RootState) => state.koreografers.registered
  );

  const session = useSession();
  const dispatch = useDispatch();

  const handleSubmit = (
    values: SanggarState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (sanggarToEdit.id) {
      updateSanggar(values, sanggarToEdit, dispatch, {
        koreografers,
        penaris,
        setSubmitting,
        onComplete: resetForm,
      });
    } else {
      sendSanggar(values, dispatch, resetForm, setSubmitting).then(() =>
        setOpen(false)
      );
    }
  };

  const handleCancel = (resetForm: ResetForm) => {
    resetForm();
    dispatch(setSanggarToEditRedux(sanggarInitialValue));
    setOpen(false);
  };

  const setForm = (
    values: SanggarState,
    setFieldValue: setFieldValue,
    sanggarToEdit?: SanggarState
  ) => {
    !values.creatorEmail &&
      setFieldValue("creatorEmail", session.data?.user?.email);
    if (sanggarToEdit?.id && !values.id) {
      setFieldValues(setFieldValue, sanggarToEdit);
    }
  };

  return (
    <Formik
      onSubmit={(values, { resetForm, setSubmitting }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      initialValues={sanggarInitialValue}
      validationSchema={sanggarValidationSchema}
    >
      {(props: FormikProps<SanggarState>) => {
        setForm(props.values, props.setFieldValue, sanggarToEdit);
        return (
          <Form className="flex flex-col gap-2">
            <InputText
              name="nama"
              label="Nama Sanggar"
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
export default SanggarForm;
