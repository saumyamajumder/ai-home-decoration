"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Data — add or remove entries here, the UI follows                          */
/* -------------------------------------------------------------------------- */

type Option = { id: string; label: string; image: string };

export const DESIGN_STYLES: Option[] = [
  {
    id: "japandi",
    label: "Japandi",
    image: "/images/room-redesign/styles/japandi.jpg",
  },
  {
    id: "modern-farmhouse",
    label: "Modern Farmhouse",
    image: "/images/room-redesign/styles/modern-farmhouse.jpg",
  },
  {
    id: "mid-century-modern",
    label: "Mid-Century Modern",
    image: "/images/room-redesign/styles/mid-century-modern.jpg",
  },
  {
    id: "bohemian",
    label: "Bohemian",
    image: "/images/room-redesign/styles/bohemian.jpg",
  },
];

export const ROOM_TYPES: Option[] = [
  {
    id: "living-room",
    label: "Living Room",
    image: "/images/room-redesign/rooms/living-room.jpg",
  },
  {
    id: "dining-room",
    label: "Dining Room",
    image: "/images/room-redesign/rooms/dining-room.jpg",
  },
  {
    id: "bedroom",
    label: "Bedroom",
    image: "/images/room-redesign/rooms/bedroom.jpg",
  },
  {
    id: "bathroom",
    label: "Bathroom",
    image: "/images/room-redesign/rooms/bathroom.jpg",
  },
];

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type RoomRedesignPayload = {
  file: File;
  styleId: string;
  roomTypeId: string;
};

type RoomRedesignProps = {
  /** Called when the user presses "Generate design". Pass it from a client component. */
  onGenerate?: (payload: RoomRedesignPayload) => void | Promise<void>;
  /** Max upload size in MB. */
  maxSizeMB?: number;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function RoomRedesign({
  onGenerate,
  maxSizeMB = 10,
  className,
}: RoomRedesignProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [styleId, setStyleId] = React.useState("");
  const [roomTypeId, setRoomTypeId] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const inputId = React.useId();

  // Release the blob URL when it is replaced or the component unmounts.
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const acceptFile = React.useCallback(
    (next?: File) => {
      if (!next) return;
      if (!ACCEPTED_TYPES.includes(next.type)) {
        setError("Upload a JPG, PNG or WebP image.");
        return;
      }
      if (next.size > maxSizeMB * 1024 * 1024) {
        setError(`Image must be smaller than ${maxSizeMB} MB.`);
        return;
      }
      setError(null);
      setFile(next);
      setPreviewUrl(URL.createObjectURL(next));
    },
    [maxSizeMB],
  );

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const canGenerate = Boolean(file && styleId && roomTypeId) && !isGenerating;

  const handleGenerate = async () => {
    if (!file || !styleId || !roomTypeId) return;
    try {
      setIsGenerating(true);
      await onGenerate?.({ file, styleId, roomTypeId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section
      aria-label="AI room redesign"
      className={cn(
        "relative mx-auto w-full  rounded-[28px] border border-[color:var(--rr-card-border)] bg-[var(--rr-bg)] p-6 text-[var(--rr-text)] sm:p-10",
        className,
      )}
    >
    
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,470px)_minmax(0,1fr)] lg:gap-14">
          {/* ------------------------------ Left column ------------------------------ */}
          <div>
            <h2 className="text-lg font-semibold">
              Upload an image of your room
            </h2>

            <div className="relative mt-4">
              <label
                htmlFor={inputId}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "relative flex h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[color:var(--rr-border)] bg-[var(--rr-surface)] text-[15px] transition-colors",
                  "focus-within:ring-2 focus-within:ring-[color:var(--rr-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--rr-bg)]",
                  isDragging && "border-[color:var(--rr-accent)]",
                )}
              >
                <input
                  id={inputId}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  className="sr-only"
                  onChange={(event) => {
                    acceptFile(event.target.files?.[0]);
                    event.target.value = ""; // lets the same file be picked again
                  }}
                />

                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Your uploaded room"
                    fill
                    unoptimized
                    sizes="470px"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <UploadStackIcon className="size-12" />
                    <span className="mt-4">
                      Drag or drop or browse to upload
                    </span>
                  </>
                )}
              </label>

              {previewUrl && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label="Remove image"
                  onClick={clearFile}
                  className="absolute right-3 top-3 size-8 rounded-full"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>

            {error && (
              <p role="alert" className="mt-2 text-sm text-[var(--rr-error)]">
                {error}
              </p>
            )}

            <OptionPicker
              title="Choose design style"
              options={DESIGN_STYLES}
              value={styleId}
              onValueChange={setStyleId}
            />

            <OptionPicker
              title="Choose room type"
              options={ROOM_TYPES}
              value={roomTypeId}
              onValueChange={setRoomTypeId}
            />

            <Button
              type="button"
              disabled={!canGenerate}
              onClick={handleGenerate}
              aria-busy={isGenerating}
              className="mt-8 h-11 w-full rounded-xl bg-[var(--rr-accent-strong)] text-base font-semibold text-white hover:bg-[var(--rr-accent-strong)] hover:brightness-95 disabled:opacity-40"
            >
              {isGenerating && <Loader2 className="size-4 animate-spin" />}
              {isGenerating ? "Generating…" : "Generate design"}
            </Button>
          </div>

          {/* ------------------------------ Right column ----------------------------- */}
          <div className="lg:pt-[28px]">
            <BeforeAfter />
            <p className="mt-9 text-center text-sm font-semibold">
              Go create with AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Thumbnail picker (shadcn RadioGroup → keyboard + screen reader friendly)   */
/* -------------------------------------------------------------------------- */

function OptionPicker({
  title,
  options,
  value,
  onValueChange,
}: {
  title: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const headingId = React.useId();

  return (
    <section className="mt-8" aria-labelledby={headingId}>
      <h3 id={headingId} className="text-lg font-semibold">
        {title}
      </h3>

      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        aria-labelledby={headingId}
        className="-m-1.5 mt-2.5 flex gap-3 overflow-x-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {options.map((option) => {
          const checked = value === option.id;
          return (
            <Label
              key={option.id}
              className="group flex w-[115px] shrink-0 cursor-pointer flex-col items-stretch gap-2 text-[13px] font-normal leading-tight text-[var(--rr-muted)]"
            >
              <RadioGroupItem value={option.id} className="sr-only" />
              <span
                className={cn(
                  "relative block h-[72px] overflow-hidden rounded-lg ring-offset-2 ring-offset-[var(--rr-bg)] transition-shadow",
                  checked
                    ? "ring-2 ring-[color:var(--rr-accent)]"
                    : "group-focus-within:ring-2 group-focus-within:ring-[color:var(--rr-accent)]",
                )}
              >
                <Image
                  src={option.image}
                  alt=""
                  fill
                  sizes="115px"
                  className="object-cover"
                />
              </span>
              <span
                className={cn(checked && "font-medium text-[var(--rr-text)]")}
              >
                {option.label}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Before / After collage (fluid — everything is positioned in %)             */
/* -------------------------------------------------------------------------- */

function BeforeAfter() {
  return (
    <div className="relative mx-auto aspect-[435/330] w-full max-w-[435px]">
      {/* decorative shapes behind the photos */}
      <div
        aria-hidden
        className="absolute left-[11.5%] top-[60.6%] h-[34%] w-[34.5%] rounded-bl-3xl"
        style={{
          background:
            "linear-gradient(100deg, var(--rr-blue-a) 0%, var(--rr-blue-b) 42%, var(--rr-lavender) 72%, var(--rr-mist) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute left-[40.9%] top-[9%] h-[36%] w-[5.5%] rounded-sm bg-[var(--rr-accent-alt)]"
      />
      <div
        aria-hidden
        className="absolute left-[40.9%] top-[44%] h-[34%] w-[5.5%] bg-[var(--rr-black)]"
      />

      {/* Before */}
      <figure className="absolute left-0 top-0 h-[73%] w-[41.4%] overflow-hidden rounded-2xl shadow-lg">
        <Image
          src="/images/room-redesign/before.jpg"
          alt="Kitchen before the redesign: white cabinets and light walls"
          fill
          sizes="(min-width: 1024px) 180px, 40vw"
          className="object-cover"
        />
        <figcaption className="absolute left-0 top-0 rounded-br-2xl bg-[var(--rr-badge-bg)] px-3.5 py-1.5 text-sm font-bold italic text-white ring-1 ring-[color:var(--rr-ring-soft)]">
          Before
        </figcaption>
      </figure>

      {/* After */}
      <figure className="absolute left-[45.3%] top-[8.8%] h-[89.7%] w-[53.6%] overflow-hidden rounded-2xl shadow-lg">
        <Image
          src="/images/room-redesign/after.jpg"
          alt="The same kitchen after the redesign: dark green tile and warm wood"
          fill
          sizes="(min-width: 1024px) 233px, 52vw"
          className="object-cover"
        />
        <figcaption className="absolute bottom-0 right-0 rounded-tl-2xl bg-[var(--rr-accent)] px-3.5 py-1.5 text-sm font-bold italic text-white">
          After
        </figcaption>
      </figure>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Icon — stacked layers with an up arrow (matches the reference)             */
/* -------------------------------------------------------------------------- */

function UploadStackIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 34.5 24 41.5 40 34.5" />
      <path d="M8 29 24 36 40 29" />
      <path d="M24 22 40 29 24 36 8 29Z" fill="var(--rr-surface)" />
      <path d="M24 20V6" />
      <path d="M18 11.5 24 6l6 5.5" />
    </svg>
  );
}
