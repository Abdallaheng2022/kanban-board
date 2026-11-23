/*
 * ========== Tailwind: duration-* ==========
 * المعنى: مدة الانتقال (transition) = transition-duration في CSS
 * أي كم يستغرق التغيير من حالة لأخرى (مثل hover)
 *
 * القيم:
 *   duration-75    → 75ms
 *   duration-150   → 150ms  (الافتراضي مع transition)
 *   duration-300   → 300ms
 *   duration-500   → 500ms
 *   duration-1000  → 1s
 *   duration-[2s]  → قيمة مخصصة
 *
 * ⚠️ لازم يكون معه transition أو transition-colors أو transition-all، وإلا لن يعمل
 *
 * يُستخدم مع:
 *   ease-in / ease-out / ease-in-out → طريقة تسارع الحركة
 *   delay-*                          → تأخير قبل بدء الحركة
 *
 * مثال:
 *   className="transition-all duration-500 ease-in-out hover:scale-110"
 * ==========================================
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("rounded-full px-6 duration-200 text-[13px] font-bold", {
  variants: {
    variant: {
      primary: "text-white bg-main-purple hover:bg-main-purple-hover",
      secondary: "text-main-purple bg-main-purple/10 hover:bg-main-purple/25",
      destructive: "text-white bg-red hover:bg-red-hover",
    },
    size: {
      sm: "h-10",
      lg: "h-12",
    },
    isFullWidth: {
      true: "w-full",
    },
    isDisabled: {
      true: "cursor-not-allowed opacity-25 hover:bg-main-purple",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
});

// أنواع الـ props: كل خصائص زر HTML العادية + الـ variants من cva
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    children: ReactNode;
  };

export const Button = ({
  children,
  variant,
  size,
  isFullWidth,
  className,
  isDisabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={button({ variant, size, isFullWidth, className, isDisabled })}
      disabled={isDisabled ?? undefined}
      {...props}
    >
      {children}
    </button>
  );
};
