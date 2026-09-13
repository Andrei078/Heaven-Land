"use server";

import { revalidatePath } from "next/cache";
import { botApi } from "@/lib/bot-api";

export async function updateSettingsAction(formData: FormData) {
  await botApi.settings.update({
    bot_name: String(formData.get("bot_name") ?? ""),
    prefix: String(formData.get("prefix") ?? ""),
    market_tax: Number(formData.get("market_tax")),
    daily_cooldown: Number(formData.get("daily_cooldown")),
    daily_summon_cooldown: Number(formData.get("daily_summon_cooldown")),
    summon_cost: Number(formData.get("summon_cost")),
  });
  revalidatePath("/dashboard/bot/settings");
}
