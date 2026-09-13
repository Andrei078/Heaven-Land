"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { botApi } from "@/lib/bot-api";

function parseRarityForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    chance: Number(formData.get("chance")),
    summon_cost: Number(formData.get("summon_cost")),
    max_ascension: Number(formData.get("max_ascension")),
    max_level: Number(formData.get("max_level")),
    color: Number(formData.get("color")),
    border: String(formData.get("border") ?? ""),
    special: formData.get("special") === "on",
  };
}

export async function upsertRarityAction(formData: FormData) {
  const data = parseRarityForm(formData);
  await botApi.rarities.upsert(data.name, data);
  revalidatePath("/dashboard/rarities");
  redirect("/dashboard/rarities");
}

export async function deleteRarityAction(formData: FormData) {
  const name = String(formData.get("name"));
  await botApi.rarities.delete(name);
  revalidatePath("/dashboard/rarities");
  redirect("/dashboard/rarities");
}
