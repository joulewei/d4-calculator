// src/lib/characterClass.svelte.ts

export interface Stat {
	value: number;
	displayName: string;
}

export interface ConditionalMultiplier {
	active: boolean;
	value: number;
	displayName: string;
	isCrit: boolean;
}

export interface CalculationBreakdown {
	normalHit: number;
	critHit: number;
	averageDmg: number;
	normalEq: {
		weaponDmg: number;
		additives: number;
		skill: number;
		multipliers: number;
		enemy: number;
		vulnBase: number;
	};
	critEq: {
		weaponDmg: number;
		additives: number;
		skill: number;
		multipliers: number;
		enemy: number;
		vulnBase: number;
		critBase: number;
	};
}

export class Character {
	// Base Stats
	public weaponDmg = $state(36);
	public skillDamage = $state(102);
	public skillCoeff = $state(67);
	public critChance = $state(50);
	public enemyDR = $state(20);

	public isVulnerable = $state(false);

	private critBaseDamage = 1.5;
	private vulnerableBaseDamage = 1.2;

	public additives: { [key: string]: Stat } = $state({
		physical: { value: 0, displayName: 'Physical Damage' },
		element: { value: 0, displayName: 'Elemental Damage' },
		critDmg: { value: 0, displayName: 'Critical Strike Damage' },
		vulnerable: { value: 0, displayName: 'Vulnerable Damage' },
		overpower: { value: 0, displayName: 'Overpower Damage' },
		allDmg: { value: 0, displayName: 'All Damage' },
		cutthroat: { value: 0, displayName: 'Cutthroat Damage' }
	});

	public multiplier: { [key: string]: Stat } = $state({
		allDmgPhys: { value: 0, displayName: 'All Dmg + Phys M' },
		chipPhys: { value: 0, displayName: 'Chip Phys' },
		critDmgM: { value: 0, displayName: 'Critical Strike Damage M' },
		chipMulti: { value: 0, displayName: 'Chip Multi' },
		vulnerableMulti: { value: 0, displayName: 'Vulnerable Damage Multiplier' }
	});

	public additionalMultipliers: { [key: string]: ConditionalMultiplier } = $state({
		heirOfPerdition: {
			active: false,
			value: 80,
			displayName: 'Heir of Perdition (Mythic)',
			isCrit: false
		},
		grandfather: { active: false, value: 150, displayName: 'Grandfather', isCrit: true },
		crownOfLucion: { active: false, value: 75, displayName: 'Crown of Lucion', isCrit: false }
	});

	public getSnapshot() {
		return JSON.parse(
			JSON.stringify({
				weaponDmg: this.weaponDmg,
				skillDamage: this.skillDamage,
				skillCoeff: this.skillCoeff,
				critChance: this.critChance,
				enemyDR: this.enemyDR,
				isVulnerable: this.isVulnerable,
				additives: this.additives,
				multiplier: this.multiplier,
				additionalMultipliers: this.additionalMultipliers
			})
		);
	}

	private _calculateBreakdown(snap: any): CalculationBreakdown {
		const skillMult = (1 + snap.skillDamage / 100) * (snap.skillCoeff / 100);
		const enemyFactor = snap.enemyDR / 100;
		const vulnBaseFactor = snap.isVulnerable ? this.vulnerableBaseDamage : 1;
		const critBaseFactor = this.critBaseDamage;

		// --- 1. NON-CRIT PATH ---
		// FIXED: Filter out vulnerable items if target is not vulnerable
		const sumAdditivesNormal = Object.entries(snap.additives)
			.filter(([key]) => key !== 'critDmg')
			.filter(([key]) => snap.isVulnerable || key !== 'vulnerable')
			.reduce((acc, [_, stat]: any) => acc + stat.value, 0);

		const prodFactorsNormal = Object.entries(snap.multiplier)
			.filter(([key]) => key !== 'critDmgM')
			.filter(([key]) => snap.isVulnerable || key !== 'vulnerableMulti')
			.reduce((acc, [_, stat]: any) => acc * (1 + stat.value / 100), 1);

		const prodAdditionalNormal = Object.values(snap.additionalMultipliers)
			.filter((m: any) => m.active && !m.isCrit)
			.reduce((acc: number, m: any) => acc * (1 + m.value / 100), 1);

		const totalMultNormal = prodFactorsNormal * prodAdditionalNormal;
		const normalHit =
			snap.weaponDmg *
			(1 + sumAdditivesNormal / 100) *
			skillMult *
			totalMultNormal *
			enemyFactor *
			vulnBaseFactor;

		// --- 2. CRIT PATH ---
		// FIXED: Filter out vulnerable items if target is not vulnerable
		const sumAdditivesCrit = Object.entries(snap.additives)
			.filter(([key]) => snap.isVulnerable || key !== 'vulnerable')
			.reduce((acc: number, [_, stat]: any) => acc + stat.value, 0);

		const prodFactorsCrit = Object.entries(snap.multiplier)
			.filter(([key]) => snap.isVulnerable || key !== 'vulnerableMulti')
			.reduce((acc: number, [_, stat]: any) => acc * (1 + stat.value / 100), 1);

		const prodAdditionalCritAll = Object.values(snap.additionalMultipliers)
			.filter((m: any) => m.active)
			.reduce((acc: number, m: any) => acc * (1 + m.value / 100), 1);

		const totalMultCrit = prodFactorsCrit * prodAdditionalCritAll;
		const critHit =
			snap.weaponDmg *
			(1 + sumAdditivesCrit / 100) *
			skillMult *
			totalMultCrit *
			enemyFactor *
			vulnBaseFactor *
			critBaseFactor;

		// --- 3. WEIGHTED AVERAGE ---
		const cc = Math.min(Math.max(snap.critChance, 0), 100) / 100;
		const averageDmg = (1 - cc) * normalHit + cc * critHit;

		return {
			normalHit,
			critHit,
			averageDmg,
			normalEq: {
				weaponDmg: snap.weaponDmg,
				additives: 1 + sumAdditivesNormal / 100,
				skill: skillMult,
				multipliers: totalMultNormal,
				enemy: enemyFactor,
				vulnBase: vulnBaseFactor
			},
			critEq: {
				weaponDmg: snap.weaponDmg,
				additives: 1 + sumAdditivesCrit / 100,
				skill: skillMult,
				multipliers: totalMultCrit,
				enemy: enemyFactor,
				vulnBase: vulnBaseFactor,
				critBase: critBaseFactor
			}
		};
	}

	get breakdown() {
		return this._calculateBreakdown(this.getSnapshot());
	}
	get currentDamage() {
		return this.breakdown.averageDmg;
	}
	get normalDamage() {
		return this.breakdown.normalHit;
	}
	get critDamage() {
		return this.breakdown.critHit;
	}

	private _getGain(modifier: (snap: any) => void): number {
		const snap = this.getSnapshot();
		const baseDmg = this._calculateBreakdown(snap).averageDmg;
		modifier(snap);
		const upgradedDmg = this._calculateBreakdown(snap).averageDmg;
		return upgradedDmg - baseDmg;
	}

	public getBaseGain(
		field: 'weaponDmg' | 'skillDamage' | 'skillCoeff' | 'critChance' | 'enemyDR',
		step: number
	): number {
		return this._getGain((snap) => (snap[field] += step));
	}

	public getAdditiveGain(key: string, step: number = 10): number {
		return this._getGain((snap) => (snap.additives[key].value += step));
	}

	public getMultiplierGain(key: string, step: number = 10): number {
		return this._getGain((snap) => (snap.multiplier[key].value += step));
	}

	private _getTotalContribution(modifier: (snap: any) => void): number {
		const snap = this.getSnapshot();
		const currentDmg = this._calculateBreakdown(snap).averageDmg;
		modifier(snap);
		const zeroedDmg = this._calculateBreakdown(snap).averageDmg;
		return currentDmg - zeroedDmg;
	}

	public getAdditiveTotalGain(key: string): number {
		return this._getTotalContribution((snap) => (snap.additives[key].value = 0));
	}

	public getMultiplierTotalGain(key: string): number {
		return this._getTotalContribution((snap) => (snap.multiplier[key].value = 0));
	}

	public getAdditionalMultiplierTotalGain(key: string): number {
		const snapActive = this.getSnapshot();
		snapActive.additionalMultipliers[key].active = true;
		const snapInactive = this.getSnapshot();
		snapInactive.additionalMultipliers[key].active = false;
		return (
			this._calculateBreakdown(snapActive).averageDmg -
			this._calculateBreakdown(snapInactive).averageDmg
		);
	}

	public loadSnapshot(snap: any) {
		this.weaponDmg = snap.weaponDmg;
		this.skillDamage = snap.skillDamage;
		this.skillCoeff = snap.skillCoeff;
		this.critChance = snap.critChance;
		this.enemyDR = snap.enemyDR;
		this.isVulnerable = snap.isVulnerable;

		for (const key in snap.additives) {
			if (this.additives[key]) this.additives[key].value = snap.additives[key].value;
		}
		for (const key in snap.multiplier) {
			if (this.multiplier[key]) this.multiplier[key].value = snap.multiplier[key].value;
		}
		for (const key in snap.additionalMultipliers) {
			if (this.additionalMultipliers[key]) {
				this.additionalMultipliers[key].value = snap.additionalMultipliers[key].value;
				this.additionalMultipliers[key].active = snap.additionalMultipliers[key].active;
			}
		}
	}

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
