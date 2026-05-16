// src/data/positiveStatus.ts
export const positiveStatuses = {
  "positive_statuses": {
    "blessed": {
      "name_en": "Blessed",
      "description": "Divine grace grants a 1d4 bonus to attack rolls and saving throws.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "saving_throw_bonus": { "all": "1d4" },
        "attack_bonus_global": "1d4",
        "visual_auras": ["golden_runes"]
      }
    },
    "shielded": {
      "name_en": "Shielded",
      "description": "A shimmering magical barrier increases Armor Class by 2.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "ac_bonus": 2,
        "visual_auras": ["shimmering_barrier"]
      }
    },
    "invisible": {
      "name_en": "Invisible",
      "description": "Cloaked from sight. Grants advantage on stealth and makes the token semi-transparent.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "token_alpha": 0.4,
        "skill_advantage": ["stealth"],
        "visual_auras": ["purple_shroud"]
      }
    },
    "hasted": {
      "name_en": "Hasted",
      "description": "Blistering speed. Doubles movement speed, increases AC by 2, and grants an extra action.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "ac_bonus": 2,
        "speed_multiplier": 2.0,
        "saving_throw_advantage": ["dexterity"],
        "actions_per_round_bonus": 1,
        "visual_auras": ["speed_trails"]
      }
    },
    "longstrider": {
      "name_en": "Longstrider",
      "description": "Increases land speed by 10 feet.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "speed_bonus": 10,
        "visual_auras": ["wind_swirls"]
      }
    },
    "vigorous": {
      "name_en": "Vigorous",
      "description": "Grants a protective buffer of 10 temporary hit points.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "hp_temp_bonus": 10,
        "visual_auras": ["green_shield_overlay"]
      }
    },
    "inspired": {
      "name_en": "Inspired",
      "description": "Possesses bardic inspiration. Can be expended to add 1d6 to a check, attack, or save.",
      "duration": { "minutes": 10, "rounds": 100 },
      "effects": {
        "ability_check_bonus": { "any": "1d6" },
        "visual_auras": ["sparkling_crown"]
      }
    },
    "guided": {
      "name_en": "Guided",
      "description": "Mystic guidance adds 1d4 to ability checks.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "ability_check_bonus": { "all": "1d4" },
        "visual_auras": ["faint_blue_glint"]
      }
    },
    "hopeful": {
      "name_en": "Hopeful",
      "description": "Imbued with radiant hope. Gains advantage on Wisdom and Death saving throws, and maximizes all incoming healing.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "saving_throw_advantage": ["wisdom", "death"],
        "maximize_incoming_healing": true,
        "visual_auras": ["warm_golden_beacon"]
      }
    },
    "heroic": {
      "name_en": "Heroic",
      "description": "Imbued with supernatural bravery. Immune to the frightened condition and gains refreshing temporary hit points.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "condition_immunities": ["frightened"],
        "hp_temp_regen_per_round": 4,
        "visual_auras": ["fiery_heart"]
      }
    },
    "divinely_shielded": {
      "name_en": "Divinely Shielded",
      "description": "Shrouded in holy radiance. Grants advantage on all saving throws and resistance to radiant and necrotic damage.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "saving_throw_advantage": ["all"],
        "damage_resistances": ["radiant", "necrotic"],
        "visual_auras": ["blinding_white_light"]
      }
    },
    "sanctuary": {
      "name_en": "Sanctuary",
      "description": "Protected by a ward against aggression. Enemies must pass a Wisdom save to target this token.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "visual_auras": ["white_dove_aura"]
      }
    },
    "darkvision": {
      "name_en": "Darkvision",
      "description": "Grants the ability to see in mundane darkness, expanding the Fog of War reveal radius.",
      "duration": { "minutes": 480, "rounds": 4800 },
      "effects": {
        "darkvision_range_feet": 60,
        "fog_reveal_radius_bonus": 30
      }
    },
    "illuminated": {
      "name_en": "Illuminated",
      "description": "Carrying a torch or under a light spell, dynamically clearing the nearby Fog of War.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "fog_reveal_radius_bonus": 40,
        "visual_auras": ["warm_amber_glow"]
      }
    },
    "pass_without_trace": {
      "name_en": "Pass Without Trace",
      "description": "A shadowy veil masks the character, granting a +10 bonus to stealth checks.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "skill_bonus": { "stealth": 10 },
        "visual_auras": ["shadowy_smoke"]
      }
    },
    "regenerating": {
      "name_en": "Regenerating",
      "description": "Mystical energy mends wounds, healing 2 hit points at the start of each round.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "hp_regen_per_round": 2,
        "visual_auras": ["healing_vortex"]
      }
    },
    "bears_endurance": {
      "name_en": "Bear's Endurance",
      "description": "Supernatural stamina. Grants 2d6 temporary hit points and advantage on Constitution checks.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "hp_temp_bonus": 7,
        "ability_check_advantage": ["constitution"],
        "visual_auras": ["bear_spirit_aura"]
      }
    },
    "bulls_strength": {
      "name_en": "Bull's Strength",
      "description": "Surging physical might. Grants advantage on Strength checks.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "ability_check_advantage": ["strength"],
        "visual_auras": ["bull_spirit_aura"]
      }
    },
    "cats_grace": {
      "name_en": "Cat's Grace",
      "description": "Supernatural agility. Grants advantage on Dexterity checks.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "ability_check_advantage": ["dexterity"],
        "visual_auras": ["cat_spirit_aura"]
      }
    },
    "eagles_splendor": {
      "name_en": "Eagle's Splendor",
      "description": "Supernatural majesty. Grants advantage on Charisma checks.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "ability_check_advantage": ["charisma"],
        "visual_auras": ["eagle_spirit_aura"]
      }
    },
    "foxs_cunning": {
      "name_en": "Fox's Cunning",
      "description": "Supernatural wit. Grants advantage on Intelligence checks.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "ability_check_advantage": ["intelligence"],
        "visual_auras": ["fox_spirit_aura"]
      }
    },
    "owls_wisdom": {
      "name_en": "Owl's Wisdom",
      "description": "Supernatural awareness. Grants advantage on Wisdom checks.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "ability_check_advantage": ["wisdom"],
        "visual_auras": ["owl_spirit_aura"]
      }
    },
    "enlarged": {
      "name_en": "Enlarged",
      "description": "Gigantic growth. Increases token scale, grants advantage on Strength saves/checks, and adds +1d4 melee damage.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "token_scale_multiplier": 1.5,
        "ability_check_advantage": ["strength"],
        "saving_throw_advantage": ["strength"],
        "damage_bonus_melee": "1d4"
      }
    },
    "guiding_light": {
      "name_en": "Guiding Light",
      "description": "Highlighted target or divine opening. Grants advantage on the next attack roll.",
      "duration": { "minutes": 1, "rounds": 1 },
      "effects": {
        "attack_advantage_global": true,
        "visual_auras": ["glowing_outline"]
      }
    },
    "foreshadowed": {
      "name_en": "Foreshadowed",
      "description": "Absolute prescience. Grants advantage on all attacks, checks, and saves, while forcing disadvantage on incoming attacks.",
      "duration": { "minutes": 480, "rounds": 4800 },
      "effects": {
        "attack_advantage_global": true,
        "saving_throw_advantage": ["all"],
        "ability_check_advantage": ["all"],
        "visual_auras": ["cosmic_third_eye"]
      }
    },
    "death_warded": {
      "name_en": "Death Warded",
      "description": "Protects the character from a fatal drop to 0 HP, snapping them back to 1 HP instead.",
      "duration": { "minutes": 480, "rounds": 4800 },
      "effects": {
        "condition_immunities": ["instant_death"],
        "visual_auras": ["ancillary_life_tether"]
      }
    },
    "freedom_of_movement": {
      "name_en": "Freedom of Movement",
      "description": "Unstoppable momentum. Immune to paralysis, restraints, and difficult terrain speed penalties.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "condition_immunities": ["paralyzed", "restrained", "slowed"],
        "visual_auras": ["fluid_breezes_at_feet"]
      }
    },
    "blindsight": {
      "name_en": "Blindsight",
      "description": "Heightened senses. Dynamically reveals nearby threats in total darkness, blindness, or heavy smoke.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "blindsight_range_feet": 30,
        "fog_reveal_radius_bonus": 15
      }
    },
    "flying": {
      "name_en": "Flying",
      "description": "Defying gravity. Grants an alternative movement mode and vertical positioning capability.",
      "duration": { "minutes": 10, "rounds": 100 },
      "effects": {
        "speed_bonus": 60,
        "visual_auras": ["hover_shadow_overlay"]
      }
    },
    "paladin_protected": {
      "name_en": "Paladin's Protection",
      "description": "A holy champion's presence adds a flat +4 bonus to all saving throws.",
      "duration": { "minutes": 480, "rounds": 4800 },
      "effects": {
        "saving_throw_bonus": { "all": 4 },
        "visual_auras": ["holy_crest_floor_sigil"]
      }
    },
    "paladin_devotion": {
      "name_en": "Paladin's Devotion",
      "description": "Divine devotion aura shields the character and nearby allies from being charmed.",
      "duration": { "minutes": 480, "rounds": 4800 },
      "effects": {
        "condition_immunities": ["charmed"],
        "visual_auras": ["faint_pink_ward"]
      }
    },
    "paladin_courage": {
      "name_en": "Paladin's Courage",
      "description": "Inspiring presence of a paragon ensures the character and nearby allies cannot be frightened.",
      "duration": { "minutes": 480, "rounds": 4800 },
      "effects": {
        "condition_immunities": ["frightened"],
        "visual_auras": ["faint_gold_ward"]
      }
    },
    "raging": {
      "name_en": "Raging",
      "description": "Primal fury. Grants resistance to physical damage, advantage on Strength checks/saves, and a melee damage bonus.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "damage_resistances": ["bludgeoning", "piercing", "slashing"],
        "ability_check_advantage": ["strength"],
        "saving_throw_advantage": ["strength"],
        "damage_bonus_melee": "2",
        "visual_auras": ["blood_red_steam"]
    }
    },
    "water_breathing": {
      "name_en": "Water Breathing",
      "description": "The character can breathe underwater, ignoring aquatic suffocation hazards.",
      "duration": { "minutes": 1440, "rounds": 14400 },
      "effects": {
        "condition_immunities": ["drowning"]
      }
    },
    "water_walking": {
      "name_en": "Water Walking",
      "description": "Allows walking safely across liquid surfaces like water, mud, or lava.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "visual_auras": ["ripples_at_feet"]
      }
    },
    "spider_climbing": {
      "name_en": "Spider Climbing",
      "description": "Allows vertical scaling along walls and ceilings while keeping hands free.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "visual_auras": ["sticky_web_trails"]
      }
    },
    "barkskinned": {
      "name_en": "Barkskinned",
      "description": "Skin hardens into wood. Forces the character's base Armor Class to never drop below 16.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "ac_floor_limit": 16,
        "visual_auras": ["wooden_texture_overlay"]
      }
    },
    "intellect_fortress": {
      "name_en": "Intellect Fortress",
      "description": "Psychic block. Grants advantage on Intelligence, Wisdom, and Charisma saving throws, and resistance to psychic damage.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "saving_throw_advantage": ["intelligence", "wisdom", "charisma"],
        "damage_resistances": ["psychic"],
        "visual_auras": ["crystalline_shield"]
      }
    },
    "mind_blanked": {
      "name_en": "Mind Blanked",
      "description": "Total mental fortress. Immune to psychic damage, divination spells, mind-reading, and charms.",
      "duration": { "minutes": 1440, "rounds": 14400 },
      "effects": {
        "damage_immunities": ["psychic"],
        "condition_immunities": ["charmed", "scryed", "mind_read"]
      }
    },
    "feast_stuffed": {
      "name_en": "Feast Stuffed",
      "description": "Purified biology. Immune to poison and fear, advantage on Wisdom saves, and increases max HP by 15.",
      "duration": { "minutes": 1440, "rounds": 14400 },
      "effects": {
        "damage_immunities": ["poison"],
        "condition_immunities": ["frightened", "poisoned"],
        "saving_throw_advantage": ["wisdom"],
        "hp_max_bonus": 15
      }
    },
    "truesight": {
      "name_en": "Truesight",
      "description": "Cosmic clarity. Pierces mundane/magical darkness, invisible tokens, and illusions.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "truesight_range_feet": 120,
        "fog_reveal_radius_bonus": 60,
        "visual_auras": ["glowing_eyes_overlay"]
      }
    },
    "invulnerable": {
      "name_en": "Invulnerable",
      "description": "Absolute defense. The character is completely immune to all forms of incoming damage.",
      "duration": { "minutes": 1, "rounds": 10 },
      "effects": {
        "damage_immunities": ["all"],
        "visual_auras": ["blinding_diamond_shroud"]
      }
    },
    "warded_planar": {
      "name_en": "Warded (Planar)",
      "description": "Abjuration field. Disorients otherworldly entities, forcing disadvantage on attacks from planar creatures.",
      "duration": { "minutes": 10, "rounds": 100 },
      "effects": {
        "condition_immunities": ["charmed_by_planar", "frightened_by_planar", "possessed"],
        "visual_auras": ["shimmering_holy_interlocking_rings"]
      }
    },
    "warded_poison": {
      "name_en": "Warded (Poison)",
      "description": "Antitoxin barrier. Grants resistance to poison damage and advantage against being poisoned.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "damage_resistances": ["poison"],
        "saving_throw_advantage": ["poison_resistance"],
        "condition_immunities": ["poisoned_suppressed"],
        "visual_auras": ["faint_green_cellular_barrier"]
      }
    },
    "warded_acid": {
      "name_en": "Warded (Acid)",
      "description": "Elemental shielding that grants resistance to acid damage.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "damage_resistances": ["acid"],
        "visual_auras": ["bubbling_vitriol_shield"]
      }
    },
    "warded_cold": {
      "name_en": "Warded (Cold)",
      "description": "Elemental shielding that grants resistance to cold damage.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "damage_resistances": ["cold"],
        "visual_auras": ["frost_crystalline_shield"]
      }
    },
    "warded_fire": {
      "name_en": "Warded (Fire)",
      "description": "Elemental shielding that grants resistance to fire damage.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "damage_resistances": ["fire"],
        "visual_auras": ["flickering_pyre_shield"]
      }
    },
    "warded_lightning": {
      "name_en": "Warded (Lightning)",
      "description": "Elemental shielding that grants resistance to lightning damage.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "damage_resistances": ["lightning"],
        "visual_auras": ["crackling_static_shield"]
      }
    },
    "warded_thunder": {
      "name_en": "Warded (Thunder)",
      "description": "Elemental shielding that grants resistance to thunder damage.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "damage_resistances": ["thunder"],
        "visual_auras": ["kinetic_reverberation_shield"]
      }
    },
    "unfettered": {
      "name_en": "Unfettered",
      "description": "Agile withdrawal. Grants immunity to opportunity attacks when maneuvering.",
      "duration": { "minutes": 0, "rounds": 1 },
      "effects": {
        "immune_to_opportunity_attacks": true,
        "visual_auras": ["motion_lines_trail"]
      }
    },
    "guiding_bolt_target": {
      "name_en": "Guiding Bolt Target",
      "description": "Mystical dim light clings to the target, granting advantage on the next incoming attack roll.",
      "duration": { "minutes": 0, "rounds": 1 },
      "effects": {
        "incoming_attack_advantage": true,
        "visual_auras": ["glowing_radiant_crosshairs"]
      }
    },
    "glib": {
      "name_en": "Glib",
      "description": "Unbelievable silver tongue. Forces any Charisma check roll under 14 to automatically become a 15.",
      "duration": { "minutes": 60, "rounds": 600 },
      "effects": {
        "charisma_floor_roll_limit": 15,
        "visual_auras": ["none"]
      }
    }
  }
}