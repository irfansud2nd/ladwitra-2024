import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import {
  ResetForm,
  SetSubmitting,
  SetFieldValue,
} from "@/utils/form/FormConstants";
import { setPertandinganToEditRedux } from "@/utils/redux/silat/atletsSlice";
import { RootState } from "@/utils/redux/store";
import {
  AtletState,
  JenisPertandingan,
  UnregisteredAtletState,
  atletInitialValue,
  biayaAtlet,
  jenisPertandingan,
  tingkatanKategoriSilat,
  unregisteredAtletValue,
} from "@/utils/silat/atlet/atletConstats";
import {
  getPertandinganId,
  selectCategorySilat,
  updateAtlet,
} from "@/utils/silat/atlet/atletFunctions";
import { KontingenState } from "@/utils/silat/kontingen/kontingenConstants";
import { updateKontingen } from "@/utils/silat/kontingen/kontingenFunctions";
import { Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jenis: JenisPertandingan;
};
const RegisterAtletForm = ({ setOpen, jenis }: Props) => {
  const [atlet, setAtlet] = useState(atletInitialValue);

  const allAtlets = useSelector((state: RootState) => state.atlets.all);
  const pertandinganToEdit = useSelector(
    (state: RootState) => state.atlets.pertandinganToEdit
  );
  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );
  const dispatch = useDispatch();

  const handleSubmit = (
    values: UnregisteredAtletState,
    resetForm: ResetForm,
    setSubmitting: SetSubmitting
  ) => {
    if (!values.atletId) {
      toast.error("Tolong pilih atlet terlebih dahulu");
      setSubmitting(false);
      return;
    }
    const pertandingan = {
      jenis: values.jenisPertandingan,
      tingkatan: values.tingkatanPertandingan,
      kategori: values.kategoriPertandingan,
    };
    let newAtlet: AtletState = {
      ...atlet,
      pertandingan: [...atlet.pertandingan, pertandingan],
      nomorPertandingan: atlet.nomorPertandingan + 1,
    };
    if (
      atlet.pertandingan.some(
        (atlet) =>
          atlet.jenis == pertandingan.jenis &&
          atlet.tingkatan == pertandingan.tingkatan &&
          atlet.kategori == pertandingan.kategori
      )
    ) {
      toast.error("Atlet tidak dapat mengikuti kategori yang sama");
      setSubmitting(false);
      return;
    }

    if (pertandinganToEdit.id) {
      const newPertandinganId = getPertandinganId(pertandingan);
      const oldPertandinganId = getPertandinganId(
        pertandinganToEdit.pertandingan[0]
      );

      let pembayaran = newAtlet.pembayaran;
      const paid = pertandinganToEdit.pembayaran.find(
        (item) => item.idPertandingan == oldPertandinganId
      );

      if (paid) {
        pembayaran = pembayaran.filter(
          (item) => item.idPertandingan != paid.idPertandingan
        );

        pembayaran.push({
          idPembayaran: paid.idPembayaran,
          idPertandingan: newPertandinganId,
        });
      }

      newAtlet = {
        ...newAtlet,
        pertandingan: [...newAtlet.pertandingan].filter(
          (item) => item != pertandinganToEdit.pertandingan[0]
        ),
        pembayaran,
      };
    }

    updateAtlet(newAtlet, dispatch, {
      setSubmitting,
      onComplete: () => {
        if (pertandinganToEdit.id) {
          resetForm();
          return;
        }
        setSubmitting(true);
        const newKontingen: KontingenState = {
          ...kontingen,
          tagihan: kontingen.tagihan + biayaAtlet,
          nomorPertandingan: kontingen.nomorPertandingan + 1,
        };
        updateKontingen(newKontingen, kontingen, dispatch, {
          setSubmitting: setSubmitting,
          onComplete: resetForm,
        });
      },
    });
  };

  const handleCancel = (resetForm: ResetForm) => {
    dispatch(setPertandinganToEditRedux(atletInitialValue));
    resetForm();
    setOpen(false);
  };

  const getAtletById = (atletId: string) => {
    return allAtlets.find(
      (atlet: AtletState) => atlet.id == atletId
    ) as AtletState;
  };

  const setForm = (
    setFieldValue: SetFieldValue,
    values: UnregisteredAtletState
  ) => {
    if (pertandinganToEdit.id && values.atletId != pertandinganToEdit.id) {
      const { jenis, tingkatan, kategori } = pertandinganToEdit.pertandingan[0];
      setFieldValue("atletId", pertandinganToEdit.id);
      setAtlet(pertandinganToEdit);
      setFieldValue("jenisPertandingan", jenis);
      setFieldValue("tingkatanPertandingan", tingkatan);
      setFieldValue("kategoriPertandingan", kategori);
    }
  };

  return (
    <Formik
      initialValues={unregisteredAtletValue}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, resetForm, setSubmitting)
      }
    >
      {(props: FormikProps<UnregisteredAtletState>) => {
        setForm(props.setFieldValue, props.values);
        return (
          <Form className="grid grid-rows-[1fr_auto] gap-y-1">
            <div className="flex gap-1 flex-col sm:flex-row justify-center *:input_group">
              <div>
                <InputSelect
                  label="Atlet"
                  name="atletId"
                  formik={props}
                  options={allAtlets.map((atlet) => atlet.id)}
                  onChange={(atletId) => setAtlet(getAtletById(atletId))}
                  customOptionLabel={(atletId) => getAtletById(atletId).nama}
                  showOnEditOnly
                  forceDisabled={pertandinganToEdit.id != ""}
                />
                <InputText
                  label="Tinggi Badan"
                  name="atlet.jenisKelamin"
                  formik={props}
                  forceValue={atlet.jenisKelamin}
                  forceDisabled
                  showOnEditOnly
                />
                <InputText
                  label="Tinggi Badan"
                  name="atlet.tinggiBadan"
                  helperText="(CM)"
                  formik={props}
                  forceValue={atlet.tinggiBadan}
                  forceDisabled
                  showOnEditOnly
                />
                <InputText
                  label="Berat Badan"
                  name="atlet.beratBadan"
                  helperText="(KG)"
                  formik={props}
                  forceValue={atlet.beratBadan}
                  forceDisabled
                  showOnEditOnly
                />
              </div>
              <div>
                <InputSelect
                  label="Jenis Pertandingan"
                  name="jenisPertandingan"
                  options={jenisPertandingan}
                  forceDisabled
                  forceValue={jenis}
                  formik={props}
                  showOnEditOnly
                />
                <InputSelect
                  label="Tingkatan"
                  name="tingkatanPertandingan"
                  options={tingkatanKategoriSilat.map((item) => item.tingkatan)}
                  formik={props}
                  showOnEditOnly
                />
                <InputSelect
                  label="Kategori Pertandingan"
                  name="kategoriPertandingan"
                  options={selectCategorySilat(
                    props.values.tingkatanPertandingan,
                    props.values.jenisPertandingan,
                    atlet.jenisKelamin
                  )}
                  formik={props}
                  dynamicOptions
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
export default RegisterAtletForm;
