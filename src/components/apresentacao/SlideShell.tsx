import { ReactNode } from "react";

/**
 * Casca visual de cada slide — replica o estilo Nilton Ramim:
 * onda azul superior + emblema UCM, onda inferior, faixa de rodapé.
 */
interface SlideShellProps {
  children: ReactNode;
  pageNumber?: number;
  totalPages?: number;
  showHeader?: boolean;
  footerText?: string;
}

export const SlideShell = ({
  children,
  pageNumber,
  totalPages,
  showHeader = true,
  footerText = "Sistemas de Informação para Apoio à Decisão e Gestão do Conhecimento",
}: SlideShellProps) => {
  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      {/* Onda superior */}
      {showHeader && (
        <div className="absolute top-0 left-0 right-0 h-[110px] pointer-events-none z-10">
          <svg
            viewBox="0 0 1280 110"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,0 L1280,0 L1280,40 Q900,110 640,70 Q380,30 0,90 Z"
              fill="#1e3a8a"
              opacity="0.95"
            />
            <path
              d="M0,0 L1280,0 L1280,30 Q900,95 640,55 Q380,15 0,75 Z"
              fill="#3b82f6"
              opacity="0.7"
            />
          </svg>
          {/* Emblema UCM */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 z-20">
            <UcmCrest />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="relative flex-1 z-0 px-12 pt-[110px] pb-[70px]">
        {children}
      </div>

      {/* Onda inferior + rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-[70px] pointer-events-none z-10">
        <svg
          viewBox="0 0 1280 70"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            d="M0,70 L1280,70 L1280,30 Q900,-10 640,25 Q380,55 0,15 Z"
            fill="#1e3a8a"
          />
          <path
            d="M0,70 L1280,70 L1280,40 Q900,5 640,35 Q380,60 0,25 Z"
            fill="#3b82f6"
            opacity="0.55"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-between px-10">
          <span className="text-[11px] text-white/95 font-medium truncate max-w-[80%]">
            {footerText}
          </span>
          {pageNumber && totalPages && (
            <span className="text-[12px] text-white font-bold tabular-nums">
              {pageNumber} / {totalPages}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/** Emblema UCM — SVG inline (réplica simplificada do escudo) */
const UcmCrest = () => (
  <div className="w-[68px] h-[68px] rounded-full bg-white border-2 border-[#1e3a8a] shadow-md flex flex-col items-center justify-center text-[#1e3a8a]">
    <span className="text-[8px] font-bold leading-none mt-1">UCM</span>
    <div className="w-7 h-7 rounded-full border-2 border-[#1e3a8a] my-0.5 flex items-center justify-center">
      <span className="text-[14px] font-serif font-bold leading-none">30</span>
    </div>
    <span className="text-[5.5px] font-semibold leading-none mb-1 tracking-wide">
      MOÇAMBIQUE
    </span>
  </div>
);
