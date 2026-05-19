<script lang="ts">
	import { Character } from '$lib/characterClass.svelte';

	const player = new Character();
	const STAT_STEP = 10;
	const WEAPON_STEP = 100;

	let newAdditiveName = $state('');
	let newMultiplierName = $state('');

	function formatNumber(num: number): string {
		return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
	}

	function handleAddAdditive() {
		player.addCustomAdditive(newAdditiveName);
		newAdditiveName = '';
	}

	function handleAddMultiplier() {
		player.addCustomMultiplier(newMultiplierName);
		newMultiplierName = '';
	}
</script>

<main
	class="mx-auto min-h-screen max-w-5xl space-y-4 bg-slate-900 p-4 font-sans text-slate-200 antialiased"
>
	<header
		class="flex flex-col items-start justify-between gap-2 border-b border-slate-800 pb-2 sm:flex-row sm:items-center"
	>
		<h1 class="flex items-center gap-2 text-xl font-bold tracking-tight text-orange-500">
			⚔️ Diablo 4 Stat Calculator
		</h1>

		<div
			class="flex items-center gap-4 rounded-sm border border-orange-800/60 bg-orange-950/40 px-4 py-1 shadow-inner"
		>
			<div class="flex flex-col text-right sm:text-left">
				<span class="text-[10px] font-semibold tracking-wider text-slate-400 uppercase"
					>Normal Hit:</span
				>
				<span class="font-mono text-sm font-bold text-slate-300">
					{formatNumber(player.normalDamage)}
				</span>
			</div>
			<div class="h-6 border-l border-slate-800/80"></div>
			<div class="flex flex-col text-right sm:text-left">
				<span class="text-[10px] font-semibold tracking-wider text-slate-400 uppercase"
					>Crit Hit:</span
				>
				<span class="font-mono text-sm font-bold text-slate-300">
					{formatNumber(player.critDamage)}
				</span>
			</div>
			<div class="h-6 border-l border-slate-800/80"></div>
			<div class="flex flex-col text-right sm:text-left">
				<span class="text-[10px] font-semibold tracking-wider text-orange-300 uppercase"
					>Average Dmg:</span
				>
				<span class="font-mono text-base font-bold text-orange-400">
					{formatNumber(player.currentDamage)}
				</span>
			</div>
		</div>
	</header>

	<section class="rounded-sm border border-slate-800 bg-slate-800/40 p-2 shadow-sm">
		<h2
			class="mb-2 border-b border-slate-800 pb-1 text-xs font-bold tracking-wider text-amber-500 uppercase"
		>
			Base Stats & Hit Conditions
		</h2>
		<div class="flex flex-col gap-1">
			<div
				class="mb-1 grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/40 px-2 py-1.5"
			>
				<span class="col-span-5 text-xs font-semibold text-slate-400"
					>Simulated Hit Conditions:</span
				>
				<div class="col-span-7 flex gap-6">
					<label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-200">
						<input
							type="checkbox"
							bind:checked={player.isVulnerable}
							class="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-0"
						/>
						Target is Vulnerable
					</label>
				</div>
			</div>

			<div
				class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
			>
				<label for="weaponDmg" class="col-span-5 text-xs font-medium text-slate-300"
					>Weapon Damage</label
				>
				<div class="relative col-span-2 flex items-center">
					<input
						id="weaponDmg"
						type="number"
						bind:value={player.weaponDmg}
						class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
					/>
				</div>
				<span class="col-span-5 text-right font-mono text-[11px] font-medium text-green-400">
					+{formatNumber(player.getWeaponDmgGain(WEAPON_STEP))}
					<span class="text-[9px] text-slate-500">per {WEAPON_STEP}</span>
				</span>
			</div>

			<div
				class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
			>
				<label for="critChance" class="col-span-5 text-xs font-medium text-slate-300"
					>Crit Chance</label
				>
				<div class="relative col-span-2 flex items-center">
					<input
						id="critChance"
						type="number"
						bind:value={player.critChance}
						class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
					/>
					<span class="absolute right-1 font-mono text-[10px] text-slate-500">%</span>
				</div>
				<span class="col-span-5 text-right font-mono text-[11px] font-medium text-green-400">
					+{formatNumber(player.getCritChanceGain(5))}
					<span class="text-[9px] text-slate-500">per 5%</span>
				</span>
			</div>

			<div
				class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
			>
				<label for="skillDamage" class="col-span-5 text-xs font-medium text-slate-300"
					>Skill Damage (Stat Bonus)</label
				>
				<div class="relative col-span-2 flex items-center">
					<input
						id="skillDamage"
						type="number"
						bind:value={player.skillDamage}
						class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
					/>
					<span class="absolute right-1 font-mono text-[10px] text-slate-500">%</span>
				</div>
				<span class="col-span-5 text-right font-mono text-[11px] font-medium text-green-400">
					+{formatNumber(player.getSkillDamageGain(STAT_STEP))}
					<span class="text-[9px] text-slate-500">per {STAT_STEP}%</span>
				</span>
			</div>

			<div
				class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
			>
				<label for="skillCoeff" class="col-span-5 text-xs font-medium text-slate-300"
					>Skill Coefficient (Tooltip %)</label
				>
				<div class="relative col-span-2 flex items-center">
					<input
						id="skillCoeff"
						type="number"
						bind:value={player.skillCoeff}
						class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
					/>
					<span class="absolute right-1 font-mono text-[10px] text-slate-500">%</span>
				</div>
				<span class="col-span-5 text-right font-mono text-[11px] font-medium text-green-400">
					+{formatNumber(player.getSkillCoeffGain(5))}
					<span class="text-[9px] text-slate-500">per 5%</span>
				</span>
			</div>

			<div
				class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
			>
				<label for="enemyDR" class="col-span-5 text-xs font-medium text-slate-300"
					>Enemy Damage Factor (Mitigation Scaling)</label
				>
				<div class="relative col-span-2 flex items-center">
					<input
						id="enemyDR"
						type="number"
						bind:value={player.enemyDR}
						class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
					/>
					<span class="absolute right-1 font-mono text-[10px] text-slate-500">%</span>
				</div>
				<span class="col-span-5 text-right font-mono text-[11px] font-medium text-green-400">
					+{formatNumber(player.getEnemyDRGain(5))}
					<span class="text-[9px] text-slate-500">per 5%</span>
				</span>
			</div>
		</div>
	</section>

	<div class="flex flex-col gap-4">
		<section
			class="flex flex-col gap-1 rounded-sm border border-slate-800 bg-slate-800/40 p-2 shadow-sm"
		>
			<h2
				class="mb-2 border-b border-slate-800 pb-1 text-xs font-bold tracking-wider text-amber-500 uppercase"
			>
				Additive Stats (+)
			</h2>
			<div class="mb-2 flex flex-col gap-1">
				{#each Object.keys(player.additives) as key}
					<div
						class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
					>
						<label for={key} class="col-span-5 truncate text-xs font-medium text-slate-300"
							>{player.additives[key].displayName}</label
						>
						<div class="relative col-span-2 flex items-center">
							<input
								id={key}
								type="number"
								bind:value={player.additives[key].value}
								class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
							/>
							<span class="absolute right-1 font-mono text-[10px] text-slate-500">%</span>
						</div>
						<span class="col-span-2 text-right font-mono text-[11px] font-medium text-green-400"
							>+{formatNumber(player.getAdditiveGain(key, STAT_STEP))}<span
								class="text-[9px] text-slate-500">/10%</span
							></span
						>
						<span
							class="col-span-3 border-l border-slate-800/50 pl-1 text-right font-mono text-[11px] font-medium text-emerald-500"
							>+{formatNumber(player.getAdditiveTotalGain(key))}<span
								class="text-[9px] text-slate-500"
							>
								total</span
							></span
						>
					</div>
				{/each}
			</div>
			<div class="mt-auto flex gap-1 border-t border-slate-800/60 pt-2">
				<input
					type="text"
					placeholder="Add custom additive stat..."
					bind:value={newAdditiveName}
					onkeydown={(e) => e.key === 'Enter' && handleAddAdditive()}
					class="w-full rounded-sm border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
				/>
				<button
					onclick={handleAddAdditive}
					class="rounded-sm border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-orange-600"
					>+</button
				>
			</div>
		</section>

		<section
			class="flex flex-col gap-1 rounded-sm border border-slate-800 bg-slate-800/40 p-2 shadow-sm"
		>
			<h2
				class="mb-2 border-b border-slate-800 pb-1 text-xs font-bold tracking-wider text-amber-500 uppercase"
			>
				Multiplicative Stats (x)
			</h2>
			<div class="mb-2 flex flex-col gap-1">
				{#each Object.keys(player.multiplier) as key}
					<div
						class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
					>
						<label for={key} class="col-span-5 truncate text-xs font-medium text-slate-300"
							>{player.multiplier[key].displayName}</label
						>
						<div class="relative col-span-2 flex items-center">
							<input
								id={key}
								type="number"
								bind:value={player.multiplier[key].value}
								class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
							/>
							<span class="absolute right-1 font-mono text-[10px] text-slate-500">%</span>
						</div>
						<span class="col-span-2 text-right font-mono text-[11px] font-medium text-green-400"
							>+{formatNumber(player.getMultiplierGain(key, STAT_STEP))}<span
								class="text-[9px] text-slate-500">/10%</span
							></span
						>
						<span
							class="col-span-3 border-l border-slate-800/50 pl-1 text-right font-mono text-[11px] font-medium text-emerald-500"
							>+{formatNumber(player.getMultiplierTotalGain(key))}<span
								class="text-[9px] text-slate-500"
							>
								total</span
							></span
						>
					</div>
				{/each}
			</div>
			<div class="mt-auto flex gap-1 border-t border-slate-800/60 pt-2">
				<input
					type="text"
					placeholder="Add custom multiplicative stat..."
					bind:value={newMultiplierName}
					onkeydown={(e) => e.key === 'Enter' && handleAddMultiplier()}
					class="w-full rounded-sm border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
				/>
				<button
					onclick={handleAddMultiplier}
					class="rounded-sm border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-orange-600"
					>+</button
				>
			</div>
		</section>

		<section
			class="flex flex-col gap-1 rounded-sm border border-slate-800 bg-slate-800/40 p-2 shadow-sm"
		>
			<h2
				class="mb-2 border-b border-slate-800 pb-1 text-xs font-bold tracking-wider text-amber-500 uppercase"
			>
				Conditional Toggles
			</h2>
			<div class="flex flex-col gap-1">
				{#each Object.keys(player.additionalMultipliers) as key}
					<div
						class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
					>
						<label
							class="col-span-7 flex cursor-pointer items-center gap-2 truncate text-xs font-medium text-slate-300"
						>
							<input
								type="checkbox"
								bind:checked={player.additionalMultipliers[key].active}
								class="h-3 w-3 rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-0"
							/>
							{player.additionalMultipliers[key].displayName}
						</label>
						<div class="relative col-span-2 flex items-center">
							<input
								type="number"
								bind:value={player.additionalMultipliers[key].value}
								disabled={!player.additionalMultipliers[key].active}
								class="w-full rounded-sm border border-slate-700 bg-slate-950 p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none disabled:opacity-30"
							/>
							<span class="absolute right-1 font-mono text-[10px] text-slate-500">%</span>
						</div>
						<span class="col-span-3 text-right font-mono text-[11px] font-medium text-green-400"
							>+{formatNumber(player.getAdditionalMultiplierTotalGain(key))}
							<span class="text-[9px] text-slate-500">total</span></span
						>
					</div>
				{/each}
			</div>
		</section>
	</div>
</main>
