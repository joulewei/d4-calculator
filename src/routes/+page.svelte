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
	<section
		class="space-y-2 rounded-sm border border-slate-800 bg-slate-950/20 p-3 text-xs text-slate-400 shadow-sm"
	>
		<div class="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
			<h3 class="flex items-center gap-1 font-bold tracking-wide text-orange-400">
				💡 Quick Start Guide
			</h3>
			<span
				class="rounded-sm border border-orange-900/50 bg-orange-950/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-orange-400 uppercase"
			>
				Beta / In Development
			</span>
		</div>

		<ul class="list-disc space-y-1 pl-4 text-slate-300">
			<li>
				<strong class="text-white">Use Gear Stats:</strong> Input values directly from your
				equipment and Paragon nodes. Do <span class="text-amber-500">not</span> use the in-game character
				screen (it mixes stats up).
			</li>
			<li>
				<strong class="text-white">Watch the Green Gains:</strong> The green indicators on the right
				show exactly how much <span class="font-medium text-orange-400">Average Damage</span> you gain
				per upgrade step.
			</li>
			<li>
				<strong class="text-white">Optimize Upgrades:</strong> Use these gains to instantly decide which
				item or temper scales your build better.
			</li>
			<li>
				<strong class="text-white"> Credits:</strong> The calculations are based on
				<span class="font-medium text-orange-400"
					><a
						href="https://www.youtube.com/watch?v=2GKhCdxxqp8"
						target="_blank"
						rel="noopener noreferrer">Avarilyn's Youtube Video</a
					></span
				>. Check him out and leave him a follow.
			</li>
		</ul>

		<div
			class="flex items-start gap-1.5 border-t border-slate-800/40 pt-1.5 text-[11px] text-slate-500 italic"
		>
			<span class="shrink-0">🚧</span>
			<p>
				<span class="font-medium text-slate-400 not-italic">Roadmap:</span> This tool is under active
				development. Advanced gear comparison (Profile A vs B) and build imports (Maxroll, d4builds) are
				being worked on and will roll out step-by-step!
			</p>
		</div>
	</section>

	<header
		class="flex flex-col items-start justify-between gap-2 border-b border-slate-800 pb-2 sm:flex-row sm:items-center"
	>
		<h1 class="flex items-center gap-2 text-xl font-bold tracking-tight text-orange-500">
			⚔️ D4 Stat Engine
		</h1>

		<div
			class="flex items-center gap-4 rounded-sm border border-orange-800/60 bg-orange-950/40 px-4 py-1 shadow-inner"
		>
			<div class="flex flex-col text-right sm:text-left">
				<span class="text-[10px] font-semibold tracking-wider text-slate-400 uppercase"
					>Normal Hit:</span
				>
				<span class="font-mono text-sm font-bold text-slate-300"
					>{formatNumber(player.normalDamage)}</span
				>
			</div>
			<div class="h-6 border-l border-slate-800/80"></div>
			<div class="flex flex-col text-right sm:text-left">
				<span class="text-[10px] font-semibold tracking-wider text-slate-400 uppercase"
					>Crit Hit:</span
				>
				<span class="font-mono text-sm font-bold text-slate-300"
					>{formatNumber(player.critDamage)}</span
				>
			</div>
			<div class="h-6 border-l border-slate-800/80"></div>
			<div class="flex flex-col text-right sm:text-left">
				<span class="text-[10px] font-semibold tracking-wider text-orange-300 uppercase"
					>Average Dmg:</span
				>
				<span class="font-mono text-base font-bold text-orange-400"
					>{formatNumber(player.currentDamage)}</span
				>
			</div>
		</div>
	</header>

	<section
		class="space-y-3 rounded-sm border border-slate-800 bg-slate-950/50 p-3 font-mono text-[11px] text-slate-400"
	>
		<span class="block font-sans text-xs font-bold text-amber-500"
			>🧮 Live Equation Transparency (a × b × c × d...)</span
		>

		<div class="space-y-1">
			<span class="block font-sans text-[10px] font-semibold text-slate-500 uppercase"
				>Normal Hit Formula:</span
			>
			<div
				class="flex flex-wrap items-center gap-x-2 gap-y-1 overflow-x-auto rounded-sm border border-slate-800/50 bg-slate-950/80 p-2 text-slate-300"
			>
				<div class="text-center">
					<span class="font-bold text-white">{player.breakdown.normalEq.weaponDmg}</span><span
						class="block text-[9px] text-slate-600">WpnDmg</span
					>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.normalEq.additives.toFixed(3)}</span><span
						class="block text-[9px] text-slate-600">Additive</span
					>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.normalEq.skill.toFixed(3)}</span><span
						class="block text-[9px] text-slate-600">Skill</span
					>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.normalEq.multipliers.toFixed(3)}</span
					><span class="block text-[9px] text-slate-600">GearMult</span>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.normalEq.enemy.toFixed(2)}</span><span
						class="block text-[9px] text-slate-600">EnemyDR</span
					>
				</div>
				{#if player.isVulnerable}
					<span class="font-bold text-orange-500">×</span>
					<div class="text-center">
						<span class="font-medium text-emerald-400"
							>{player.breakdown.normalEq.vulnBase.toFixed(1)}</span
						><span class="block text-[9px] text-slate-600">VulnBase</span>
					</div>
				{/if}
				<span class="font-bold text-slate-500">=</span>
				<span
					class="rounded-sm border border-emerald-900/30 bg-emerald-950/30 px-1 text-xs font-bold text-emerald-400"
					>{formatNumber(player.normalDamage)}</span
				>
			</div>
		</div>

		<div class="space-y-1">
			<span class="block font-sans text-[10px] font-semibold text-orange-400/80 uppercase"
				>Crit Hit Formula:</span
			>
			<div
				class="flex flex-wrap items-center gap-x-2 gap-y-1 overflow-x-auto rounded-sm border border-slate-800/50 bg-slate-950/80 p-2 text-slate-300"
			>
				<div class="text-center">
					<span class="font-bold text-white">{player.breakdown.critEq.weaponDmg}</span><span
						class="block text-[9px] text-slate-600">WpnDmg</span
					>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.critEq.additives.toFixed(3)}</span><span
						class="block text-[9px] text-slate-600">Additive</span
					>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.critEq.skill.toFixed(3)}</span><span
						class="block text-[9px] text-slate-600">Skill</span
					>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.critEq.multipliers.toFixed(3)}</span><span
						class="block text-[9px] text-slate-600">GearMult</span
					>
				</div>
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="text-slate-200">{player.breakdown.critEq.enemy.toFixed(2)}</span><span
						class="block text-[9px] text-slate-600">EnemyDR</span
					>
				</div>
				{#if player.isVulnerable}
					<span class="font-bold text-orange-500">×</span>
					<div class="text-center">
						<span class="font-medium text-emerald-400"
							>{player.breakdown.critEq.vulnBase.toFixed(1)}</span
						><span class="block text-[9px] text-slate-600">VulnBase</span>
					</div>
				{/if}
				<span class="font-bold text-orange-500">×</span>
				<div class="text-center">
					<span class="font-medium text-amber-400"
						>{player.breakdown.critEq.critBase.toFixed(1)}</span
					><span class="block text-[9px] text-slate-600">CritBase</span>
				</div>
				<span class="font-bold text-slate-500">=</span>
				<span
					class="rounded-sm border border-orange-900/30 bg-orange-950/30 px-1 text-xs font-bold text-orange-400"
					>{formatNumber(player.critDamage)}</span
				>
			</div>
		</div>
	</section>

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
					+{formatNumber(player.getBaseGain('weaponDmg', WEAPON_STEP))}
					<span class="text-[9px] text-slate-500">per {WEAPON_STEP}</span>
				</span>
			</div>

			<div
				class="grid grid-cols-12 items-center gap-2 rounded-sm border border-slate-800/60 bg-slate-950/20 px-2 py-1 transition-colors hover:bg-slate-800/50"
			>
				<label for="critChance" class="col-span-5 text-xs font-medium text-slate-300"
					>Critical Strike Chance</label
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
					+{formatNumber(player.getBaseGain('critChance', 5))}
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
					+{formatNumber(player.getBaseGain('skillDamage', STAT_STEP))}
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
					+{formatNumber(player.getBaseGain('skillCoeff', 5))}
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
					+{formatNumber(player.getBaseGain('enemyDR', 5))}
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
