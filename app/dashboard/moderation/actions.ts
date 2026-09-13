"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { BotApiError, botApi } from "@/lib/bot-api";

function resultRedirect(ok: boolean, message: string): never {
  const url = new URL("/dashboard/moderation", "http://internal");
  url.searchParams.set(ok ? "ok" : "err", message);
  revalidatePath("/dashboard/moderation");
  redirect(url.pathname + url.search);
}

async function run(action: () => Promise<unknown>, successMessage: string) {
  try {
    await action();
  } catch (error) {
    const message = error instanceof BotApiError ? error.message : "Unexpected error.";
    resultRedirect(false, message);
  }
  resultRedirect(true, successMessage);
}

export async function banAction(formData: FormData) {
  const userId = String(formData.get("user_id"));
  const reason = String(formData.get("reason") || "");
  await run(() => botApi.moderation.ban(userId, reason), `Banned ${userId}.`);
}

export async function unbanAction(formData: FormData) {
  const userId = String(formData.get("user_id"));
  const reason = String(formData.get("reason") || "");
  await run(() => botApi.moderation.unban(userId, reason), `Unbanned ${userId}.`);
}

export async function muteAction(formData: FormData) {
  const userId = String(formData.get("user_id"));
  const minutes = Number(formData.get("minutes") || 10);
  const reason = String(formData.get("reason") || "");
  await run(() => botApi.moderation.mute(userId, minutes, reason), `Muted ${userId} for ${minutes}m.`);
}

export async function unmuteAction(formData: FormData) {
  const userId = String(formData.get("user_id"));
  const reason = String(formData.get("reason") || "");
  await run(() => botApi.moderation.unmute(userId, reason), `Unmuted ${userId}.`);
}

export async function cleanAction(formData: FormData) {
  const channelId = String(formData.get("channel_id"));
  const amount = Number(formData.get("amount") || 10);
  await run(async () => {
    const result = await botApi.moderation.clean(channelId, amount);
    return result;
  }, `Deleted messages in #${channelId}.`);
}

export async function addRoleAction(formData: FormData) {
  const userId = String(formData.get("user_id"));
  const roleId = String(formData.get("role_id"));
  await run(() => botApi.moderation.addRole(userId, roleId), `Added role to ${userId}.`);
}

export async function removeRoleAction(formData: FormData) {
  const userId = String(formData.get("user_id"));
  const roleId = String(formData.get("role_id"));
  await run(() => botApi.moderation.removeRole(userId, roleId), `Removed role from ${userId}.`);
}
