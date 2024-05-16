import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import {
  getPenariLagu,
  getPenariNamaTim,
  getTarianId,
  splitTarianId,
} from "@/utils/jaipong/penari/penariFunctions";

type Props = {
  penari: PenariState;
  idTarian?: string;
};

const TarianCell = ({ penari, idTarian }: Props) => {
  let seen: any[] = [];
  let index = 0;

  let tarian = penari.tarian;

  if (idTarian) {
    const { jenisTarian, kelas, tingkatan, kategori } = splitTarianId(idTarian);
    tarian = tarian.filter(
      (item) =>
        item.jenis == jenisTarian &&
        item.kelas == kelas &&
        item.tingkatan == tingkatan &&
        item.kategori == kategori
    );
  }

  return (
    <div className="flex flex-col">
      {tarian.map((tarian, i) => {
        let isSeen = seen.find((item) => item.id == getTarianId(tarian));
        if (isSeen) {
          index = isSeen.index + 1;
        } else {
          seen.push({ id: getTarianId(tarian), index: 0 });
          index = 0;
        }
        if (tarian.jenis == "Tunggal") {
          return (
            <>
              <span key={i}>
                {getTarianId(tarian, { useSpace: true })} -{" "}
                {getPenariLagu(penari, i, index)}
              </span>
              {i < penari.tarian.length && <br />}
            </>
          );
        } else {
          return (
            <>
              <span key={i}>
                {getTarianId(tarian, { useSpace: true })} -{" "}
                {getPenariNamaTim(penari, i, index)}
              </span>
              {i < penari.tarian.length && <br />}
            </>
          );
        }
      })}
    </div>
  );
};
export default TarianCell;
