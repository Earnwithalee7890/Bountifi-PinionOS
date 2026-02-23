import { PinionClient } from "pinion-os";

if (!process.env.PINION_PRIVATE_KEY) {
  console.warn("PINION_PRIVATE_KEY is not set. PinionOS skills will not work.");
}

export const pinion = new PinionClient({
  privateKey: process.env.PINION_PRIVATE_KEY || "0x1234567890123456789012345678901234567890123456789012345678901234",
});

export const isPinionConfigured = !!process.env.PINION_PRIVATE_KEY;
