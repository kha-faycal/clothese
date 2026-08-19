import Image from "next/image";

interface HeroSectionProps {
  hasPromotions: boolean;
}

export default function HeroSection({ hasPromotions }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[40vh] md:min-h-[55vh] bg-gradient-to-b from-secondary/20 to-background border-b border-border flex items-center px-4 sm:px-6 overflow-hidden py-12 md:py-0 transition-colors">
      <div className="absolute top-1/3 left-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center" dir="rtl">
        
        <div className="col-span-1 md:col-span-7 flex flex-col items-center md:items-start gap-4 text-center md:text-right">
          <span className="text-[10px] sm:text-xs bg-secondary border border-border text-foreground px-3 py-1.5 rounded-md font-black tracking-widest uppercase shadow-sm">Collection 2026</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.2] md:leading-[1.15]">
            منتجات تعبر عن <br className="hidden sm:inline" />
            <span className="text-primary">تميزك وانفرادك</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted max-w-lg leading-relaxed px-2 sm:px-0">
            اكتشف تشكيلاتنا الحصرية من الملابس الراقية، العطور الفاخرة، ومستحضرات التجميل المنتقاة بعناية فائقة لتناسب ذوقك الرفيع.
          </p>
          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3 w-full sm:w-auto">
            <a href="#catalogue" className="w-[45%] sm:w-auto bg-foreground text-background font-black text-center text-xs px-5 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg">تصفح المجموعة</a>
            {hasPromotions && (
              <a href="#promotions" className="w-[45%] sm:w-auto bg-secondary text-primary border border-primary/20 font-bold text-center text-xs px-5 py-3 rounded-xl hover:bg-secondary/80 transition-colors">العروض %</a>
            )}
          </div>
        </div>

        <div className="hidden md:col-span-5 md:flex justify-end relative">
          {/* 🟢 Le cadre devient blanc (bg-white) avec des bordures claires pour fusionner à 105% avec le logo */}
          <div className="w-80 h-80 bg-white border border-gray-200/80 rounded-3xl shadow-2xl relative overflow-hidden flex items-center justify-center p-4">
            <Image
              src="/them.jpg"
              alt="Anaka Shop Logo"   
              fill                     
              sizes="320px"            
              loading="eager"           
              priority                 
              className="object-contain p-2 rounded-3xl" // 🟢 Conserve les proportions sans distorsion
            />
          </div>
        </div>
      </div>
    </section>
  );
}
