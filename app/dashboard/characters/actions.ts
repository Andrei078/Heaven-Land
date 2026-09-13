"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { botApi } from "@/lib/bot-api";

function parseCharacterForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    series_id: Number(formData.get("series_id")),
    rarity: String(formData.get("rarity") ?? ""),
    base_hp: Number(formData.get("base_hp")),
    base_mp: Number(formData.get("base_mp")),
    base_stamina: Number(formData.get("base_stamina")),
    base_attack: Number(formData.get("base_attack")),
    base_defense: Number(formData.get("base_defense")),
    special_ability: String(formData.get("special_ability") ?? ""),
    image: String(formData.get("image") ?? ""),
    enabled: formData.get("enabled") === "on",
    level: Number(formData.get("level") || 1),
  };
}

export async function createCharacterAction(formData: FormData) {
  const data = parseCharacterForm(formData);
  await botApi.characters.create(data);
  revalidatePath("/dashboard/characters");
  redirect("/dashboard/characters");
}

export async function updateCharacterAction(id: number, formData: FormData) {
  const data = parseCharacterForm(formData);
  await botApi.characters.update(id, data);
  revalidatePath("/dashboard/characters");
  revalidatePath(`/dashboard/characters/${id}`);
  redirect("/dashboard/characters");
}

export async function deleteCharacterAction(formData: FormData) {
  const id = Number(formData.get("id"));
  await botApi.characters.delete(id);
  revalidatePath("/dashboard/characters");
  redirect("/dashboard/characters");
}
