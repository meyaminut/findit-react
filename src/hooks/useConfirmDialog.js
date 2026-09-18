import { useState, useCallback } from 'react';

/**
 * Hook: useConfirmDialog
 * Promise-based pengganti window.confirm.
 *   const confirmDialog = useConfirmDialog();
 *   const ok = await confirmDialog.confirm({ title, message, confirmLabel, danger });
 *   if (!ok) return;
 *
 * Render dialog-nya dengan:
 *   {confirmDialog.dialog && <ConfirmDialog {...confirmDialog.dialog} />}
 */
export function useConfirmDialog() {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(
    (options = {}) =>
      new Promise((resolve) => {
        setDialog({
          title: options.title || 'Konfirmasi',
          message: options.message || '',
          confirmLabel: options.confirmLabel || 'Hapus',
          danger: options.danger !== false,
          onConfirm: () => {
            setDialog(null);
            resolve(true);
          },
          onCancel: () => {
            setDialog(null);
            resolve(false);
          },
        });
      }),
    []
  );

  const close = useCallback(() => setDialog(null), []);

  return { dialog, confirm, close };
}

export default useConfirmDialog;