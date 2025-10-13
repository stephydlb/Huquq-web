export async function uploadReceipt(file: File, userId: string): Promise<string> {
  // Remplace ceci par la logique réelle d'upload Supabase
  return Promise.resolve(`/uploads/${userId}/${file.name}`);
}