import Link from "next/link";
import { notFound } from "next/navigation";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CharacterFormFields } from "@/components/dashboard/CharacterFormFields";
import { updateCharacterAction, deleteCharacterAction } from "@/app/dashboard/characters/actions";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { primaryButtonClass, secondaryButtonClass, cardClass } from "@/lib/ui";

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const globalId = Number(id);

  const [character, seriesMap, rarityMap] = await Promise.all([
    botApi.characters.get(globalId).catch(() => null),
    botApi.series.list().catch(() => ({})),
    botApi.rarities.list().catch(() => ({})),
  ]);

  if (!character) notFound();

  const seriesOptions = Object.values(seriesMap).map((s) => ({ id: s.id, name: s.name }));
  const rarityOptions = Object.keys(rarityMap);

  const boundUpdate = updateCharacterAction.bind(null, globalId);

  return (
    <div>
      <PageHeader title={`Edit — ${character.name}`} description={`Global ID: ${character.global_id}`} />

      <form action={boundUpdate} className={cardClass}>
        <CharacterFormFields character={character} seriesOptions={seriesOptions} rarityOptions={rarityOptions} />

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-3">
            <button type="submit" className={primaryButtonClass}>
              Save changes
            </button>
            <Link href="/dashboard/characters" className={secondaryButtonClass}>
              Cancel
            </Link>
          </div>
        </div>
      </form>

      <form action={deleteCharacterAction} className="mt-4">
        <input type="hidden" name="id" value={character.global_id} />
        <ConfirmButton message={`Delete "${character.name}"? This can't be undone.`}>
          Delete character
        </ConfirmButton>
      </form>
    </div>
  );
}
