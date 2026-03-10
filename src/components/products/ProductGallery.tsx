"use client";

import { useState } from "react";

interface Props {
  images: string[];
  name: string;
  stonePlaceholder: string;
}

export default function ProductGallery({ images, name, stonePlaceholder }: Props) {
  const [selected, setSelected] = useState(0);

  const hasImages = images.length > 0 && images[0] !== "/images/placeholder.jpg";

  if (!hasImages) {
    return (
      <div className="aspect-square bg-gradient-to-br from-larimar/10 to-ocean/10 rounded-sm flex items-center justify-center">
        <span className="font-heading text-gold/20 text-xl tracking-widest uppercase">
          {stonePlaceholder}
        </span>
      </div>
    );
  }

  const canPrev = selected > 0;
  const canNext = selected < images.length - 1;

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square bg-cream-dark rounded-sm overflow-hidden mb-4 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selected]}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Left/Right Arrows */}
        {images.length > 1 && (
          <>
            {canPrev && (
              <button
                onClick={() => setSelected(selected - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 text-ocean" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            {canNext && (
              <button
                onClick={() => setSelected(selected + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 text-ocean" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === selected ? "bg-gold" : "bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`aspect-square rounded-sm overflow-hidden border-2 transition-colors ${
                i === selected ? "border-gold" : "border-transparent hover:border-gold/30"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
