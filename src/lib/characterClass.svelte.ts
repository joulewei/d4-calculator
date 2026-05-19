// src/lib/characterClass.svelte.ts

interface Stat {
	value: number;
	displayName: string;
}

interface ConditionalMultiplier {
	active: boolean;
	value: number;
	displayName: string;
	isCrit: boolean;
}

export class Character {
	public mainStat = $state(2500);
	public weaponDmg = $state(4500);

	// Core mechanical stats
	public critChance = $state(50);
	public skillDamage = $state(50);
	public skillCoeff = $state(30);

	private critBaseDamage = 1.5;
	private vulnerableBaseDamage = 1.2;

	public additives: { [key: string]: Stat } = $state({
		element: { value: 50, displayName: 'Elemental Damage' },
		critDmg: { value: 150, displayName: 'Critical Strike Damage' }, // Only applies on Crits
		vulnerable: { value: 50, displayName: 'Vulnerable Damage' },
		overpower: { value: 50, displayName: 'Overpower Damage' },
		allDmg: { value: 30, displayName: 'All Damage' },
		misc: { value: 40, displayName: 'Other Additive Bonuses' }
	});

	public multiplier: { [key: string]: Stat } = $state({
		allDmg: { value: 50, displayName: 'Global Multiplier (x)' },
		element: { value: 10, displayName: 'Elemental Multiplier (x)' },
		critDmg: { value: 20, displayName: 'Crit Multiplier (x)' }, // Only applies on Crits
		vulnerable: { value: 30, displayName: 'Vulnerable Multiplier (x)' },
		misc: { value: 15, displayName: 'Other Multipliers (x)' }
	});

	public additionalMultipliers: { [key: string]: ConditionalMultiplier } = $state({
		heirOfPerdition: {
			active: true,
			value: 80,
			displayName: 'Heir of Perdition (Mythic)',
			isCrit: false
		},
		grandfather: { active: false, value: 150, displayName: 'Grandfather', isCrit: true },
		crownOfLucion: { active: false, value: 75, displayName: 'Crown of Lucion', isCrit: false }
	});

	// Splitting the calculation into a weighted average of Non-Crits and Crits
	private _calculate(
		additives = this.additives,
		multiplier = this.multiplier,
		additional = this.additionalMultipliers,
		weaponDmg = this.weaponDmg,
		critChance = this.critChance,
		skillDamage = this.skillDamage,
		skillCoeff = this.skillCoeff
	) {
		const prodAdditionalNormal = Object.values(additional)
			.filter((m) => m.active)
			.filter((m) => !m.isCrit)
			.reduce((acc, m) => acc * (1 + m.value / 100), 1);

		const prodAdditionalCrit = Object.values(additional)
			.filter((m) => m.active)
			.filter((m) => m.isCrit)
			.reduce((acc, m) => acc * (1 + m.value / 100), 1);

		const skillMult = (1 + skillDamage / 100) * (skillCoeff / 100);

		// --- 1. NON-CRIT DAMAGE ---
		const sumAdditivesNormal =
			Object.entries(additives)
				.filter(([key]) => key !== 'critDmg')
				.reduce((acc, [_, stat]) => acc + stat.value, 0) / 100;

		const prodFactorsNormal = Object.entries(multiplier)
			.filter(([key]) => key !== 'critDmg')
			.reduce((acc, [_, stat]) => acc * (1 + stat.value / 100), 1);

		const normalDamage =
			weaponDmg *
			(1 + sumAdditivesNormal) *
			skillMult *
			prodFactorsNormal *
			prodAdditionalNormal *
			this.vulnerableBaseDamage;

		// --- 2. CRIT DAMAGE ---
		const sumAdditivesCrit =
			Object.values(additives).reduce((acc, stat) => acc + stat.value, 0) / 100;
		const prodFactorsCrit = Object.values(multiplier).reduce(
			(acc, stat) => acc * (1 + stat.value / 100),
			1
		);

		const critDamage =
			weaponDmg *
			(1 + sumAdditivesCrit) *
			skillMult *
			prodFactorsCrit *
			prodAdditionalNormal *
			prodAdditionalCrit *
			this.critBaseDamage;

		// --- 3. WEIGHTED AVERAGE ---
		const cc = Math.min(Math.max(critChance, 0), 100) / 100;
		return (1 - cc) * normalDamage + cc * critDamage;
	}

	get currentDamage() {
		return this._calculate();
	}

	// Upgrade simulations for Base Stats
	public getWeaponDmgGain(step: number = 100): number {
		return (
			this._calculate(
				this.additives,
				this.multiplier,
				this.additionalMultipliers,
				this.weaponDmg + step
			) - this.currentDamage
		);
	}

	public getCritChanceGain(step: number = 5): number {
		return (
			this._calculate(
				this.additives,
				this.multiplier,
				this.additionalMultipliers,
				this.weaponDmg,
				this.critChance + step
			) - this.currentDamage
		);
	}

	public getSkillDamageGain(step: number = 10): number {
		return (
			this._calculate(
				this.additives,
				this.multiplier,
				this.additionalMultipliers,
				this.weaponDmg,
				this.critChance,
				this.skillDamage + step
			) - this.currentDamage
		);
	}

	public getSkillCoeffGain(step: number = 5): number {
		return (
			this._calculate(
				this.additives,
				this.multiplier,
				this.additionalMultipliers,
				this.weaponDmg,
				this.critChance,
				this.skillDamage,
				this.skillCoeff + step
			) - this.currentDamage
		);
	}

	// Upgrade simulations for Core Lists
	public getAdditiveGain(key: string, step: number = 10): number {
		const virtualAdditives = {
			...this.additives,
			[key]: { ...this.additives[key], value: this.additives[key].value + step }
		};
		return this._calculate(virtualAdditives, this.multiplier) - this.currentDamage;
	}

	public getMultiplierGain(key: string, step: number = 10): number {
		const virtualMultiplier = {
			...this.multiplier,
			[key]: { ...this.multiplier[key], value: this.multiplier[key].value + step }
		};
		return this._calculate(this.additives, virtualMultiplier) - this.currentDamage;
	}

	// Total Contribution methods
	public getAdditiveTotalGain(key: string): number {
		const virtualZero = { ...this.additives, [key]: { ...this.additives[key], value: 0 } };
		return this.currentDamage - this._calculate(virtualZero);
	}

	public getMultiplierTotalGain(key: string): number {
		const virtualZero = { ...this.multiplier, [key]: { ...this.multiplier[key], value: 0 } };
		return this.currentDamage - this._calculate(this.additives, virtualZero);
	}

	public getAdditionalMultiplierTotalGain(key: string): number {
		const virtualActive = {
			...this.additionalMultipliers,
			[key]: { ...this.additionalMultipliers[key], active: true }
		};
		const virtualInactive = {
			...this.additionalMultipliers,
			[key]: { ...this.additionalMultipliers[key], active: false }
		};
		return (
			this._calculate(this.additives, this.multiplier, virtualActive) -
			this._calculate(this.additives, this.multiplier, virtualInactive)
		);
	}

	// Custom stat addition handlers
	public addCustomAdditive(displayName: string, initialValue: number = 0) {
		if (!displayName.trim()) return;
		this.additives['custom_add_' + Date.now()] = {
			value: initialValue,
			displayName: displayName.trim()
		};
	}

	public addCustomMultiplier(displayName: string, initialValue: number = 0) {
		if (!displayName.trim()) return;
		this.multiplier['custom_mult_' + Date.now()] = {
			value: initialValue,
			displayName: displayName.trim()
		};
	}
}
