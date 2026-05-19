// src/lib/characterClass.svelte.ts

interface Stat {
    value: number;
    displayName: string;
}

interface ConditionalMultiplier {
    active: boolean;
    value: number;
    displayName: string;
}

export class Character {
    public mainStat = $state(2500);
    public weaponDmg = $state(4500);
    
    public critChance = $state(50);
    public skillDamage = $state(50);
    public skillCoeff = $state(30);

    // Additive stats now include their clean display name
    public additives: { [key: string]: Stat } = $state({
        element: { value: 50, displayName: "Elemental Damage" },
        critDmg: { value: 150, displayName: "Critical Strike Damage" },
        vulnerable: { value: 50, displayName: "Vulnerable Damage" },
        overpower: { value: 50, displayName: "Overpower Damage" },
        allDmg: { value: 30, displayName: "All Damage" },
        misc: { value: 40, displayName: "Other Additive Bonuses" }
    });

    // Multipliers now include their clean display name
    public multiplier: { [key: string]: Stat } = $state({
        allDmg: { value: 50, displayName: "Global Multiplier (x)" },
        element: { value: 10, displayName: "Elemental Multiplier (x)" },
        critDmg: { value: 20, displayName: "Skill Crit Multiplier (x)" },
        critDmgBase: { value: 50, displayName: "Base Crit Multiplier (x)" },
        vulerableBase: { value: 20, displayName: "Base Vulnerable Multiplier (x)" },
        vulnerable: { value: 30, displayName: "Skill Vulnerable Multiplier (x)" },
        glyphs: { value: 50, displayName: "Paragon Glyphs (x)" },
        misc: { value: 15, displayName: "Other Multipliers (x)" }
    });

    public additionalMultipliers: { [key: string]: ConditionalMultiplier } = $state({
        heirOfPerdition: { active: true, value: 80, displayName: "Heir of Perdition (Mythic)" },
    });

    // Internal calculation reads '.value' from the objects
    private _calculate(
        additives = this.additives, 
        multiplier = this.multiplier, 
        additional = this.additionalMultipliers,
        weaponDmg = this.weaponDmg
    ) {
        const sumAdditives = Object.values(additives).reduce((acc, stat) => acc + stat.value, 0) / 100;
        const prodFactors = Object.values(multiplier).reduce((acc, stat) => acc * (1 + stat.value / 100), 1);
        
        const prodAdditional = Object.values(additional)
            .filter(m => m.active)
            .reduce((acc, m) => acc * (1 + m.value / 100), 1);

        return (
            weaponDmg * 
            (1 + sumAdditives) * 
            (1 + this.skillDamage / 100) * 
            (this.skillCoeff / 100) * 
            prodFactors * 
            prodAdditional
        );
    }

    get currentDamage() {
        return this._calculate();
    }

    public getWeaponDmgGain(step: number = 100): number {
        return this._calculate(this.additives, this.multiplier, this.additionalMultipliers, this.weaponDmg + step) - this.currentDamage;
    }

    public getAdditiveGain(key: string, step: number = 10): number {
        const virtualAdditives = { 
            ...this.additives, 
            [key]: { ...this.additives[key], value: this.additives[key].value + step } 
        };
        return this._calculate(virtualAdditives, this.multiplier, this.additionalMultipliers) - this.currentDamage;
    }

    public getMultiplierGain(key: string, step: number = 10): number {
        const virtualMultiplier = { 
            ...this.multiplier, 
            [key]: { ...this.multiplier[key], value: this.multiplier[key].value + step } 
        };
        return this._calculate(this.additives, virtualMultiplier, this.additionalMultipliers) - this.currentDamage;
    }

    public getAdditionalMultiplierGain(key: string, step: number = 10): number {
        if (!this.additionalMultipliers[key].active) return 0;

        const virtualAdditional = {
            ...this.additionalMultipliers,
            [key]: { ...this.additionalMultipliers[key], value: this.additionalMultipliers[key].value + step }
        };
        return this._calculate(this.additives, this.multiplier, virtualAdditional) - this.currentDamage;
    }

	/**
	 * Calculates the total damage gained by having this conditional multiplier active
	 * at its current full value compared to it being 0% (or inactive).
	 */
	public getAdditionalMultiplierTotalGain(key: string): number {
		// 1. Simulate damage with this buff forced to ACTIVE
		const virtualActive = {
			...this.additionalMultipliers,
			[key]: { ...this.additionalMultipliers[key], active: true }
		};
		const dmgWithBuff = this._calculate(this.additives, this.multiplier, virtualActive);

		// 2. Simulate damage with this buff forced to INACTIVE
		const virtualInactive = {
			...this.additionalMultipliers,
			[key]: { ...this.additionalMultipliers[key], active: false }
		};
		const dmgWithoutBuff = this._calculate(this.additives, this.multiplier, virtualInactive);

		// The total value of this buff is simply the difference
		return dmgWithBuff - dmgWithoutBuff;
	}

	public addCustomAdditive(displayName: string, initialValue: number = 0) {
		if (!displayName.trim()) return;
		const key = "custom_add_" + Date.now(); // Unique key
		this.additives[key] = { value: initialValue, displayName: displayName.trim() };
	}

	/**
	 * Adds a custom multiplicative stat dynamically
	 */
	public addCustomMultiplier(displayName: string, initialValue: number = 0) {
		if (!displayName.trim()) return;
		const key = "custom_mult_" + Date.now(); // Unique key
		this.multiplier[key] = { value: initialValue, displayName: displayName.trim() };
	}

	/**
	 * Calculates the total damage contributed by this additive stat's current value.
	 */
	public getAdditiveTotalGain(key: string): number {
		const virtualZero = { 
			...this.additives, 
			[key]: { ...this.additives[key], value: 0 } 
		};
		return this.currentDamage - this._calculate(virtualZero, this.multiplier, this.additionalMultipliers);
	}

	/**
	 * Calculates the total damage contributed by this multiplier's current value.
	 */
	public getMultiplierTotalGain(key: string): number {
		const virtualZero = { 
			...this.multiplier, 
			[key]: { ...this.multiplier[key], value: 0 } 
		};
		return this.currentDamage - this._calculate(this.additives, virtualZero, this.additionalMultipliers);
	}
}