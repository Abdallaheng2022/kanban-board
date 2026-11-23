import type { ReactNode } from "react";
import { DropdownMenu } from "radix-ui";
import { clsx } from "clsx";

// ❸ نصف شكل العنصر الواحد
type DropdownItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

// ❹ trigger عنصر وليس دالة
interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
}

export const DropdownPrimitive = ({ trigger, items }: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-55 rounded-md bg-white p-1.25 shadow-lg"
          sideOffset={5}
        >
          {/* map خارج الـ Item: كل عنصر له Item خاص به */}
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              onSelect={item.onClick}
              disabled={item.disabled}
              className={clsx(
                "flex h-6.25 items-center rounded-[3px] px-2.5 text-[13px] text-main-purple outline-none data-highlighted:bg-main-purple data-highlighted:text-white",
                {
                  "text-red": item.label.toLowerCase().includes("delete"),
                }
              )}
            >
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
