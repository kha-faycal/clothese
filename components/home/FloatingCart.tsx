interface FloatingCartProps {
  count: number;
  onClick: () => void;
}

export default function FloatingCart({ count, onClick }: FloatingCartProps) {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-6 right-4 sm:right-6 z-40 bg-foreground text-background pl-5 pr-4 py-3 sm:py-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2.5 sm:gap-3 hover:opacity-90 transition-all active:scale-90 font-bold cursor-pointer select-none group"
    >
      <span className="text-base sm:text-lg group-hover:rotate-12 transition-transform">🛒</span>
      <span className="bg-background text-foreground text-[10px] px-2 py-0.5 rounded-full font-mono font-black">{count}</span>
    </button>
  );
}
