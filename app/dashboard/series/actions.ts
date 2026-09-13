"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { botApi } from "@/lib/bot-api";

export async function createSeriesAction(formData: FormData) {
  await botApi.series.create({
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  revalidatePath("/dashboard/series");
  redirect("/dashboard/series");
}

export async function updateSeriesAction(id: number, formData: FormData) {
  await botApi.series.update(id, {
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  revalidatePath("/dashboard/series");
  redirect("/dashboard/series");
}

export async function deleteSeriesAction(formData: FormData) {
  const id = Number(formData.get("id"));
  await botApi.series.delete(id);
  revalidatePath("/dashboard/series");
  redirect("/dashboard/series");
}
