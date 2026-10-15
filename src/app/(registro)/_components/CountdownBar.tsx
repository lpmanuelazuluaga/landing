import { COUNTDOWN, EVENT } from "../content";
import { Countdown } from "./Countdown";

/*
  Barra fija superior: papel claro translúcido con desenfoque (vidrio) sobre la
  página, el nombre de la masterclass y la cuenta regresiva. Es sticky: queda
  arriba al hacer scroll. El modal la cubre (top layer).
*/
export function CountdownBar() {
  return (
    <header className="barra-vidrio sticky top-0 z-40 border-b border-rosa/60">
      <div className="relative mx-auto flex max-w-[76rem] items-center justify-between gap-3 px-gutter py-2 sm:px-gutter-lg sm:py-2.5">
        <div className="min-w-0">
          <p className="font-serif text-[1.05rem] uppercase leading-[1.05] text-tierra sm:text-[1.4rem]">
            {COUNTDOWN.title[0].map((segment, index) =>
              typeof segment === "string" ? (
                <span key={index} className="block sm:inline">
                  {segment}
                </span>
              ) : (
                <strong key={index} className="block font-bold text-burgundy sm:inline">
                  {segment.strong}
                </strong>
              ),
            )}
          </p>
          {/* Para lectores de pantalla: la fecha completa, sin los números que cambian. */}
          <p className="sr-only">{EVENT.date}</p>
        </div>
        <Countdown />
      </div>
    </header>
  );
}
