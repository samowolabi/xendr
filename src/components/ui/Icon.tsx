import React from 'react';
import { cn } from '@/lib/cn';

export type IconName =
  | 'copy'
  | 'check'
  | 'download'
  | 'send'
  | 'share'
  | 'code'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-down'
  | 'trash'
  | 'plus'
  | 'moon'
  | 'sun'
  | 'palette'
  | 'magic'
  | 'restart'
  | 'close'
  | 'eye'
  | 'eye-closed';

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** Size in px (sets width & height). Defaults to 1em so width/height utilities work too. */
  size?: number | string;
}

/*
 * Inline SVG registry — Solar icon set (CC BY 4.0, 480 Design). Every glyph uses
 * a 24×24 viewBox and `currentColor`, and keeps its own fill/stroke so bold and
 * linear weights render faithfully. The wrapper only controls size and color.
 */
const registry: Record<IconName, React.ReactNode> = {
  copy: (
    <>
      <path
        fill="currentColor"
        d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2"
      />
      <path
        fill="currentColor"
        d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z"
      />
    </>
  ),
  check: (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m4 12.9l3.143 3.6L15 7.5m5 .063l-8.572 9L11 16"
    />
  ),
  download: (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3 15c0 2.828 0 4.243.879 5.121C4.757 21 6.172 21 9 21h6c2.828 0 4.243 0 5.121-.879C21 19.243 21 17.828 21 15M12 3v13m0 0l4-4.375M12 16l-4-4.375"
    />
  ),
  send: (
    <g fill="none">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="m18.636 15.67l1.716-5.15c1.5-4.498 2.25-6.747 1.062-7.934s-3.436-.438-7.935 1.062L8.33 5.364C4.7 6.574 2.885 7.18 2.37 8.067a2.72 2.72 0 0 0 0 2.73c.515.888 2.33 1.493 5.96 2.704c.584.194.875.291 1.119.454c.236.158.439.361.597.597c.163.244.26.535.454 1.118c1.21 3.63 1.816 5.446 2.703 5.962a2.72 2.72 0 0 0 2.731 0c.887-.516 1.492-2.331 2.703-5.962Z"
      />
      <path
        fill="currentColor"
        d="M16.212 8.848a.75.75 0 0 0-1.055-1.066zm-5.55 5.488l5.55-5.488l-1.055-1.066l-5.55 5.488z"
      />
    </g>
  ),
  share: (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
      <path
        strokeLinejoin="round"
        d="M22 7h-8c-1.818 0-2.913.892-3.32 1.3q-.187.19-.19.19q0 .003-.19.19C9.892 9.087 9 10.182 9 12v3m13-8l-5-5m5 5l-5 5"
      />
      <path d="M3.465 20.535C4.93 22 7.287 22 12.003 22c4.715 0 7.073 0 8.537-1.465c1.242-1.241 1.431-3.123 1.46-6.537M3.465 20.535C2 19.07 2 16.713 2 11.997m1.465 8.538C4.929 22 7.286 22 12 22s7.071 0 8.535-1.465c1.241-1.24 1.43-3.122 1.46-6.536m-18.53 6.536C2 19.071 2 16.714 2 12m1.465-8.54C4.706 2.218 6.588 2.029 10.002 2M2.055 8c.11-2.193.436-3.562 1.41-4.536c1.24-1.24 3.122-1.43 6.535-1.459" />
    </g>
  ),
  code: (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
      d="m17 7.83l1.697 1.526c1.542 1.389 2.313 2.083 2.313 2.974c0 .89-.771 1.585-2.314 2.973L17 16.83M13.987 5L12 12.415l-1.987 7.415M7 7.83L5.304 9.356C3.76 10.745 2.99 11.44 2.99 12.33s.771 1.585 2.314 2.973L7 16.83"
    />
  ),
  'arrow-left': (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M20 12H4m0 0l6-6m-6 6l6 6"
    />
  ),
  'arrow-right': (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4 12h16m0 0l-6-6m6 6l-6 6"
    />
  ),
  'chevron-down': (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m19 9l-7 6l-7-6"
    />
  ),
  trash: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.5 11l.5 5m4.5-5l-.5 5"
      />
      <path d="M6.5 6h.11a2 2 0 0 0 1.83-1.32l.034-.103l.097-.291c.083-.249.125-.373.18-.479a1.5 1.5 0 0 1 1.094-.788C9.962 3 10.093 3 10.355 3h3.29c.262 0 .393 0 .51.019a1.5 1.5 0 0 1 1.094.788c.055.106.097.23.18.479l.097.291A2 2 0 0 0 17.5 6" />
    </g>
  ),
  plus: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M15 12h-3m0 0H9m3 0V9m0 3v3" />
    </g>
  ),
  moon: (
    <path
      fill="currentColor"
      d="M12 22c5.523 0 10-4.477 10-10c0-.463-.694-.54-.933-.143a6.5 6.5 0 1 1-8.924-8.924C12.54 2.693 12.463 2 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10"
    />
  ),
  sun: (
    <>
      <path fill="currentColor" d="M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 1.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M3.669 3.716a.75.75 0 0 1 1.06-.047L6.95 5.7a.75.75 0 1 1-1.012 1.107L3.716 4.776a.75.75 0 0 1-.047-1.06m16.662 0a.75.75 0 0 1-.047 1.06l-2.222 2.031A.75.75 0 0 1 17.05 5.7l2.222-2.031a.75.75 0 0 1 1.06.047M1.25 12a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m18 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75m-2.224 5.025a.75.75 0 0 1 1.06 0l2.222 2.223a.75.75 0 0 1-1.06 1.06l-2.222-2.222a.75.75 0 0 1 0-1.06m-10.051 0a.75.75 0 0 1 0 1.061l-2.223 2.222a.75.75 0 0 1-1.06-1.06l2.222-2.223a.75.75 0 0 1 1.06 0M12 19.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75"
        clipRule="evenodd"
      />
    </>
  ),
  palette: (
    <>
      <mask id="solar-palette-a" fill="#fff">
        <path d="M11.085 7a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
      </mask>
      <mask id="solar-palette-b" fill="#fff">
        <path d="M16 7a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
      </mask>
      <g fill="none" stroke="currentColor">
        <path
          strokeWidth="1.5"
          d="M2 12.026c0 5.146 3.867 9.387 8.847 9.96c.735.085 1.447-.228 1.97-.753a1.68 1.68 0 0 0 0-2.372c-.523-.525-.95-1.307-.555-1.934c1.576-2.508 9.738 3.251 9.738-4.9C22 6.488 17.523 2 12 2S2 6.489 2 12.026Z"
        />
        <circle cx="17.5" cy="11.5" r=".75" strokeWidth="1.5" />
        <circle cx="6.5" cy="11.5" r=".75" strokeWidth="1.5" />
        <path strokeWidth="3" d="M11.085 7a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z" mask="url(#solar-palette-a)" />
        <path strokeWidth="3" d="M16 7a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z" mask="url(#solar-palette-b)" />
      </g>
    </>
  ),
  magic: (
    <path
      fill="currentColor"
      d="M3.845 3.845a2.883 2.883 0 0 0 0 4.077L5.432 9.51l.038-.04l4-4l.04-.038l-1.588-1.587a2.883 2.883 0 0 0-4.077 0m6.723 2.645l-.038.04l-4 4l-.04.038l9.588 9.588a2.884 2.884 0 0 0 4.078-4.078zM16.1 2.307a.483.483 0 0 1 .9 0l.43 1.095a.48.48 0 0 0 .272.274l1.091.432a.486.486 0 0 1 0 .903l-1.09.432a.5.5 0 0 0-.273.273L17 6.81a.483.483 0 0 1-.9 0l-.43-1.095a.5.5 0 0 0-.273-.273l-1.09-.432a.486.486 0 0 1 0-.903l1.09-.432a.5.5 0 0 0 .273-.274zm3.867 6.823a.483.483 0 0 1 .9 0l.156.399c.05.125.148.224.273.273l.398.158a.486.486 0 0 1 0 .902l-.398.158a.5.5 0 0 0-.273.273l-.156.4a.483.483 0 0 1-.9 0l-.157-.4a.5.5 0 0 0-.272-.273l-.398-.158a.486.486 0 0 1 0-.902l.398-.158a.5.5 0 0 0 .272-.273zM5.133 15.307a.483.483 0 0 1 .9 0l.157.4a.48.48 0 0 0 .272.273l.398.157a.486.486 0 0 1 0 .903l-.398.158a.48.48 0 0 0-.272.273l-.157.4a.483.483 0 0 1-.9 0l-.157-.4a.48.48 0 0 0-.272-.273l-.398-.158a.486.486 0 0 1 0-.903l.398-.157a.48.48 0 0 0 .272-.274z"
    />
  ),
  restart: (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m18.364 8.05l-.707-.707a8 8 0 1 0 2.28 4.658m-1.573-3.95h-4.243m4.243 0V3.807"
    />
  ),
  close: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="m14.5 9.5l-5 5m0-5l5 5" />
    </g>
  ),
  eye: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3.275 15.296C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296C4.972 6.5 7.818 4 12 4s7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704Z" />
      <path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z" />
    </g>
  ),
  'eye-closed': (
    <path
      fill="currentColor"
      d="M2.69 6.705a.75.75 0 0 0-1.38.59zm12.897 6.624l-.274-.698zm-6.546.409a.75.75 0 1 0-1.257-.818zm-2.67 1.353a.75.75 0 1 0 1.258.818zM22.69 7.295a.75.75 0 0 0-1.378-.59zM19 11.13l-.513-.547zm.97 2.03a.75.75 0 1 0 1.06-1.06zm-8.72 3.34a.75.75 0 0 0 1.5 0zm5.121-.591a.75.75 0 1 0 1.258-.818zm-10.84-4.25A.75.75 0 0 0 4.47 10.6zm-2.561.44a.75.75 0 0 0 1.06 1.06zM12 13.25c-3.224 0-5.539-1.605-7.075-3.26a13.6 13.6 0 0 1-1.702-2.28a12 12 0 0 1-.507-.946l-.022-.049l-.004-.01l-.001-.001L2 7l-.69.296h.001l.001.003l.003.006l.04.088q.039.088.117.243c.103.206.256.496.462.841c.41.69 1.035 1.61 1.891 2.533C5.54 12.855 8.224 14.75 12 14.75zm3.313-.62c-.97.383-2.071.62-3.313.62v1.5c1.438 0 2.725-.276 3.862-.723zm-7.529.29l-1.413 2.17l1.258.818l1.412-2.171zM22 7l-.69-.296h.001v.002l-.007.013l-.028.062a12 12 0 0 1-.64 1.162a13.3 13.3 0 0 1-2.15 2.639l1.027 1.094a14.8 14.8 0 0 0 3.122-4.26l.039-.085l.01-.024l.004-.007v-.003h.001v-.001zm-3.513 3.582c-.86.806-1.913 1.552-3.174 2.049l.549 1.396c1.473-.58 2.685-1.444 3.651-2.351zm-.017 1.077l1.5 1.5l1.06-1.06l-1.5-1.5zM11.25 14v2.5h1.5V14zm3.709-.262l1.412 2.171l1.258-.818l-1.413-2.171zm-10.49-3.14l-1.5 1.5L4.03 13.16l1.5-1.5z"
    />
  ),
};

/**
 * Themed icon. Inherits color from `currentColor` (use text utilities) and sizes
 * to the surrounding font size by default. Decorative by default (`aria-hidden`);
 * pass an `aria-label` to make it meaningful to screen readers.
 */
export const Icon: React.FC<IconProps> = ({ name, size, className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size ?? '1em'}
    height={size ?? '1em'}
    className={cn('inline-block shrink-0', className)}
    aria-hidden={props['aria-label'] ? undefined : true}
    {...props}
  >
    {registry[name]}
  </svg>
);
