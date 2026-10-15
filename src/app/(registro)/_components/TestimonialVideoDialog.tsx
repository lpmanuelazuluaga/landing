"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { TESTIMONIOS } from "../content";
import { IconClose, IconPlay } from "./icons";
import type { VideoTestimonial } from "./TestimonialsCarousel";

/** No se monta un reproductor hasta elegir una portada. Cerrar lo desmonta:
 * se detienen el sonido y la descarga; al reabrir, el video empieza de nuevo.
 */
export function TestimonialVideoDialog({ item, onClose }: { item: VideoTestimonial | null; onClose: () => void }) {
  const titleId = useId();
  const playerRef = useRef<HTMLVideoElement>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [needsPlay, setNeedsPlay] = useState(false);
  const failed = item !== null && failedUrl === item.playbackUrl;

  const playWithSound = useCallback((player: HTMLVideoElement) => {
    player.defaultMuted = false;
    player.muted = false;
    player.volume = 1;
    void player.play().catch((error: unknown) => {
      if (playerRef.current === player && error instanceof DOMException && error.name === "NotAllowedError") {
        setNeedsPlay(true);
      }
    });
  }, []);

  // El ref se conecta al montar el video tras el clic, sin esperar su carga
  // ni recurrir a autoplay silenciado. Los controles conservan su mute manual.
  const attachPlayer = useCallback((player: HTMLVideoElement | null) => {
    playerRef.current = player;
    if (player) playWithSound(player);
  }, [playWithSound]);

  function close() {
    playerRef.current?.pause();
    setFailedUrl(null);
    setNeedsPlay(false);
    onClose();
  }

  return (
    <Dialog open={item !== null} onClose={close} labelledBy={titleId} bare className="tono-oscuro w-[min(calc(100%-2rem),64rem)] max-h-[calc(100dvh-2rem)] overflow-auto rounded-xl border border-malva/40 text-crema backdrop:bg-noche/85 backdrop:backdrop-blur-sm">
      <div className="modal-tarjeta overflow-hidden rounded-xl bg-noche">
        <div className="flex items-center justify-end gap-4 px-4 py-3 sm:px-5">
          <h2 id={titleId} className="sr-only">{item?.title}</h2>
          <button type="button" onClick={close} aria-label={TESTIMONIOS.close} className="grid size-11 shrink-0 place-items-center rounded-full border border-crema/30 transition-colors hover:bg-crema/10">
            <IconClose className="size-5" />
          </button>
        </div>
        {item ? (
          <video
            key={item.playbackUrl}
            ref={attachPlayer}
            src={item.playbackUrl}
            poster={item.poster.src}
            controls
            playsInline
            muted={false}
            preload="none"
            aria-label={item.title}
            onError={() => setFailedUrl(item.playbackUrl)}
            onPlaying={() => setNeedsPlay(false)}
            className="aspect-video max-h-[calc(100dvh-8rem)] w-full bg-noche object-contain"
          >
            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer">{TESTIMONIOS.openVideo}</a>
          </video>
        ) : null}
        {needsPlay && !failed ? (
          <div className="flex justify-center px-4 py-3">
            <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-crema px-5 py-2 text-sm font-medium text-burgundy" onClick={() => {
              if (playerRef.current) playWithSound(playerRef.current);
            }}>
              <IconPlay className="size-4" />
              {TESTIMONIOS.playWithSound}
            </button>
          </div>
        ) : null}
        {failed && item ? (
          <div role="alert" className="px-5 pb-5 text-sm leading-relaxed">
            <p>{TESTIMONIOS.error}</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <button type="button" className="underline underline-offset-4" onClick={() => {
                setFailedUrl(null);
                playerRef.current?.load();
                if (playerRef.current) playWithSound(playerRef.current);
              }}>{TESTIMONIOS.retry}</button>
              <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{TESTIMONIOS.openVideo}</a>
            </div>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}
