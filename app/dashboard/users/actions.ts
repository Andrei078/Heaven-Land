"use server";

import { revalidatePath } from "next/cache";
import { botApi } from "@/lib/bot-api";

export async function updateUserAction(userId: string, formData: FormData) {
  await botApi.users.update(userId, {
    level: Number(formData.get("level")),
    xp: Number(formData.get("xp")),
    money: Number(formData.get("money")),
  });
  revalidatePath(`/dashboard/users/${userId}`);
}

export async function addMoneyAction(userId: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  await botApi.users.addMoney(userId, amount);
  revalidatePath(`/dashboard/users/${userId}`);
}

export async function addXpAction(userId: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  await botApi.users.addXp(userId, amount);
  revalidatePath(`/dashboard/users/${userId}`);
}
