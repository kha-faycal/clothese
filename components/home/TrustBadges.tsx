export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4" dir="rtl">
      <div className="bg-secondary/30 border border-border p-3.5 rounded-xl flex items-center gap-3.5 text-right transition-colors">
        <span className="text-xl bg-background border border-border p-2 rounded-xl">🤝</span>
        <div className="flex flex-col">
          <h4 className="text-xs font-black text-foreground">ثقة وضمان</h4>
          <p className="text-[11px] text-muted">افحص سلعتك قبل الدفع عند الاستلام</p>
        </div>
      </div>
      <div className="bg-secondary/30 border border-border p-3.5 rounded-xl flex items-center gap-3.5 text-right transition-colors">
        <span className="text-xl bg-background border border-border p-2 rounded-xl">⚡</span>
        <div className="flex flex-col">
          <h4 className="text-xs font-black text-foreground">شحن سريع</h4>
          <p className="text-[11px] text-muted">توصيل سريع لباب المنزل أو المكتب</p>
        </div>
      </div>
    </section>
  );
}
