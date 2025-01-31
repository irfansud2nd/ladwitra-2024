import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main
      // style={{ backgroundImage: "url(/images/background.png)" }}
      // className="bg-cover bg-center"
      className="temp_bg"
    >
      <div className="bg-background/65 w-full h-full flex justify-center items-center">
        <div className="backdrop-blur-sm flex flex-col items-center justify-center w-full py-10">
          <h1 className="text-4xl font-extrabold mb-5 text-center">
            Segera Hadir !
            <br />
            <span className="text-3xl font-bold">
              Ladwimatra Championship III 2025
            </span>
          </h1>
          <div className="flex gap-x-5 mb-2">
            <Link
              href={"https://maps.app.goo.gl/pf3SmMKcd489vbx66"}
              className="border-b-2 hover:border-foreground border-transparent transition-all flex items-center gap-1"
              target="_blank"
            >
              <FaLocationDot />
              Teras Sunda Cibiru
            </Link>
            <p className="flex items-center gap-1">
              <FaCalendarAlt />
              Sabtu, 19 April 2025
            </p>
          </div>
          <div className="flex gap-x-10 gap-y-5 flex-col sm:flex-row">
            {/* <Button>
              <Link href={"silat/atlet"}>Pendaftaran Pencak Silat</Link>
            </Button> */}
            <Button>
              <Link href={"proposal"} target="_blank">
                Proposal
              </Link>
            </Button>
            {/* <Button>
              <Link href={"jaipong/penari"}>Pendaftaran Tari Jaipong</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </main>
  );
}
