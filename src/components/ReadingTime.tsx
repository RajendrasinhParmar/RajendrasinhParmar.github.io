export interface Props {
  minutes: number;
  size?: "sm" | "lg";
  className?: string;
}

export default function ReadingTime({
  minutes,
  size = "sm",
  className,
}: Props) {
  const readingTimeText = minutes === 1 ? "1 min read" : `${minutes} min read`;

  return (
    <div className={`flex items-center space-x-2 opacity-80 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 fill-skin-base`}
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
      </svg>
      <span className="sr-only">Reading time:</span>
      <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
        {readingTimeText}
      </span>
    </div>
  );
}
