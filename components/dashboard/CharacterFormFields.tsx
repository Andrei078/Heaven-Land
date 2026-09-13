import type { Character } from "@/lib/bot-api";
import { inputClass, labelClass } from "@/lib/ui";

export function CharacterFormFields({
  character,
  seriesOptions,
  rarityOptions,
}: {
  character?: Character;
  seriesOptions: { id: number; name: string }[];
  rarityOptions: string[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass}>Name</label>
        <input name="name" defaultValue={character?.name} required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Series</label>
        <select name="series_id" defaultValue={character?.series_id} required className={inputClass}>
          <option value="" disabled>
            Select a series
          </option>
          {seriesOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Rarity</label>
        {rarityOptions.length > 0 ? (
          <select name="rarity" defaultValue={character?.rarity} required className={inputClass}>
            <option value="" disabled>
              Select a rarity
            </option>
            {rarityOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ) : (
          <input name="rarity" defaultValue={character?.rarity} required className={inputClass} />
        )}
      </div>

      <div>
        <label className={labelClass}>Image URL</label>
        <input name="image" defaultValue={character?.image} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Level</label>
        <input
          type="number"
          name="level"
          defaultValue={character?.level ?? 1}
          min={1}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>Special ability</label>
        <textarea
          name="special_ability"
          defaultValue={character?.special_ability}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Base HP</label>
        <input type="number" name="base_hp" defaultValue={character?.base_hp} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Base MP</label>
        <input type="number" name="base_mp" defaultValue={character?.base_mp} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Base Stamina</label>
        <input type="number" name="base_stamina" defaultValue={character?.base_stamina} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Base Attack</label>
        <input type="number" name="base_attack" defaultValue={character?.base_attack} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Base Defense</label>
        <input type="number" name="base_defense" defaultValue={character?.base_defense} className={inputClass} />
      </div>

      <div className="flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          id="enabled"
          name="enabled"
          defaultChecked={character?.enabled ?? true}
          className="h-4 w-4 rounded border-hl-border accent-[var(--hl-accent)]"
        />
        <label htmlFor="enabled" className="text-sm text-hl-text">
          Enabled (visible in-bot)
        </label>
      </div>
    </div>
  );
}
