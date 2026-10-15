"use client";

import { useEffect, useState } from "react";
import { COUNTDOWN, EVENT } from "../content";

/*
  Cuenta regresiva hasta el inicio de la masterclass (EVENT.startsAt, hora de
  Colombia). La página es estática: en el servidor y en el primer pintado se
  muestran guiones, y la hora real del visitante se toma al montar (sin
  desajuste de hidratación).

  Los números cambian cada segundo y no se anuncian (aria-hidden): para
  lectores de pantalla hay un texto fijo con la fecha.
*/

const TARGET = Date.parse(EVENT.startsAt);

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, []);

  if (now !== null && now >= TARGET) {
    return (
      <p className="flex items-center gap-2 text-[0.9375rem] font-semibold uppercase tracking-[0.12em] text-burgundy">
        <span aria-hidden="true" className="size-2 rounded-full bg-burgundy" />
        {COUNTDOWN.started}
      </p>
    );
  }

  const parts = now === null ? null : split(TARGET - now);
  const units = [
    { label: COUNTDOWN.units.days, value: parts?.days },
    { label: COUNTDOWN.units.hours, value: parts?.hours },
    { label: COUNTDOWN.units.minutes, value: parts?.minutes },
    { label: COUNTDOWN.units.seconds, value: parts?.seconds },
  ];

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <p className="hidden text-[0.75rem] font-medium uppercase tracking-[0.3em] text-tierra md:block">{COUNTDOWN.label}</p>
      <ol aria-hidden="true" className="flex items-stretch gap-1.5 sm:gap-2">
        {units.map(({ label, value }) => (
          <li
            key={label}
            className="grid min-w-[2.65rem] place-items-center rounded-md border border-rosa/70 bg-papel/70 px-1 pb-1 pt-1.5 sm:min-w-[3.4rem] sm:px-1.5"
          >
            <span className="font-serif text-[1.3rem] font-semibold leading-none text-burgundy [font-variant-numeric:lining-nums_tabular-nums] sm:text-[1.65rem]">
              {value === undefined ? "--" : pad(value)}
            </span>
            <span className="mt-0.5 text-[0.5625rem] font-medium uppercase tracking-[0.12em] text-tierra sm:text-[0.625rem]">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
