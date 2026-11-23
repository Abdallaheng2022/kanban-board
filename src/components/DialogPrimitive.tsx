import { Dialog } from "radix-ui";

interface DialogPrimitiveProps {
  title: string;
  triggerComponent?: React.ReactNode;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export const DialogPrimitive = ({
  title,
  triggerComponent,
  isOpen,
  setOpen,
  children,
}: DialogPrimitiveProps) => (
  <Dialog.Root open={isOpen} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>{triggerComponent}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[90vw] max-w-112.5 translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6.25 shadow-lg focus:outline-none">
        <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">{title}</Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
