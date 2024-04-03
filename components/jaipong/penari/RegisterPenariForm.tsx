import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { Button } from "@/components/ui/button";
import {
  ResetForm,
  SetFieldValue,
  SetSubmitting,
} from "@/utils/form/FormConstants";
import {
  JenisTarian,
  PenariState,
  UnregisteredPenariState,
  biayaPenari,
  jenisTarian,
  kelasTarian,
  penariInitialValue,
  penariRampakValidationSchema,
  tingkatanKategoriJaipong,
  unregisteredPenariValue,
} from "@/utils/jaipong/penari/penariConstants";
import {
  getPenariLagu,
  // getPenariLagu,
  getPenariNamaTim,
  getTarianId,
  selectCategoryJaipong,
  selectLagu,
  updatePenari,
} from "@/utils/jaipong/penari/penariFunctions";
import { SanggarState } from "@/utils/jaipong/sanggar/sanggarConstants";
import { updateSanggar } from "@/utils/jaipong/sanggar/sanggarFunctions";
import { setTarianToEditRedux } from "@/utils/redux/jaipong/penarisSlice";
import { RootState } from "@/utils/redux/store";

import { Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jenis: JenisTarian;
};
const RegisterPenariForm = ({ setOpen, jenis }: Props) => {
  const [penari, setPenari] = useState(penariInitialValue);

  const allPenaris = useSelector((state: RootState) => state.penaris.all);
  const tarianToEdit = useSelector(
    (state: RootState) => state.penaris.tarianToEdit
  );
  const sanggar = useSelector((state: RootState) => state.sanggar.registered);
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

    if (jenis == "Rampak") values.lagu = "";

    // TARIAN
    const tarian = {
      jenis: values.jenisTarian,
      kelas: values.kelasTarian,
      tingkatan: values.tingkatanTarian,
      kategori: values.kategoriTarian,
    };

    // ID TARIAN
    const tarianId = getTarianId(tarian);

    // NEW PENARI
    let newPenari: PenariState = {
      ...penari,
      tarian: [...penari.tarian, tarian],
      nomorTarian: penari.nomorTarian + 1,
    };

    // ADD NAMA TIM
    if (values.namaTim) {
      newPenari = {
        ...newPenari,
        namaTim: [
          ...newPenari.namaTim,
          {
            idTarian: tarianId,
            namaTim: values.namaTim,
          },
        ],
      };
    }

    // ADD LAGU
    if (values.lagu) {
      newPenari = {
        ...newPenari,
        lagu: [
          ...newPenari.lagu,
          {
            idTarian: tarianId,
            lagu: values.lagu,
          },
        ],
      };
    }

    // CHECK IF ALREADY REGISTERED
    let sameTim = false;
    let sameLagu = false;

    const lagusTaken = penari.lagu
      .filter((lagu) => lagu.idTarian == tarianId)
      .map((lagu) => lagu.lagu);

    const namaTimsTaken = penari.namaTim
      .filter((namaTim) => namaTim.idTarian == tarianId)
      .map((namaTim) => namaTim.namaTim);

    if (namaTimsTaken.includes(values.namaTim) || jenis == "Tunggal") {
      sameTim = true;
    }

    if (lagusTaken.includes(values.lagu) || jenis == "Rampak") {
      sameLagu = true;
    }

    if (
      penari.tarian.some(
        (penari) =>
          penari.jenis == tarian.jenis &&
          penari.kelas == tarian.kelas &&
          penari.tingkatan == tarian.tingkatan &&
          penari.kategori == tarian.kategori
      ) &&
      sameLagu &&
      sameTim
    ) {
      if (tarianToEdit.id) {
        dispatch(setTarianToEditRedux(penariInitialValue));
        setOpen(false);
      } else {
        toast.error("Penari tidak dapat mengikuti kategori yang sama");
      }
      setSubmitting(false);
      return;
    }

    if (tarianToEdit.id) {
      const oldTarianFullId = getTarianId(tarianToEdit.tarian[0], {
        fullId: {
          namaTim: getPenariNamaTim(tarianToEdit),
          lagu: getPenariLagu(tarianToEdit),
        },
      });

      let pembayaran = [...newPenari.pembayaran];
      const paid = pembayaran.find((item) => item.idTarian == oldTarianFullId);

      let namaTim = [...newPenari.namaTim];
      let lagu = [...newPenari.lagu];
      let oldNamaTim = jenis == "Rampak" ? tarianToEdit.namaTim[0] : undefined;
      let oldLagu = jenis == "Tunggal" ? tarianToEdit.lagu[0] : undefined;

      if (paid) {
        pembayaran = pembayaran.filter((item) => item != paid);

        pembayaran.push({
          idTarian: getTarianId(tarian, {
            fullId: {
              namaTim: values.namaTim,
              lagu: values.lagu,
            },
          }),
          idPembayaran: paid.idPembayaran,
        });
      }

      if (oldNamaTim) {
        namaTim = namaTim.filter((item) => item != oldNamaTim);
      }

      if (oldLagu) {
        lagu = lagu.filter((item) => item != oldLagu);
      }

      newPenari = {
        ...newPenari,
        tarian: [...newPenari.tarian].filter(
          (item) => item != tarianToEdit.tarian[0]
        ),
        pembayaran,
        namaTim,
        lagu,
        nomorTarian: newPenari.nomorTarian - 1,
      };
    }

    updatePenari(newPenari, dispatch, {
      setSubmitting,
      onComplete: () => {
        if (tarianToEdit.id) {
          setOpen(false);
          resetForm();
          return;
        }
        setSubmitting(true);
        const biaya =
          jenis == "Rampak" ? biayaPenari.rampak : biayaPenari.tunggal;
        const newSanggar: SanggarState = {
          ...sanggar,
          tagihan: sanggar.tagihan + biaya,
          nomorTarian: sanggar.nomorTarian + 1,
        };
        updateSanggar(newSanggar, sanggar, dispatch, {
          setSubmitting,
          onComplete: resetForm,
        });
      },
    });
  };

  const handleCancel = (resetForm: ResetForm) => {
    dispatch(setTarianToEditRedux(penariInitialValue));
    resetForm();
    setOpen(false);
  };

  const getPenariById = (penariId: string) => {
    return allPenaris.find((penari) => penari.id == penariId) as PenariState;
  };

  const setForm = (
    setFieldValue: SetFieldValue,
    values: UnregisteredPenariState
  ) => {
    if (tarianToEdit.id && values.penariId != tarianToEdit.id) {
      const { jenis, kelas, tingkatan, kategori } = tarianToEdit.tarian[0];
      setFieldValue("penariId", tarianToEdit.id);
      setPenari(getPenariById(tarianToEdit.id));
      setFieldValue("jenisTarian", jenis);
      setFieldValue("kelasTarian", kelas);
      setFieldValue("tingkatanTarian", tingkatan);
      setFieldValue("kategoriTarian", kategori);
      jenis == "Rampak"
        ? setFieldValue("namaTim", getPenariNamaTim(tarianToEdit))
        : setFieldValue("lagu", getPenariLagu(tarianToEdit));
    }
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
      {(props: FormikProps<UnregisteredPenariState>) => {
        setForm(props.setFieldValue, props.values);
        return (
          <Form className="grid grid-rows-[1fr_auto] gap-y-1">
            <div className="flex gap-1 flex-col sm:flex-row justify-center *:input_group *:justify-normal">
              <div>
                <InputSelect
                  label="Penari"
                  name="penariId"
                  formik={props}
                  options={allPenaris.map((penari) => penari.id)}
                  onChange={(penariId) => setPenari(getPenariById(penariId))}
                  customOptionLabel={(penariId) => getPenariById(penariId).nama}
                  showOnEditOnly
                  forceDisabled={tarianToEdit.id != ""}
                />
                <InputSelect
                  label="Jenis Tarian"
                  name="jenisTarian"
                  options={jenisTarian}
                  forceDisabled
                  forceValue={jenis}
                  formik={props}
                  showOnEditOnly
                />
                <InputSelect
                  label="Kelas Tarian"
                  name="kelasTarian"
                  options={kelasTarian}
                  formik={props}
                  showOnEditOnly
                />
              </div>
              <div>
                <InputSelect
                  label="Tingkatan"
                  name="tingkatanTarian"
                  options={tingkatanKategoriJaipong.map(
                    (item) => item.tingkatan
                  )}
                  formik={props}
                  showOnEditOnly
                />
                <InputSelect
                  label="Kategori Tarian"
                  name="kategoriTarian"
                  options={selectCategoryJaipong(props.values.tingkatanTarian)}
                  formik={props}
                  dynamicOptions
                  showOnEditOnly
                  onEdit={tarianToEdit.id != ""}
                />
                {jenis == "Tunggal" && (
                  <InputSelect
                    label="Lagu"
                    name="lagu"
                    options={selectLagu(props.values.kelasTarian)}
                    formik={props}
                    dynamicOptions
                    showOnEditOnly
                    onEdit={tarianToEdit.id != ""}
                  />
                )}
                {jenis == "Rampak" && (
                  <InputText
                    label="Nama Tim"
                    name="namaTim"
                    formik={props}
                    upperCase
                    showOnEditOnly
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
        );
      }}
    </Formik>
  );
};
export default RegisterPenariForm;
