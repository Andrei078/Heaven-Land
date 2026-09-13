"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { botApi } from "@/lib/bot-api";

function parseQuestForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    type: String(formData.get("type") ?? ""),
    difficulty: String(formData.get("difficulty") ?? ""),
    min_level: Number(formData.get("min_level")),
    max_level: Number(formData.get("max_level")),
    target: Number(formData.get("target")),
    rewards: {
      xp: Number(formData.get("reward_xp") || 0),
      money: Number(formData.get("reward_money") || 0),
    },
    repeatable: formData.get("repeatable") === "on",
    enabled: formData.get("enabled") === "on",
  };
}

export async function createQuestAction(formData: FormData) {
  await botApi.quests.create(parseQuestForm(formData));
  revalidatePath("/dashboard/quests");
  redirect("/dashboard/quests");
}

export async function updateQuestAction(id: number, formData: FormData) {
  await botApi.quests.update(id, parseQuestForm(formData));
  revalidatePath("/dashboard/quests");
  redirect("/dashboard/quests");
}

export async function deleteQuestAction(formData: FormData) {
  const id = Number(formData.get("id"));
  await botApi.quests.delete(id);
  revalidatePath("/dashboard/quests");
  redirect("/dashboard/quests");
}
