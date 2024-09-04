"use client";

import { PenariColumnAdmin } from "@/components/admin/jaipong/penari/PenariColumnAdmin";
import { AtletColumnAdmin } from "@/components/admin/silat/atlet/AtletColumnAdmin";
import UnderDevelopment from "@/components/authorization/UnderDevelopment";
import FullLoading from "@/components/loadings/FullLoading";
import InlineLoading from "@/components/loadings/InlineLoading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import useShowFileDialog from "@/hooks/UseShowFileDialog";
import {
  formatDate,
  formatToRupiah,
  toastFirebaseError,
} from "@/utils/functions";
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import {
  getPenariLagu,
  getPenariNamaTim,
  getTarianId,
} from "@/utils/jaipong/penari/penariFunctions";
import { SanggarState } from "@/utils/jaipong/sanggar/sanggarConstants";
import { paymentInitialValue } from "@/utils/payment/paymentConstants";
import { deletePayment } from "@/utils/payment/paymentFunctions";
import { updatePenariRedux } from "@/utils/redux/jaipong/penarisSlice";
import { updateSanggarRedux } from "@/utils/redux/jaipong/sanggarSlice";
import { updateAtletRedux } from "@/utils/redux/silat/atletsSlice";
import { updateKontingenRedux } from "@/utils/redux/silat/kontingenSlice";
import {
  deletePaymentRedux,
  setPaymentToConfirmRedux,
} from "@/utils/redux/silat/paymentsSlice";
import { RootState } from "@/utils/redux/store";
import { AtletState } from "@/utils/silat/atlet/atletConstants";
import { getPertandinganId } from "@/utils/silat/atlet/atletFunctions";
import { KontingenState } from "@/utils/silat/kontingen/kontingenConstants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = ({
  params,
}: {
  params: { source: "silat" | "jaipong"; idPembayaran: string };
}) => {
  const { source, idPembayaran } = params;

  const { showFile, ShowFileDialog } = useShowFileDialog();

  const [payment, setPayment] = useState(paymentInitialValue);
  const [invalidId, setInvalidId] = useState(false);
  const [group, setGroup] = useState<KontingenState | SanggarState>();
  const [pesertas, setPesertas] = useState<AtletState[] | PenariState[]>([]);
  const [pesertasToMap, setPesertasToMap] = useState<
    AtletState[] | PenariState[]
  >([]);

  const [disable, setDisable] = useState(false);

  const paymentToConfirm = useSelector(
    (state: RootState) => state.payments.toConfirm
  );
  const dispatch = useDispatch();

  const getPayment = () => {
    axios
      .get(`/api/payments?source=${source}&id=${idPembayaran}`)
      .then((res) => {
        if (!res.data.result.length) return setInvalidId(true);
        setPayment(res.data.result[0]);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getGroup = () => {
    const targetCollection = source == "silat" ? "kontingens" : "sanggars";
    axios
      .get(`/api/${targetCollection}?idPembayaran=${idPembayaran}`)
      .then((res) => setGroup(res.data.result[0]))
      .catch((error) => toastFirebaseError(error));
  };

  const getPesertas = () => {
    const targetCollection = source == "silat" ? "atlets" : "penaris";
    axios
      .get(`/api/${targetCollection}?idPembayaran=${idPembayaran}`)
      .then((res) => {
        let pesertas = res.data.result;
        let result: any = [];
        if (source == "silat") {
          let atlets: AtletState[] = pesertas;
          atlets.map((atlet) => {
            const paidPertandinganId = atlet.pembayaran
              .filter((pembayaran) => pembayaran.idPembayaran == idPembayaran)
              .map((pembayaran) => pembayaran.idPertandingan);
            const newPertandingan = atlet.pertandingan.filter((pertandingan) =>
              paidPertandinganId.includes(getPertandinganId(pertandingan))
            );
            result.push({ ...atlet, pertandingan: newPertandingan });
          });
        } else {
          let penaris: PenariState[] = pesertas;
          penaris.map((penari) => {
            const paidTarianId = penari.pembayaran
              .filter((pembayaran) => pembayaran.idPembayaran == idPembayaran)
              .map((pembayaran) => pembayaran.idTarian);
            const newTarian = penari.tarian.filter((tarian, i) => {
              const namaTim = getPenariNamaTim(penari, i);
              const lagu = getPenariLagu(penari, i);
              return paidTarianId.includes(
                getTarianId(tarian, { fullId: { namaTim, lagu } })
              );
            });
            result.push({ ...penari, tarian: newTarian });
          });
        }
        setPesertas(pesertas);
        setPesertasToMap(result);
      })
      .catch((error) => toastFirebaseError(error));
  };

  useEffect(() => {
    if (paymentToConfirm.id) {
      if (payment.id != paymentToConfirm.id) setPayment(paymentToConfirm);
    } else {
      getPayment();
    }
    // if (!group?.id) getGroup();
    // if (!pesertas.length) getPesertas();
  }, []);

  useEffect(() => {
    if (payment.id) {
      getGroup();
      getPesertas();
      dispatch(setPaymentToConfirmRedux(paymentInitialValue));
    }
  }, [payment]);

  const columns: any = source == "silat" ? AtletColumnAdmin : PenariColumnAdmin;

  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = async () => {
    if (!group?.id || !pesertasToMap.length) return;

    const result = await confirm("Batalkan Pembayaran");
    if (result) {
      setDisable(true);
      deletePayment(source, group, pesertas, payment)
        .then(({ newGroup, newPesertas }) => {
          dispatch(
            source == "silat"
              ? updateKontingenRedux(newGroup as KontingenState)
              : updateSanggarRedux(newGroup as SanggarState)
          );
          newPesertas.map((peserta) => {
            source == "silat"
              ? dispatch(updateAtletRedux(peserta as AtletState))
              : dispatch(updatePenariRedux(peserta as PenariState));
          });
          dispatch(deletePaymentRedux(payment));
          setInvalidId(true);
        })
        .finally(() => setDisable(false));
    }
  };

  if (invalidId)
    return (
      <h1 className="text-xl font-semibold">
        {payment.id
          ? "Pembayaran telah dibatalkan"
          : "ID pembayaran tidak valid"}
      </h1>
    );

  if (!payment.id) return <FullLoading />;

  return (
    <>
      <ConfirmationDialog />
      <ShowFileDialog />
      <div className="relative h-fit w-full max-w-full overflow-auto">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>ID Pembayaran</TableHead>
              <TableHead>
                {source == "silat" ? "Kontingen" : "Sanggar"}
              </TableHead>
              <TableHead>Total Pembayaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email Pembayar</TableHead>
              <TableHead>No HP Pembayar</TableHead>
              <TableHead>Waktu Pembayaran</TableHead>
              <TableHead>Bukti</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{idPembayaran}</TableCell>
              <TableCell>{group?.nama ?? <InlineLoading />}</TableCell>
              <TableCell>{formatToRupiah(payment.totalPembayaran)}</TableCell>
              <TableCell>
                {payment.confirmed
                  ? `Dikonfirmasi oleh ${payment.confirmedBy}`
                  : "Menunggu Konfirmasi"}
              </TableCell>
              <TableCell>{payment.creatorEmail}</TableCell>
              <TableCell>{payment.noHp}</TableCell>
              <TableCell>{formatDate(payment.waktuPembayaran)}</TableCell>
              <TableCell>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() =>
                    showFile("Bukti Pembayaran", payment.downloadBuktiUrl)
                  }
                >
                  Show
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <AdminTable
        title="Pesertas"
        columns={columns}
        data={pesertasToMap as any}
        loading={pesertasToMap.length == 0}
        hFit
      />
      <div className="w-full h-fit flex justify-end mt-1">
        <Button
          variant={"destructive"}
          onClick={handleDelete}
          disabled={disable || !group?.id || !pesertasToMap.length}
        >
          Batalkan Pembayaran
        </Button>
      </div>
    </>
  );
};
export default page;
