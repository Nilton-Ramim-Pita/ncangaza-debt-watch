import { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  LayoutGrid,
  X,
} from "lucide-react";
import { SlideShell } from "@/components/apresentacao/SlideShell";
import {
  SLIDES_META,
  SLIDE_COMPONENTS,
} from "@/components/apresentacao/slides";

const TOTAL = SLIDE_COMPONENTS.length;
const SLIDE_W = 1280;
const SLIDE_H = 720;

const ApresentacaoEmilia = () => {
  const [idx, setIdx] = useState(0);
  const [showIndex, setShowIndex] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ------------ navegação ------------ */
  const next = useCallback(
    () => setIdx((i) => Math.min(i + 1, TOTAL - 1)),
    [],
  );
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown")
        next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
      else if (e.key === "Home") setIdx(0);
      else if (e.key === "End") setIdx(TOTAL - 1);
      else if (e.key === "g" || e.key === "G") setShowIndex((s) => !s);
      else if (e.key === "Escape") {
        setShowIndex(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* ------------ fullscreen ------------ */
  const toggleFs = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };
  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ------------ scaling responsivo ------------ */
  useEffect(() => {
    const recompute = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const sx = el.clientWidth / SLIDE_W;
      const sy = el.clientHeight / SLIDE_H;
      setScale(Math.min(sx, sy));
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [isFs]);

  const Current = SLIDE_COMPONENTS[idx];

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold">
            UCM
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-800 truncate">
              SI para Apoio à Decisão e Gestão do Conhecimento
            </p>
            <p className="text-[10.5px] text-slate-500 truncate">
              Defesa académica · Grupo Emília Júlio · UCM Tete
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ToolbarBtn
            onClick={() => setShowIndex(true)}
            icon={LayoutGrid}
            label="Índice"
          />
          <ToolbarBtn
            onClick={toggleFs}
            icon={isFs ? Minimize : Maximize}
            label={isFs ? "Sair" : "Ecrã inteiro"}
          />
        </div>
      </header>

      {/* Canvas */}
      <main
        ref={wrapperRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center p-4"
      >
        <div
          className="bg-white shadow-2xl ring-1 ring-slate-200 origin-center"
          style={{
            width: SLIDE_W,
            height: SLIDE_H,
            transform: `scale(${scale})`,
          }}
        >
          <SlideShell
            pageNumber={idx + 1}
            totalPages={TOTAL}
            showHeader={idx !== 0}
          >
            <Current key={idx} />
          </SlideShell>
        </div>

        {/* Botões nav */}
        <button
          onClick={prev}
          disabled={idx === 0}
          aria-label="Slide anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-[#1e3a8a] hover:text-white disabled:opacity-30 disabled:hover:bg-white/90 disabled:hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          disabled={idx === TOTAL - 1}
          aria-label="Próximo slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-[#1e3a8a] hover:text-white disabled:opacity-30 disabled:hover:bg-white/90 disabled:hover:text-slate-700 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </main>

      {/* Status bar */}
      <footer className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">
          Use as <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 text-[10px]">←</kbd>{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 text-[10px]">→</kbd>{" "}
          para navegar ·{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 text-[10px]">G</kbd>{" "}
          índice
        </p>
        <div className="flex items-center gap-3">
          <div className="text-[12px] text-slate-700 font-semibold tabular-nums">
            {String(idx + 1).padStart(2, "0")}{" "}
            <span className="text-slate-400">/</span>{" "}
            {String(TOTAL).padStart(2, "0")}
          </div>
          <div className="w-40 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1e3a8a] transition-all duration-300"
              style={{ width: `${((idx + 1) / TOTAL) * 100}%` }}
            />
          </div>
        </div>
      </footer>

      {/* Modal Índice */}
      {showIndex && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowIndex(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1e3a8a]">
                Índice da Apresentação
              </h3>
              <button
                onClick={() => setShowIndex(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {SLIDES_META.map((s, i) => {
                const Icon = s.icon;
                const active = i === idx;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        setIdx(i);
                        setShowIndex(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${
                        active
                          ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                          : "bg-white text-slate-700 border-slate-200 hover:border-[#1e3a8a]"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold tabular-nums w-6 ${
                          active ? "text-amber-300" : "text-[#1e3a8a]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-[13px] font-medium truncate">
                        {s.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const ToolbarBtn = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Maximize;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
  >
    <Icon className="w-4 h-4" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default ApresentacaoEmilia;
