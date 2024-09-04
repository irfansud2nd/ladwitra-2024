import { FormikErrors, FormikState } from "formik";
import { OfficialState } from "../silat/official/officialConstants";
import { AtletState } from "../silat/atlet/atletConstants";
import { PenariState } from "../jaipong/penari/penariConstants";
import { KoreograferState } from "../jaipong/koreografer/koreograferConstants";

// SET FIELD VALUE TYPE
export type SetFieldValue = (
  field: string,
  value: any,
  shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<any>>;

// RESET FORM TYPE
export type ResetForm = (
  nextState?: Partial<FormikState<any>> | undefined
) => void;

// SET SUBMITTING TYPE
export type SetSubmitting = (isSubmitting: boolean) => void;

// JENIS KELAMIN PESERTA
export const jenisKelaminPeserta = ["Putra", "Putri"];

export type Person =
  | OfficialState
  | AtletState
  | PenariState
  | KoreograferState;
