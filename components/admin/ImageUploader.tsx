"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export interface ImageUploaderProps {
  label?: string;
  multiple?: boolean;
  max?: number;
  value?: string[];
  onChange?: (files: File[], previews: string[]) => void;
  previewShape?: "square" | "circle";
  enableAdjust?: boolean;
  adjustAspect?: number;
  adjustOutputWidth?: number;
  adjustOutputHeight?: number;
}

type AdjustSession = {
  index: number;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
};

function getFrameSize(previewShape: "square" | "circle", aspect?: number) {
  if (previewShape === "circle" || aspect === 1) {
    return { width: 280, height: 280 };
  }

  if (aspect && Math.abs(aspect - 16 / 9) < 0.05) {
    return { width: 360, height: 202 };
  }

  const width = 340;
  const height = aspect ? Math.round(width / aspect) : 220;
  return { width, height };
}

function getObjectCoverMetrics(
  naturalWidth: number,
  naturalHeight: number,
  frameWidth: number,
  frameHeight: number,
  zoom: number
) {
  const baseScale = Math.max(frameWidth / naturalWidth, frameHeight / naturalHeight);
  const scaledWidth = naturalWidth * baseScale * zoom;
  const scaledHeight = naturalHeight * baseScale * zoom;
  const maxOffsetX = Math.max(0, (scaledWidth - frameWidth) / 2);
  const maxOffsetY = Math.max(0, (scaledHeight - frameHeight) / 2);

  return { scaledWidth, scaledHeight, maxOffsetX, maxOffsetY };
}

export default function ImageUploader({
  label = "Imagens",
  multiple = true,
  max = 8,
  value = [],
  onChange,
  previewShape = "square",
  enableAdjust = false,
  adjustAspect,
  adjustOutputWidth = 1600,
  adjustOutputHeight = 900,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [adjusting, setAdjusting] = useState<AdjustSession | null>(null);
  const [adjustError, setAdjustError] = useState("");

  useEffect(() => {
    setPreviews(value);
  }, [value]);

  const frame = useMemo(() => getFrameSize(previewShape, adjustAspect), [previewShape, adjustAspect]);

  const onPick = () => inputRef.current?.click();

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const files = Array.from(filesList).slice(0, Math.max(1, max));
    const readers = files.map(
      (f) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(f);
        })
    );

    Promise.all(readers).then((urls) => {
      const combined = multiple ? [...urls, ...previews] : urls;
      const next = combined.slice(0, max);
      setPreviews(next);
      onChange?.(files, next);
    });
  };

  const removeAt = (idx: number) => {
    const next = previews.filter((_, i) => i !== idx);
    setPreviews(next);
    onChange?.([], next);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= previews.length) return;
    const next = previews.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPreviews(next);
    onChange?.([], next);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const openAdjuster = async (index: number) => {
    const src = previews[index];
    if (!src) return;

    setAdjustError("");

    const image = new window.Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      setAdjusting({
        index,
        src,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
      });
    };

    image.onerror = () => {
      setAdjustError("Não foi possível abrir a imagem para ajuste.");
    };

    image.src = src;
  };

  const closeAdjuster = () => {
    setAdjusting(null);
    setAdjustError("");
  };

  const saveAdjustedImage = async () => {
    if (!adjusting) return;

    const outputWidth =
      previewShape === "circle" || adjustAspect === 1 ? adjustOutputWidth || 800 : adjustOutputWidth || 1600;
    const outputHeight =
      previewShape === "circle" || adjustAspect === 1 ? adjustOutputHeight || 800 : adjustOutputHeight || 900;

    const previewMetrics = getObjectCoverMetrics(
      adjusting.naturalWidth,
      adjusting.naturalHeight,
      frame.width,
      frame.height,
      adjusting.zoom
    );

    const outMetrics = getObjectCoverMetrics(
      adjusting.naturalWidth,
      adjusting.naturalHeight,
      outputWidth,
      outputHeight,
      adjusting.zoom
    );

    const ratioX = previewMetrics.maxOffsetX > 0 ? adjusting.offsetX / previewMetrics.maxOffsetX : 0;
    const ratioY = previewMetrics.maxOffsetY > 0 ? adjusting.offsetY / previewMetrics.maxOffsetY : 0;
    const finalOffsetX = ratioX * outMetrics.maxOffsetX;
    const finalOffsetY = ratioY * outMetrics.maxOffsetY;

    const image = new window.Image();
    image.crossOrigin = "anonymous";

    const nextSrc = await new Promise<string>((resolve, reject) => {
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = outputWidth;
          canvas.height = outputHeight;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Não foi possível abrir o editor de imagem."));
            return;
          }

          const drawX = (outputWidth - outMetrics.scaledWidth) / 2 + finalOffsetX;
          const drawY = (outputHeight - outMetrics.scaledHeight) / 2 + finalOffsetY;

          ctx.clearRect(0, 0, outputWidth, outputHeight);
          ctx.drawImage(image, drawX, drawY, outMetrics.scaledWidth, outMetrics.scaledHeight);

          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = () => reject(new Error("Falha ao gerar a imagem ajustada."));
      image.src = adjusting.src;
    });

    const next = previews.slice();
    next[adjusting.index] = nextSrc;
    setPreviews(next);
    onChange?.([], next);
    closeAdjuster();
  };

  const adjustMetrics = adjusting
    ? getObjectCoverMetrics(
        adjusting.naturalWidth,
        adjusting.naturalHeight,
        frame.width,
        frame.height,
        adjusting.zoom
      )
    : null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <button type="button" onClick={onPick} className="text-sm font-medium text-[#ff5c00]">
          Adicionar
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previews.length === 0 ? (
        <div
          className={`mt-2 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-[#ff5c00] bg-orange-50 text-[#ff5c00]"
              : "border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={onPick}
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm font-medium">
              {isDragging ? "Solte as imagens aqui" : "Arraste imagens ou clique para selecionar"}
            </div>
            <div className="text-xs opacity-75">Suporta JPG, PNG • Máximo {max} imagens • Até 2MB cada</div>
          </div>
        </div>
      ) : (
        <div
          className={`relative mt-2 ${isDragging ? "rounded-lg border-2 border-dashed border-[#ff5c00] bg-orange-50 p-2" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-orange-100/80">
              <div className="text-sm font-medium text-[#ff5c00]">Solte para adicionar mais imagens</div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {previews.map((src, i) => (
              <div
                key={i}
                className={
                  previewShape === "circle"
                    ? "group relative mx-auto h-24 w-24 overflow-hidden rounded-full border"
                    : "group relative overflow-hidden rounded-md border"
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="preview"
                  className={previewShape === "circle" ? "h-24 w-24 object-cover" : "h-24 w-full object-cover"}
                />

                {enableAdjust ? (
                  <button
                    type="button"
                    onClick={() => openAdjuster(i)}
                    className="absolute left-1 top-1 z-10 rounded bg-black/65 px-2 py-1 text-[10px] font-semibold text-white transition hover:bg-black/80"
                    title="Ajustar imagem"
                  >
                    Ajustar
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
                  title="Remover imagem"
                >
                  ×
                </button>

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    className="rounded bg-black/40 px-2 py-1 text-xs text-white"
                  >
                    ◀︎
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    className="rounded bg-black/40 px-2 py-1 text-xs text-white"
                  >
                    ▶︎
                  </button>
                </div>
              </div>
            ))}
            {previews.length < max && (
              <div
                className={
                  previewShape === "circle"
                    ? "mx-auto flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 hover:bg-gray-50"
                    : "flex h-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 hover:bg-gray-50"
                }
                onClick={onPick}
              >
                <div className="text-center">
                  <svg className="mx-auto mb-1 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <div className="text-xs text-gray-500">Adicionar</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {adjusting ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ajustar imagem</h3>
                <p className="text-sm text-gray-500">
                  Ajuste o enquadramento antes de salvar. O corte aplicado será usado na banca.
                </p>
              </div>
              <button type="button" onClick={closeAdjuster} className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                Fechar
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="flex justify-center">
                <div
                  className={`relative overflow-hidden bg-gray-100 shadow-inner ${
                    previewShape === "circle" ? "rounded-full" : "rounded-xl"
                  }`}
                  style={{ width: `${frame.width}px`, height: `${frame.height}px` }}
                >
                  {adjustMetrics ? (
                    <img
                      src={adjusting.src}
                      alt="Ajuste"
                      className="absolute max-w-none select-none"
                      style={{
                        width: `${adjustMetrics.scaledWidth}px`,
                        height: `${adjustMetrics.scaledHeight}px`,
                        left: `calc(50% - ${adjustMetrics.scaledWidth / 2}px + ${adjusting.offsetX}px)`,
                        top: `calc(50% - ${adjustMetrics.scaledHeight / 2}px + ${adjusting.offsetY}px)`,
                      }}
                      draggable={false}
                    />
                  ) : null}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Zoom: {adjusting.zoom.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={adjusting.zoom}
                    onChange={(e) =>
                      setAdjusting((current) =>
                        current ? { ...current, zoom: Number(e.target.value), offsetX: 0, offsetY: 0 } : current
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Mover horizontalmente</label>
                  <input
                    type="range"
                    min={adjustMetrics ? -adjustMetrics.maxOffsetX : 0}
                    max={adjustMetrics ? adjustMetrics.maxOffsetX : 0}
                    step="1"
                    value={adjusting.offsetX}
                    disabled={!adjustMetrics || adjustMetrics.maxOffsetX <= 0}
                    onChange={(e) =>
                      setAdjusting((current) => (current ? { ...current, offsetX: Number(e.target.value) } : current))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Mover verticalmente</label>
                  <input
                    type="range"
                    min={adjustMetrics ? -adjustMetrics.maxOffsetY : 0}
                    max={adjustMetrics ? adjustMetrics.maxOffsetY : 0}
                    step="1"
                    value={adjusting.offsetY}
                    disabled={!adjustMetrics || adjustMetrics.maxOffsetY <= 0}
                    onChange={(e) =>
                      setAdjusting((current) => (current ? { ...current, offsetY: Number(e.target.value) } : current))
                    }
                    className="w-full"
                  />
                </div>

                {adjustError ? <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{adjustError}</div> : null}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeAdjuster}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={saveAdjustedImage}
                    className="flex-1 rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55400]"
                  >
                    Salvar ajuste
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
