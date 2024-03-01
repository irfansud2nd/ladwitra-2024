import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main
      style={{ backgroundImage: "url(/images/background.png)" }}
      className="bg-cover bg-center"
    >
      <div className="bg-background/65 w-full h-full flex justify-center items-center">
        <div className="backdrop-blur-sm flex flex-col items-center justify-center w-full py-10">
          <h1 className="text-4xl font-extrabold mb-5 text-center">
            Selamat Datang !
            <br />
            <span className="text-3xl font-bold">
              Peserta Ladwitra Championship 2024
            </span>
          </h1>
          <div className="flex gap-x-5 mb-2">
            <Link
              href={"https://maps.app.goo.gl/okajp1pajDAp6bvq7"}
              className="border-b-2 hover:border-foreground border-transparent transition-all flex items-center gap-1"
              target="_blank"
            >
              <FaLocationDot />
              Labschool UPI Cibiru
            </Link>
            <p className="flex items-center gap-1">
              <FaCalendarAlt />
              18 - 19 Mei 2024
            </p>
          </div>
          <div className="flex gap-x-10 gap-y-5 flex-col sm:flex-row">
            <Button>
              <Link href={"silat/atlet"}>Pendaftaran Pencak Silat</Link>
            </Button>
            <Button>
              <Link href={"proposal"} target="_blank">
                Proposal
              </Link>
            </Button>
            <Button>
              <Link href={"jaipong/penari"}>Pendaftaran Tari Jaipong</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
