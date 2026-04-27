import * as React from "react";

export function FatArrowUpSolidIcon({
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
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M11.138 2.608a1.216 1.216 0 0 1 1.724 0l7.502 6.87l.037.036c.708.744.277 2.131-.884 2.131h-3.569v8.85c0 .659-.518 1.255-1.232 1.255H9.284c-.714 0-1.232-.596-1.232-1.256v-8.849H4.483c-1.161 0-1.592-1.387-.884-2.13l.037-.036z"/>
    </svg>
  );
}
