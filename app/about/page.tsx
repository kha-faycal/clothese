"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

interface OwnerData {
  name_company: string;
  name_owner: string;
  address: string;
  telephone: string;
  mail: string;
  image: string[];
}

interface Review {
  id: number;
  customerName: string;
  wilaya: string;
  comment: string;
  rating: number;
}

export default function AboutPage() {
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingOwner, setLoadingOwner] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    // 1. Charger les données du propriétaire
    const fetchOwnerData = async () => {
      try {
        const res = await fetch("/api/owner");
        if (res.ok) setOwner(await res.json());
      } catch (err) {
        console.error("Erreur owner:", err);
      } finally {
        setLoadingOwner(false);
      }
    };

    // 2. Charger les avis clients
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) setReviews(await res.json());
      } catch (err) {
        console.error("Erreur reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchOwnerData();
    fetchReviews();
  }, []);

  const companyName = owner?.name_company || "متجرنا الإلكتروني";
  const mainImage = owner?.image?.[0] || null;

  return (
    <main className="w-full min-h-screen bg-background text-foreground antialiased py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* 1. EN-TÊTE PRINCIPAL */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1.5 rounded-full">
            من نحن؟
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
            قصة {companyName} وشغفنا بالتميز
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
            مرحباً بكم في <span className="text-foreground font-bold">{companyName}</span>، وجهتكم الأولى لاكتشاف أرقى الأزياء العصرية، العطور الفاخرة، ومستحضرات التجميل عالية الجودة في الجزائر.
          </p>
        </div>

        {/* 2. CONTACT & IDENTITÉ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-secondary/10 border border-border p-6 rounded-3xl">
          <div className="col-span-1 md:col-span-7 space-y-4">
            <h2 className="text-xl font-black text-foreground">معلومات الاتصال والمسؤولية</h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              يدير هذا المتجر بشكل قانوني المسؤول العام <span className="text-foreground font-semibold">{owner?.name_owner || "المسؤول العام"}</span> من المقر الرئيسي المتواجد في <span className="text-foreground font-semibold">{owner?.address || "الجزائر"}</span>.
            </p>
            <div className="text-xs text-muted space-y-1">
              <p>📞 رقم الهاتف: <span className="font-mono text-foreground font-bold">{owner?.telephone || "0555000000"}</span></p>
              <p>✉️ البريد الإلكتروني: <span className="font-mono text-foreground font-bold">{owner?.mail || "contact@domain.com"}</span></p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-5 flex justify-center">
            <div className="w-full aspect-video md:aspect-square bg-secondary/50 border border-border rounded-2xl shadow-xl overflow-hidden flex items-center justify-center relative">
              {loadingOwner ? (
                <span className="text-xs text-muted font-mono">Loading...</span>
              ) : mainImage ? (
                <CldImage
                  src={mainImage}
                  width="400"
                  height="400"
                  crop="fill"
                  alt={companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">🛍️</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. LES BLOCS DE VALEURS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary/20 border border-border p-6 rounded-2xl space-y-3">
            <span className="text-3xl bg-background border border-border p-2 rounded-xl inline-block">✨</span>
            <h3 className="text-base font-black text-foreground">رؤيتنا</h3>
            <p className="text-xs text-muted leading-relaxed">
              نسعى دائماً لتقديم تجربة تسوق فريدة تتيح لكل زبون التعبير عن تميزه وانفراده من خلال منتجاتنا المتنوعة.
            </p>
          </div>

          <div className="bg-secondary/20 border border-border p-6 rounded-2xl space-y-3">
            <span className="text-3xl bg-background border border-border p-2 rounded-xl inline-block">🛡️</span>
            <h3 className="text-base font-black text-foreground">جودة مضمونة</h3>
            <p className="text-xs text-muted leading-relaxed">
              جميع ملابسنا، عطورنا، ومواد التجميل لدينا أصلية 100% وتخضع لرقابة صارمة لضمان سلامتكم ورضاكم.
            </p>
          </div>

          <div className="bg-secondary/20 border border-border p-6 rounded-2xl space-y-3">
            <span className="text-3xl bg-background border border-border p-2 rounded-xl inline-block">⚡</span>
            <h3 className="text-base font-black text-foreground">شحن لـ 58 ولاية</h3>
            <p className="text-xs text-muted leading-relaxed">
              نضمن لكم توصيلاً سريعاً وموثوقاً مباشرة إلى باب منزلكم مع إمكانية فحص السلعة قبل الدفع عند الاستلام.
            </p>
          </div>
        </div>

        {/* 4. SECTION DYNAMIQUE : TÉMOIGNAGES CLIENTS */}
        <div className="space-y-6">
          <div className="text-right">
            <h2 className="text-xl md:text-2xl font-black text-foreground">ماذا يقول زبائننا؟</h2>
            <p className="text-xs text-muted mt-1">آراء حقيقية من زبائن وضعوا ثقتهم في متجرنا</p>
          </div>

          {loadingReviews ? (
            <div className="text-center py-6 text-xs text-muted font-mono">Loading reviews...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-secondary/30 border border-border p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    {/* Étoiles de notation */}
                    <div className="flex gap-0.5 text-amber-500 text-xs">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {review.customerName[0]}
                    </div>
                    <div className="text-[11px]">
                      <p className="font-bold text-foreground">{review.customerName}</p>
                      <p className="text-muted">ولاية {review.wilaya}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. BOUTON DE RETOUR */}
        <div className="text-center pt-4">
          <Link 
            href="/shop" 
            className="inline-block bg-foreground text-background font-black text-sm px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            العودة للتسوق وتصفح المنتجات
          </Link>
        </div>

      </div>
    </main>
  );
}
