export default function TopBar() {
  return (
    <div className="bg-secondary/40 text-muted text-[10px] md:text-xs py-2.5 px-4 border-b border-border transition-colors" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-0 tracking-wide text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="font-medium text-foreground/80">🚚 التوصيل متوفر لـ 58 ولاية سارع بالطلب الآن</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <span className="font-semibold text-foreground">💵 الدفع عند الاستلام (Paiement à la livraison)</span>
        </div>
      </div>
    </div>
  );
}
