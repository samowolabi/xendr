import React from 'react';

interface PoweredBySignatureProps {
  mode: 'dark' | 'light';
}

const LOGO_SRC_BY_MODE: Record<PoweredBySignatureProps['mode'], string> = {
  dark: 'https://www.xendr.dev/logo/svg/xendr-white-dark-bg.svg',
  light: 'https://www.xendr.dev/logo/svg/xendr-black-light-bg.svg',
};

export const PoweredBySignature: React.FC<PoweredBySignatureProps> = ({ mode }) => {
  const logoSrc = LOGO_SRC_BY_MODE[mode];

  return (
    <div className="mt-2 flex justify-end">
      <a
        href="https://www.xendr.dev"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted/60 transition-colors hover:text-muted"
      >
        <span>Powered by</span>
        <img
          src={logoSrc}
          alt="Xendr"
          className="h-[9px] w-auto opacity-70 transition-opacity hover:opacity-85"
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  );
};
