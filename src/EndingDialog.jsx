import { useEffect, useRef } from "react";

export function openEndingDialog(dialog, previous, fallback) {
  dialog.showModal();
  dialog.querySelector("h2")?.focus({ preventScroll: true });
  return () => {
    dialog.close();
    const target = previous?.isConnected ? previous : fallback();
    target?.focus();
  };
}

export function EndingDialog({ className, labelledBy, children }) {
  const ref = useRef(null);
  useEffect(() => openEndingDialog(ref.current, document.activeElement, () => document.querySelector("[data-ending-return]")), []);
  return <dialog ref={ref} className={`${className} native-ending-dialog`} aria-labelledby={labelledBy} onCancel={event => event.preventDefault()}>{children}</dialog>;
}
