"use client";

import { useId, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { TESTIMONIOS } from "../content";
import { IconClose } from "./icons";
import type { VideoTestimonial } from "./TestimonialsCarousel";

/** No se monta un reproductor hasta elegir una portada. Cerrar lo desmonta:
 * se detienen el sonido y la descarga; al reabrir, el video empieza de nuevo.
 */
export function TestimonialVideoDialog({ item, onClose }: { item: VideoTestimonial | null; onClose: () => void }) {
  const titleId = useId();
  const playerRef = useRef<HTMLVideoElement>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = item !== null && failedUrl === item.playbackUrl;

  function close() {
    playerRef.current?.pause();
    setFailedUrl(null);
    onClose();
  }

  return (
    <Dialog open={item !== null} onClose={close} labelledBy={titleId} bare className="tono-oscuro w-[min(calc(100%-2rem),64rem)] max-h-[calc(100dvh-2rem)] overflow-auto rounded-xl border border-malva/40 text-crema backdrop:bg-noche/85 backdrop:backdrop-blur-sm">
      <div className="modal-tarjeta overflow-hidden rounded-xl bg-noche">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <h2 id={titleId} className="text-base font-medium">{item?.title}</h2>
          <button type="button" onClick={close} aria-label={TESTIMONIOS.close} className="grid size-11 shrink-0 place-items-center rounded-full border border-crema/30 transition-colors hover:bg-crema/10">
            <IconClose className="size-5" />
          </button>
        </div>
        {item ? (
          <video
            key={item.playbackUrl}
            ref={playerRef}
            src={item.playbackUrl}
            poster={item.poster.src}
            controls
            playsInline
            autoPlay
            preload="none"
            aria-label={item.title}
            onError={() => setFailedUrl(item.playbackUrl)}
            className="aspect-video max-h-[calc(100dvh-8rem)] w-full bg-noche object-contain"
          >
            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer">{TESTIMONIOS.openVideo}</a>
          </video>
        ) : null}
        {failed && item ? (
          <div role="alert" className="px-5 pb-5 text-sm leading-relaxed">
            <p>{TESTIMONIOS.error}</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <button type="button" className="underline underline-offset-4" onClick={() => {
                setFailedUrl(null);
                playerRef.current?.load();
                void playerRef.current?.play().catch(() => {});
              }}>{TESTIMONIOS.retry}</button>
              <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{TESTIMONIOS.openVideo}</a>
            </div>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}
