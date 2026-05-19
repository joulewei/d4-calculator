<script lang="ts">
    import { Character } from '$lib/characterClass.svelte';

    const player = new Character();
    const STAT_STEP = 10;        
    const WEAPON_STEP = 100;     

    let newAdditiveName = $state("");
    let newMultiplierName = $state("");

    function formatNumber(num: number): string {
        return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }

    function handleAddAdditive() {
        player.addCustomAdditive(newAdditiveName);
        newAdditiveName = "";
    }

    function handleAddMultiplier() {
        player.addCustomMultiplier(newMultiplierName);
        newMultiplierName = "";
    }
</script>

<main class="p-4 max-w-5xl mx-auto space-y-4 bg-slate-900 text-slate-200 min-h-screen font-sans antialiased">
    
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-2 gap-2">
        <h1 class="text-xl font-bold tracking-tight text-orange-500 flex items-center gap-2">
            ⚔️ Diablo 4 Stat Calculator
        </h1>
        
        <div class="bg-orange-950/40 border border-orange-800/60 px-4 py-1.5 rounded-sm flex items-center gap-4 shadow-inner">
            <span class="text-xs uppercase tracking-wider text-orange-300 font-semibold">Total Expected Damage:</span>
            <span class="text-xl font-mono font-bold text-orange-400">
                {formatNumber(player.currentDamage)}
            </span>
        </div>
    </header>

    <section class="bg-slate-800/40 border border-slate-800 p-2 rounded-sm shadow-sm">
        <h2 class="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 border-b border-slate-800 pb-1">Base Stats</h2>
        <div class="flex flex-col gap-1">
            
            <div class="grid grid-cols-12 items-center gap-2 bg-slate-950/20 hover:bg-slate-800/50 px-2 py-1 border border-slate-800/60 rounded-sm transition-colors">
                <label for="weaponDmg" class="col-span-5 text-xs font-medium text-slate-300">Weapon Damage</label>
                <div class="col-span-2 relative flex items-center">
                    <input 
                        id="weaponDmg"
                        type="number" 
                        bind:value={player.weaponDmg} 
                        class="w-full bg-slate-950 border border-slate-700 rounded-sm p-0.5 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                </div>
                <span class="col-span-5 text-right font-mono text-[11px] text-green-400 font-medium">
                    +{formatNumber(player.getWeaponDmgGain(WEAPON_STEP))} <span class="text-[9px] text-slate-500">per {WEAPON_STEP}</span>
                </span>
            </div>

            <div class="grid grid-cols-12 items-center gap-2 bg-slate-950/20 hover:bg-slate-800/50 px-2 py-1 border border-slate-800/60 rounded-sm transition-colors">
                <label for="critChance" class="col-span-5 text-xs font-medium text-slate-300">Crit Chance</label>
                <div class="col-span-2 relative flex items-center">
                    <input 
                        id="critChance"
                        type="number" 
                        bind:value={player.critChance} 
                        class="w-full bg-slate-950 border border-slate-700 rounded-sm p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                    <span class="absolute right-1 text-[10px] text-slate-500 font-mono">%</span>
                </div>
                <span class="col-span-5 text-right font-mono text-[11px] text-green-400 font-medium">
                    +{formatNumber(player.getCritChanceGain(5))} <span class="text-[9px] text-slate-500">per 5%</span>
                </span>
            </div>

            <div class="grid grid-cols-12 items-center gap-2 bg-slate-950/20 hover:bg-slate-800/50 px-2 py-1 border border-slate-800/60 rounded-sm transition-colors">
                <label for="skillDamage" class="col-span-5 text-xs font-medium text-slate-300">Skill Damage</label>
                <div class="col-span-2 relative flex items-center">
                    <input 
                        id="skillDamage"
                        type="number" 
                        bind:value={player.skillDamage} 
                        class="w-full bg-slate-950 border border-slate-700 rounded-sm p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                    <span class="absolute right-1 text-[10px] text-slate-500 font-mono">%</span>
                </div>
                <span class="col-span-5 text-right font-mono text-[11px] text-green-400 font-medium">
                    +{formatNumber(player.getSkillDamageGain(10))} <span class="text-[9px] text-slate-500">per 10%</span>
                </span>
            </div>

            <div class="grid grid-cols-12 items-center gap-2 bg-slate-950/20 hover:bg-slate-800/50 px-2 py-1 border border-slate-800/60 rounded-sm transition-colors">
                <label for="skillCoeff" class="col-span-5 text-xs font-medium text-slate-300">Skill Coeff.</label>
                <div class="col-span-2 relative flex items-center">
                    <input 
                        id="skillCoeff"
                        type="number" 
                        bind:value={player.skillCoeff} 
                        class="w-full bg-slate-950 border border-slate-700 rounded-sm p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                    <span class="absolute right-1 text-[10px] text-slate-500 font-mono">%</span>
                </div>
                <span class="col-span-5 text-right font-mono text-[11px] text-green-400 font-medium">
                    +{formatNumber(player.getSkillCoeffGain(5))} <span class="text-[9px] text-slate-500">per 5%</span>
                </span>
            </div>

        </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <section class="bg-slate-800/40 border border-slate-800 p-2 rounded-sm flex flex-col gap-1 shadow-sm">
            <h2 class="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 border-b border-slate-800 pb-1">Additive Stats (+)</h2>
            
            <div class="flex flex-col gap-1 mb-2">
                {#each Object.keys(player.additives) as key}
                    <div class="grid grid-cols-12 items-center gap-2 bg-slate-950/20 hover:bg-slate-800/50 px-2 py-1 border border-slate-800/60 rounded-sm transition-colors">
                        <label for={key} class="col-span-5 text-xs font-medium text-slate-300 truncate">
                            {player.additives[key].displayName}
                        </label>
                        <div class="col-span-2 relative flex items-center">
                            <input 
                                id={key}
                                type="number" 
                                bind:value={player.additives[key].value} 
                                class="w-full bg-slate-950 border border-slate-700 rounded-sm p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
                            />
                            <span class="absolute right-1 text-[10px] text-slate-500 font-mono">%</span>
                        </div>
                        <span class="col-span-2 text-right font-mono text-[11px] text-green-400 font-medium">
                            +{formatNumber(player.getAdditiveGain(key, STAT_STEP))}<span class="text-[9px] text-slate-500">/10%</span>
                        </span>
                        <span class="col-span-3 text-right font-mono text-[11px] text-emerald-500 font-medium border-l border-slate-800/50 pl-1">
                            +{formatNumber(player.getAdditiveTotalGain(key))}<span class="text-[9px] text-slate-500"> total</span>
                        </span>
                    </div>
                {/each}
            </div>

            <div class="flex gap-1 border-t border-slate-800/60 pt-2 mt-auto">
                <input 
                    type="text" 
                    placeholder="Add custom additive stat..." 
                    bind:value={newAdditiveName}
                    onkeydown={(e) => e.key === 'Enter' && handleAddAdditive()}
                    class="w-full bg-slate-950 border border-slate-800 rounded-sm px-2 py-1 text-xs text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
                />
                <button onclick={handleAddAdditive} class="bg-slate-800 hover:bg-orange-600 border border-slate-700 text-white px-3 py-1 rounded-sm text-xs font-bold transition-colors">+</button>
            </div>
        </section>

        <div class="space-y-4">
            
            <section class="bg-slate-800/40 border border-slate-800 p-2 rounded-sm flex flex-col gap-1 shadow-sm">
                <h2 class="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 border-b border-slate-800 pb-1">Multiplicative Stats (x)</h2>
                
                <div class="flex flex-col gap-1 mb-2">
                    {#each Object.keys(player.multiplier) as key}
                        <div class="grid grid-cols-12 items-center gap-2 bg-slate-950/20 hover:bg-slate-800/50 px-2 py-1 border border-slate-800/60 rounded-sm transition-colors">
                            <label for={key} class="col-span-5 text-xs font-medium text-slate-300 truncate">
                                {player.multiplier[key].displayName}
                            </label>
                            <div class="col-span-2 relative flex items-center">
                                <input 
                                    id={key}
                                    type="number" 
                                    bind:value={player.multiplier[key].value} 
                                    class="w-full bg-slate-950 border border-slate-700 rounded-sm p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none"
                                />
                                <span class="absolute right-1 text-[10px] text-slate-500 font-mono">%</span>
                            </div>
                            <span class="col-span-2 text-right font-mono text-[11px] text-green-400 font-medium">
                                +{formatNumber(player.getMultiplierGain(key, STAT_STEP))}<span class="text-[9px] text-slate-500">/10%</span>
                            </span>
                            <span class="col-span-3 text-right font-mono text-[11px] text-emerald-500 font-medium border-l border-slate-800/50 pl-1">
                                +{formatNumber(player.getMultiplierTotalGain(key))}<span class="text-[9px] text-slate-500"> total</span>
                            </span>
                        </div>
                    {/each}
                </div>

                <div class="flex gap-1 border-t border-slate-800/60 pt-2 mt-auto">
                    <input 
                        type="text" 
                        placeholder="Add custom multiplicative stat..." 
                        bind:value={newMultiplierName}
                        onkeydown={(e) => e.key === 'Enter' && handleAddMultiplier()}
                        class="w-full bg-slate-950 border border-slate-800 rounded-sm px-2 py-1 text-xs text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
                    />
                    <button onclick={handleAddMultiplier} class="bg-slate-800 hover:bg-orange-600 border border-slate-700 text-white px-3 py-1 rounded-sm text-xs font-bold transition-colors">+</button>
                </div>
            </section>

            <section class="bg-slate-800/40 border border-slate-800 p-2 rounded-sm flex flex-col gap-1 shadow-sm">
                <h2 class="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 border-b border-slate-800 pb-1">Conditional Toggles</h2>
                
                <div class="flex flex-col gap-1">
                    {#each Object.keys(player.additionalMultipliers) as key}
                        <div class="grid grid-cols-12 items-center gap-2 bg-slate-950/20 hover:bg-slate-800/50 px-2 py-1 border border-slate-800/60 rounded-sm transition-colors">
                            <label class="col-span-7 flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer truncate">
                                <input 
                                    type="checkbox" 
                                    bind:checked={player.additionalMultipliers[key].active}
                                    class="w-3 h-3 rounded bg-slate-950 border-slate-700 text-orange-500 focus:ring-0"
                                />
                                {player.additionalMultipliers[key].displayName}
                            </label>
                            <div class="col-span-2 relative flex items-center">
                                <input 
                                    type="number" 
                                    bind:value={player.additionalMultipliers[key].value} 
                                    disabled={!player.additionalMultipliers[key].active}
                                    class="w-full bg-slate-950 border border-slate-700 rounded-sm p-0.5 pr-4 text-right font-mono text-xs text-white focus:border-orange-500 focus:outline-none disabled:opacity-30"
                                />
                                <span class="absolute right-1 text-[10px] text-slate-500 font-mono">%</span>
                            </div>
                            <span class="col-span-3 text-right font-mono text-[11px] text-green-400 font-medium">
                                +{formatNumber(player.getAdditionalMultiplierTotalGain(key))} <span class="text-[9px] text-slate-500">total</span>
                            </span>
                        </div>
                    {/each}
                </div>
            </section>
            
        </div>
    </div>
</main>