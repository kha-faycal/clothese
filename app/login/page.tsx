"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States for form control
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve where the user came from (defaults to dashboard if none)
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setIsLoading(true);

    try {
      // Execute the NextAuth credential flow
      const result = await signIn("credentials", {
        redirect: false, // Prevent NextAuth from doing a hard page refresh
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (result?.error) {
        // Display specific error returned from lib/auth.ts authorize loop
        toast.error(result.error === "CredentialsSignin" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : result.error);
      } else {
        toast.success("تم تسجيل الدخول بنجاح! جاري تحويلك...");
        
        // Refresh the router to update navbar states, then move forward
        router.refresh();
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Login component submission error:", err);
      toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] flex-col justify-center px-6 py-12 lg:px-8 bg-[var(--background)]" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-[var(--foreground)]">
          تسجيل الدخول إلى حسابك
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border border-[var(--border)] p-8 rounded-2xl shadow-xl bg-[var(--background)]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email input field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-[var(--foreground)] text-right">
              البريد الإلكتروني
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 px-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all text-right"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          {/* Password input field */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold leading-6 text-[var(--foreground)] text-right">
                كلمة المرور
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 px-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all text-right"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-[var(--text)] shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>

        {/* Link to Registration */}
        <p className="mt-10 text-center text-sm text-[var(--muted)]">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-semibold leading-6 text-[var(--primary)] hover:text-red-400 transition-colors">
            إنشاء حساب جديد من هنا
          </Link>
        </p>
      </div>
    </div>
  );
}
