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
	// Base Stats
	public weaponDmg = $state(3500);
	public skillDamage = $state(50);
	public skillCoeff = $state(250);
	public critChance = $state(75); // Re-added for average damage optimization
	public enemyDR = $state(20);    // Enemy Damage Factor (e.g. 20%)

	public isVulnerable = $state(false);

	private critBaseDamage = 1.5;
	private vulnerableBaseDamage = 1.2;

	public additives: { [key: string]: Stat } = $state({
        allDmg: { value: 30, displayName: 'All Damage' },
		physical: { value: 30, displayName: 'Physical Damage' },
		element: { value: 30, displayName: 'Elemental Damage' },
		critDmg: { value: 150, displayName: 'Critical Strike Damage' },
		vulnerable: { value: 40, displayName: 'Vulnerable Damage' },
	});

	public multiplier: { [key: string]: Stat } = $state({
		allDmgPhys: { value: 100, displayName: 'x All/Phys./Elem. Dmg' },
		critDmgM: { value: 450, displayName: 'x Critical Strike Damage M' },
		vulnerableMulti: { value: 150, displayName: 'x Vulnerable Damage' }
	});

	public additionalMultipliers: { [key: string]: ConditionalMultiplier } = $state({
		heirOfPerdition: { active: false, value: 80, displayName: 'Heir of Perdition (Mythic)', isCrit: false },
		grandfather: { active: false, value: 150, displayName: 'Grandfather', isCrit: true },
		crownOfLucion: { active: false, value: 75, displayName: 'Crown of Lucion', isCrit: false }
	});

	// Internal helper to get precise normal or crit hits
	private _calculateHit(
		isCrit: boolean,
		additives = this.additives,
		multiplier = this.multiplier,
		additional = this.additionalMultipliers,
		weaponDmg = this.weaponDmg,
		skillDamage = this.skillDamage,
		skillCoeff = this.skillCoeff,
		enemyDR = this.enemyDR,
		isVulnerable = this.isVulnerable
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

		if (!isCrit) {
			const sumAdditivesNormal = Object.entries(additives)
				.filter(([key]) => key !== 'critDmg')
				.reduce((acc, [_, stat]) => acc + stat.value, 0) / 100;

			const prodFactorsNormal = Object.entries(multiplier)
				.filter(([key]) => key !== 'critDmgM' && key !== 'combatCrit')
				.reduce((acc, [_, stat]) => acc * (1 + stat.value / 100), 1);

			return (
				weaponDmg *
				(1 + sumAdditivesNormal) *
				skillMult *
				prodFactorsNormal *
				prodAdditionalNormal *
				(enemyDR / 100) *
				(isVulnerable ? this.vulnerableBaseDamage : 1)
			);
		} else {
			const sumAdditivesCrit = Object.values(additives).reduce((acc, stat) => acc + stat.value, 0) / 100;
			const prodFactorsCrit = Object.values(multiplier).reduce((acc, stat) => acc * (1 + stat.value / 100), 1);

			return (
				weaponDmg *
				(1 + sumAdditivesCrit) *
				skillMult *
				prodFactorsCrit *
				prodAdditionalNormal *
				prodAdditionalCrit *
				(enemyDR / 100) *
				this.critBaseDamage *
				(isVulnerable ? this.vulnerableBaseDamage : 1)
			);
		}
	}

	// Main calculation method for weighted average damage
	private _calculate(
		additives = this.additives,
		multiplier = this.multiplier,
		additional = this.additionalMultipliers,
		weaponDmg = this.weaponDmg,
		skillDamage = this.skillDamage,
		skillCoeff = this.skillCoeff,
		enemyDR = this.enemyDR,
		critChance = this.critChance,
		isVulnerable = this.isVulnerable
	) {
		const normal = this._calculateHit(false, additives, multiplier, additional, weaponDmg, skillDamage, skillCoeff, enemyDR, isVulnerable);
		const crit = this._calculateHit(true, additives, multiplier, additional, weaponDmg, skillDamage, skillCoeff, enemyDR, isVulnerable);
		const cc = Math.min(Math.max(critChance, 0), 100) / 100;
		return (1 - cc) * normal + cc * crit;
	}

	get currentDamage() {
		return this._calculate();
	}

	get normalDamage() {
		return this._calculateHit(false);
	}

	get critDamage() {
		return this._calculateHit(true);
	}

	// Upgrade simulations based on Average/Expected Damage
	public getWeaponDmgGain(step: number = 100): number {
		return this._calculate(this.additives, this.multiplier, this.additionalMultipliers, this.weaponDmg + step) - this.currentDamage;
	}

	public getSkillDamageGain(step: number = 10): number {
		return this._calculate(this.additives, this.multiplier, this.additionalMultipliers, this.weaponDmg, this.skillDamage + step) - this.currentDamage;
	}

	public getSkillCoeffGain(step: number = 5): number {
		return this._calculate(this.additives, this.multiplier, this.additionalMultipliers, this.weaponDmg, this.skillDamage, this.skillCoeff + step) - this.currentDamage;
	}

	public getCritChanceGain(step: number = 5): number {
		return this._calculate(this.additives, this.multiplier, this.additionalMultipliers, this.weaponDmg, this.skillDamage, this.skillCoeff, this.enemyDR, this.critChance + step) - this.currentDamage;
	}

	public getEnemyDRGain(step: number = 5): number {
		return this._calculate(this.additives, this.multiplier, this.additionalMultipliers, this.weaponDmg, this.skillDamage, this.skillCoeff, this.enemyDR + step) - this.currentDamage;
	}

	public getAdditiveGain(key: string, step: number = 10): number {
		const virtualAdditives = { ...this.additives, [key]: { ...this.additives[key], value: this.additives[key].value + step } };
		return this._calculate(virtualAdditives, this.multiplier) - this.currentDamage;
	}

	public getMultiplierGain(key: string, step: number = 10): number {
		const virtualMultiplier = { ...this.multiplier, [key]: { ...this.multiplier[key], value: this.multiplier[key].value + step } };
		return this._calculate(this.additives, virtualMultiplier) - this.currentDamage;
	}

	public getAdditiveTotalGain(key: string): number {
		const virtualZero = { ...this.additives, [key]: { ...this.additives[key], value: 0 } };
		return this.currentDamage - this._calculate(virtualZero);
	}

	public getMultiplierTotalGain(key: string): number {
		const virtualZero = { ...this.multiplier, [key]: { ...this.multiplier[key], value: 0 } };
		return this.currentDamage - this._calculate(this.additives, virtualZero);
	}

	public getAdditionalMultiplierTotalGain(key: string): number {
		const virtualActive = { ...this.additionalMultipliers, [key]: { ...this.additionalMultipliers[key], active: true } };
		const virtualInactive = { ...this.additionalMultipliers, [key]: { ...this.additionalMultipliers[key], active: false } };
		return this._calculate(this.additives, this.multiplier, virtualActive) - this._calculate(this.additives, this.multiplier, virtualInactive);
	}

	public addCustomAdditive(displayName: string, initialValue: number = 0) {
		if (!displayName.trim()) return;
		this.additives['custom_add_' + Date.now()] = { value: initialValue, displayName: displayName.trim() };
	}

	public addCustomMultiplier(displayName: string, initialValue: number = 0) {
		if (!displayName.trim()) return;
		this.multiplier['custom_mult_' + Date.now()] = { value: initialValue, displayName: displayName.trim() };
	}
}