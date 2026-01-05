import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomDigits(length: number): string {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function generateUniqueId(prefix: string, model: 'user' | 'property' | 'material'): Promise<string> {
  // Import dynamically to avoid circular dependency issues if any, though utils should satisfy it.
  // However, importing prisma here is fine.
  const { prisma } = await import("@/lib/prisma");
  const maxRetries = 10;

  for (let i = 0; i < maxRetries; i++) {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 for checks
    let result = '';
    const charactersLength = characters.length;
    for (let j = 0; j < 8; j++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const uniqueId = `${prefix}${result}`;

    // Validation: Unique Check
    let exists = false;

    if (model === 'user') {
      const user = await prisma.user.findUnique({
        where: { uniqueId }
      });
      exists = !!user;
    } else if (model === 'property') {
      const property = await prisma.property.findUnique({
        where: { uniqueId }
      });
      exists = !!property;
    } else if (model === 'material') {
      const material = await prisma.material.findUnique({
        where: { uniqueId } // Note: Schema update needed
      });
      exists = !!material;
    }

    if (!exists) {
      return uniqueId;
    }
  }

  throw new Error(`Failed to generate unique ID for ${model} after ${maxRetries} attempts`);
}
