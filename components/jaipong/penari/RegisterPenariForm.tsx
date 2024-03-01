import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import { ResetForm, SetSubmitting } from "@/utils/form/FormConstants";
import {
  JenisTarian,
  PenariState,
  UnregisteredPenariState,
  jenisTarian,
  kelasTarian,
  penariInitialValue,
  penariRampakValidationSchema,
  tingkatanKategoriJaipong,
  unregisteredPenariValue,
} from "@/utils/jaipong/penari/penariConstants";
import {
  selectCategoryJaipong,
  updatePenari,
} from "@/utils/jaipong/penari/penariFunctions";
import { RootState } from "@/utils/redux/store";

import { Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jenis: JenisTarian;
};
const RegisterPenariForm = ({ setOpen, jenis }: Props) => {
  const [penari, setPenari] = useState(penariInitialValue);

  const allPenaris = useSelector((state: RootState) => state.penaris.all);
  const dispatch = useDispatch();

  const handleSubmit = (
    values: UnregisteredPenariState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (!values.penariId) {
      toast.error("Tolong pilih penari terlebih dahulu");
      setSubmitting(false);
      return;
    }
    const tarian = {
      jenis: values.jenisTarian,
      kelas: values.kelasTarian,
      tingkatan: values.tingkatanTarian,
      kategori: values.kategoriTarian,
      namaTim: values.namaTim,
      idPembayaran: "",
    };
    const newPenari: PenariState = {
      ...penari,
      tarian: [...penari.tarian, tarian],
      nomorTarian: penari.nomorTarian + 1,
    };
    if (
      penari.tarian.some(
        (penari) =>
          penari.jenis == tarian.jenis &&
          penari.kelas == tarian.kelas &&
          penari.tingkatan == tarian.tingkatan &&
          penari.kategori == tarian.kategori
      )
    ) {
      toast.error("Penari tidak dapat mengikuti kategori yang sama");
      setSubmitting(false);
      return;
    }
    updatePenari(newPenari, dispatch, setSubmitting, resetForm);
  };

  const handleCancel = (resetForm: ResetForm) => {
    resetForm();
    setOpen(false);
  };

  const getPenariById = (penariId: string) => {
    return allPenaris.find((penari) => penari.id == penariId) as PenariState;
  };

  return (
    <Formik
      initialValues={unregisteredPenariValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
      validationSchema={
        jenis == "Rampak" ? penariRampakValidationSchema : undefined
      }
    >
      {(props: FormikProps<UnregisteredPenariState>) => (
        <Form className="grid grid-rows-[1fr_auto] gap-y-1">
          <div className="flex gap-1 flex-wrap justify-center *:input_group *:justify-normal">
            <div>
              <InputSelect
                label="Penari"
                name="penariId"
                formik={props}
                options={allPenaris.map((penari) => penari.id)}
                onChange={(penariId) => setPenari(getPenariById(penariId))}
                customOptionLabel={(penariId) => getPenariById(penariId).nama}
              />
              <InputSelect
                label="Jenis Tarian"
                name="jenisTarian"
                options={jenisTarian}
                forceDisabled
                forceValue={jenis}
                formik={props}
              />
              <InputSelect
                label="Kelas Tarian"
                name="kelasTarian"
                options={kelasTarian}
                formik={props}
              />
            </div>
            <div>
              <InputSelect
                label="Tingkatan"
                name="tingkatanTarian"
                options={tingkatanKategoriJaipong.map((item) => item.tingkatan)}
                formik={props}
              />
              <InputSelect
                label="Kategori Tarian"
                name="kategoriTarian"
                options={selectCategoryJaipong(props.values.tingkatanTarian)}
                formik={props}
                dynamicOptions
              />
              {jenis == "Rampak" && (
                <InputText
                  label="Nama Tim"
                  name="namaTim"
                  formik={props}
                  upperCase
                />
              )}
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
      )}
    </Formik>
  );
};
export default RegisterPenariForm;
