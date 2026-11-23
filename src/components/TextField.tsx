import clsx from "clsx";
/*
 * ================= Tailwind: flex-* =================
 * المعنى: نسبة ما يأخذه العنصر من المساحة المتاحة  → flex: <رقم>
 *
 * الإصدارات:
 *   v3 → فقط flex-1 | flex-auto | flex-initial | flex-none
 *        ولأي رقم آخر: flex-[2]
 *   v4 → أي رقم يعمل: flex-2 | flex-3 | flex-5 ...
 *
 * الرقم = نسبة مقارنةً بالعناصر الأخرى في نفس الصف:
 *   flex-1  flex-1           →  نصف + نصف
 *   flex-1  flex-2           →  ثلث + ثلثين
 *   flex-1  flex-1  flex-2   →  ربع + ربع + نصف
 *
 *   ┌──────────┬────────────────────┐
 *   │ A flex-1 │      B flex-2      │
 *   │  (1/3)   │       (2/3)        │
 *   └──────────┴────────────────────┘
 *
 * ⚠️ ملاحظات:
 *   - الرقم وحده لا معنى له، المهم النسبة بين العناصر
 *     (عنصر واحد في الصف: flex-1 = flex-5 = كل المساحة)
 *   - لا تعمل بدون flex على الأب
 *   - عنصر بدون flex-* → يأخذ حجم محتواه فقط، والباقي يُقسَّم على الآخرين
 *       <button>Save</button>      ← حجم النص فقط
 *       <input class="flex-1" />   ← كل المساحة الباقية
 *   - مع min-w-*: لو العنصر وصل حده الأدنى، يتوقف عن الصغر
 *
 * ================= Tailwind: min-w-* =================
 * المعنى: أقل عرض للعنصر → min-width
 *   min-w-80 = 80 × 4px = 320px  → يكبر عادي، لكن لا يصغر أقل من 320px
 *
 *   w-80          → عرض ثابت 320px
 *   min-w-80      → أقل عرض 320px (يكبر عادي)
 *   max-w-80      → أكبر عرض 320px (يصغر عادي)
 *   min-w-full    → أقل عرض 100% من الأب
 *   min-w-[250px] → قيمة مخصصة
 *
 * نفس الفكرة للارتفاع: h-* | min-h-* | max-h-*
 *   min-h-screen → أقل ارتفاع = ارتفاع الشاشة كاملة
 *
 * التركيبة الشائعة:  flex-1 min-w-80
 *   → "تمدد وخذ المساحة المتاحة، لكن لا تصغر أقل من 320px"
 * ====================================================
 */

export interface TextFieldProps {
  name: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  isInvalid?: boolean;
}

export const TextField = ({ name, placeholder, isInvalid, ...props }: TextFieldProps) => {
  return (
    <div className="relative flex flex-1 min-w-80 items-center">
      {isInvalid && <span className="absolute text-red right-4 text-body-l">Can't be empty</span>}
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={props.defaultValue}
        required={props.required}
        className={clsx("w-full rounded-sm border border-medium-grey py-2 pl-4 text-body-l", {
          "border-red pr-32": isInvalid,
          "pr-4": !isInvalid,
        })}
      />
    </div>
  );
};
