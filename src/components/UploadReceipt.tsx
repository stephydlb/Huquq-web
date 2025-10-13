import { uploadReceipt } from "../services/ReceiptService";

export function UploadReceipt({ userId }: { userId: string }) {
  return (
    <input
      type="file"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const path = await uploadReceipt(file, userId);
          alert('Fichier uploadé à : ' + path);
        }
      }}
    />
  );
}