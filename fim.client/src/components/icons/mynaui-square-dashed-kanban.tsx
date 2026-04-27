import * as React from "react";

export function SquareDashedKanbanIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M7 16h7m-3-4h7M8 8h7M9.4 21h5.2m-9.416-.436a4 4 0 0 1-1.748-1.748M3 14.6V9.4m18 5.2V9.4m-.436 9.416a4 4 0 0 1-1.748 1.748M14.6 3H9.4m9.416.436a4 4 0 0 1 1.748 1.748M5.184 3.436a4 4 0 0 0-1.748 1.748"/>
    </svg>
  );
}
