"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { TESTIMONIOS } from "../content";
import { IconPause, IconPlay } from "./icons";
import { TestimonialVideoDialog } from "./TestimonialVideoDialog";

export type VideoTestimonial = {
  id: number;
  title: string;
  videoUrl: string;
  playbackUrl: string;
  poster: StaticImageData;
};

const COPIES = 3;
const SPEED = 28; // Píxeles por segundo: avance continuo y discreto.
const OFFSET = ["lg:mt-10", "lg:mt-14", "lg:mt-0"] as const;

/** Tres copias permiten volver al centro sin un salto visible. Solo la copia
 * central participa del recorrido de teclado y del árbol de accesibilidad.
 * La rueda y el gesto táctil siguen usando el scroll horizontal nativo.
 */
export function TestimonialsCarousel({ items }: { items: readonly VideoTestimonial[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const positionRef = useRef(0);
  const autoRunningRef = useRef(false);
  const activeRef = useRef(0);
  const interactionTimer = useRef<number | undefined>(undefined);
  const pointerHeldRef = useRef(false);
  const keyboardInputRef = useRef(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [focused, setFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [touching, setTouching] = useState(false);
  const [selected, setSelected] = useState<VideoTestimonial | null>(null);
  const total = items.length;
  const loop = Array.from({ length: COPIES }, () => items).flat();

  const pauseForInteraction = useCallback(() => {
    window.clearTimeout(interactionTimer.current);
    setInteracting(true);
    interactionTimer.current = window.setTimeout(() => setInteracting(false), 900);
  }, []);

  const centerOn = useCallback((index: number, smooth: boolean) => {
    const list = listRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: smooth && !reduce ? "smooth" : "instant" });
    if (!smooth || reduce) positionRef.current = left;
  }, []);

  const centered = useCallback(() => {
    const list = listRef.current;
    if (!list) return total;
    const middle = list.scrollLeft + list.clientWidth / 2;
    let best = 0;
    let distance = Infinity;
    Array.from(list.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const next = Math.abs(el.offsetLeft + el.offsetWidth / 2 - middle);
      if (next < distance) {
        distance = next;
        best = index;
      }
    });
    return best;
  }, [total]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || total === 0) return;
    const desktop = window.matchMedia("(min-width: 64rem)").matches;
    centerOn(total + (desktop && total > 1 ? 1 : 0), false);

    let settleTimer: number | undefined;
    const normalize = () => {
      const first = list.children[0] as HTMLElement;
      const middle = list.children[total] as HTMLElement;
      const group = middle.offsetLeft - first.offsetLeft;
      if (group <= 0) return;
      const start = middle.offsetLeft - (list.clientWidth - middle.offsetWidth) / 2;
      const left = list.scrollLeft;
      if (left < start || left >= start + group) {
        list.scrollLeft = start + (((left - start) % group) + group) % group;
        positionRef.current = list.scrollLeft;
      }
    };
    const onScroll = () => {
      if (!autoRunningRef.current) positionRef.current = list.scrollLeft;
      const index = centered() % total;
      if (activeRef.current !== index) {
        activeRef.current = index;
        setActive(index);
      }
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(normalize, 160);
    };
    const onResize = () => centerOn(total + centered() % total, false);
    list.addEventListener("scroll", onScroll, { passive: true });
    const resize = new ResizeObserver(onResize);
    resize.observe(list);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" || list.contains(document.activeElement)) {
        keyboardInputRef.current = true;
        if (list.contains(document.activeElement)) setFocused(true);
      }
    };
    const onPointerDown = () => {
      keyboardInputRef.current = false;
      setFocused(false);
    };
    const releasePointer = () => {
      if (!pointerHeldRef.current) return;
      pointerHeldRef.current = false;
      pauseForInteraction();
    };
    const onWindowBlur = () => {
      releasePointer();
      setTouching(false);
    };
    updateMotion();
    updateVisibility();
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointerup", releasePointer);
    window.addEventListener("pointercancel", releasePointer);
    window.addEventListener("blur", onWindowBlur);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(list);
    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(interactionTimer.current);
      list.removeEventListener("scroll", onScroll);
      resize.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointerup", releasePointer);
      window.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("blur", onWindowBlur);
      observer.disconnect();
    };
  }, [total, centerOn, centered, pauseForInteraction]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || total === 0 || !playing || reducedMotion || !visible || !pageVisible || focused || interacting || touching || selected) return;
    let frame: number;
    let previous: number | undefined;
    positionRef.current = list.scrollLeft;
    autoRunningRef.current = true;
    const advance = (time: number) => {
      const first = list.children[0] as HTMLElement;
      const middle = list.children[total] as HTMLElement;
      const group = middle.offsetLeft - first.offsetLeft;
      const start = middle.offsetLeft - (list.clientWidth - middle.offsetWidth) / 2;
      if (previous !== undefined && group > 0) {
        positionRef.current += Math.min(time - previous, 50) * SPEED / 1000;
        if (positionRef.current >= start + group) positionRef.current -= group;
        list.scrollLeft = positionRef.current;
      }
      previous = time;
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => {
      cancelAnimationFrame(frame);
      autoRunningRef.current = false;
    };
  }, [total, playing, reducedMotion, visible, pageVisible, focused, interacting, touching, selected]);

  function goTo(target: number) {
    pauseForInteraction();
    const current = centered();
    const base = current - (current % total);
    let index = base + target;
    if (index - current > total / 2) index -= total;
    if (current - index > total / 2) index += total;
    centerOn(index, true);
  }

  function openVideo(index: number) {
    const original = total + index % total;
    centerOn(original, false);
    // El foco vuelve a la portada accesible, incluso si se pulsó una copia.
    (listRef.current?.children[original].querySelector("button") as HTMLButtonElement | null)?.focus({ preventScroll: true });
    setSelected(items[index % total]);
  }

  return (
    <div>
      <ul
        ref={listRef}
        aria-label={TESTIMONIOS.listLabel}
        data-lenis-prevent-horizontal=""
        onPointerDown={() => { pointerHeldRef.current = true; window.clearTimeout(interactionTimer.current); setInteracting(true); }}
        onTouchStart={() => setTouching(true)}
        onTouchEnd={() => { setTouching(false); pauseForInteraction(); }}
        onTouchCancel={() => { setTouching(false); pauseForInteraction(); }}
        onWheel={pauseForInteraction}
        onFocusCapture={() => setFocused(keyboardInputRef.current)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        className="relative -mx-gutter flex gap-4 overflow-x-auto overscroll-x-contain px-gutter pb-10 pt-1 [scrollbar-width:none] sm:-mx-gutter-lg sm:px-gutter-lg lg:-mx-5 lg:items-start lg:gap-5 lg:px-5 lg:[mask-image:linear-gradient(90deg,transparent,black_1.25rem,black_calc(100%-1.25rem),transparent)]"
      >
        {loop.map((item, index) => {
          const copy = index < total || index >= total * 2;
          return (
            <li key={`${index}-${item.id}`} aria-hidden={copy || undefined} className={cn("w-[85%] shrink-0 sm:w-[58%] lg:w-[calc((100%-2.5rem)/3)]", OFFSET[index % OFFSET.length])}>
              <button
                type="button"
                tabIndex={copy ? -1 : 0}
                aria-label={`${TESTIMONIOS.play} ${item.id}`}
                aria-haspopup="dialog"
                onClick={() => openVideo(index)}
                className="tono-oscuro group block w-full overflow-hidden rounded-lg border border-malva/30 bg-noche text-left text-crema shadow-[0_24px_40px_-24px_rgb(30_20_18/0.7)]"
              >
                <span className="relative block aspect-video overflow-hidden">
                  <Image src={item.poster} alt="" fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 58vw, 85vw" className="object-cover" draggable={false} />
                  <span aria-hidden="true" className="absolute inset-0 bg-burgundy/10 transition-colors group-hover:bg-transparent" />
                  <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-crema/50 bg-burgundy/95 text-crema shadow-lg transition-transform group-hover:scale-110">
                    <IconPlay className="ml-0.5 size-6" />
                  </span>
                </span>
                <span className="block px-4 py-3.5 text-right text-sm text-rosa">{TESTIMONIOS.watch}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        <div className="flex justify-center">
          {items.map((item, index) => (
            <button key={item.id} type="button" onClick={() => goTo(index)} aria-label={`${TESTIMONIOS.goTo} ${item.id}`} aria-current={index === active ? "true" : undefined} className="grid size-7 place-items-center">
              <span className={cn("size-2.5 rounded-full bg-burgundy transition-opacity", index === active ? "opacity-100" : "opacity-30")} />
            </button>
          ))}
        </div>
        {!reducedMotion ? (
          <button type="button" onClick={() => setPlaying(!playing)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-malva/50 px-3.5 py-2 text-sm text-burgundy">
            {playing ? <IconPause className="size-4" /> : <IconPlay className="size-4" />}
            {playing ? TESTIMONIOS.pause : TESTIMONIOS.resume}
          </button>
        ) : null}
      </div>

      <TestimonialVideoDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
