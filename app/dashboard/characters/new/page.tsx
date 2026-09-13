import Link from "next/link";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CharacterFormFields } from "@/components/dashboard/CharacterFormFields";
import { createCharacterAction } from "@/app/dashboard/characters/actions";
import { primaryButtonClass, secondaryButtonClass, cardClass } from "@/lib/ui";

export default async function NewCharacterPage() {
  const [seriesMap, rarityMap] = await Promise.all([
    botApi.series.list().catch(() => ({})),
    botApi.rarities.list().catch(() => ({})),
  ]);

  const seriesOptions = Object.values(seriesMap).map((s) => ({ id: s.id, name: s.name }));
  const rarityOptions = Object.keys(rarityMap);

  return (
    <div>
      <PageHeader title="Create Character" />

      <form action={createCharacterAction} className={cardClass}>
        <CharacterFormFields seriesOptions={seriesOptions} rarityOptions={rarityOptions} />

        <div className="mt-6 flex gap-3">
          <button type="submit" className={primaryButtonClass}>
            Create character
          </button>
          <Link href="/dashboard/characters" className={secondaryButtonClass}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
