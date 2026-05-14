import { Character } from "../types/character";
import { TOKEN_SIZE } from "./constants";

export const characters: Character[] = [
    { 
        id: '1', 
        name: 'Guerreiro', 
        charClass: 'Fighter', 
        level: 5,
        hp: 50, maxHp: 50, tempHp: 0,
        ac: 18, 
        speed: 9, 
        passivePerception: 13,
        attributes: { str: 4, dex: 1, con: 3, int: -1, wis: 1, cha: 0 },
        skills: {
            acrobatics: 1, animalHandling: 1, arcana: -1, athletics: 7,
            deception: 0, history: -1, insight: 1, intimidation: 3,
            investigation: -1, medicine: 1, nature: -1, perception: 3,
            performance: 0, persuasion: 0, religion: -1, sleightOfHand: 1, 
            stealth: 1, survival: 1
        },
        resources: { actionSurge: { current: 1, max: 1 }, secondWind: { current: 1, max: 1 } },
        spellSlots: {}, 
        statuses: ['concentration'],
        size: 'medium', 
        x: 1100, y: 300, radius: TOKEN_SIZE.medium, color: '#3498db', initiative: 0, isTurn: false,
        visuals: {
            token_img: 'https://oldschooldnd.westhistory.net/uploads/6/4/3/0/6430621/published/fighter-image.jpg?1607898821',
            aura_preset: 'steel_blue',
            scale: 1.1
        }
    },
    { 
        id: '2', 
        name: 'Clériga', 
        charClass: 'Cleric', 
        level: 5,
        hp: 42, maxHp: 42, tempHp: 5,
        ac: 16, 
        speed: 9,
        passivePerception: 15,
        attributes: { str: 2, dex: 0, con: 2, int: 0, wis: 4, cha: 1 },
        skills: {
            acrobatics: 0, animalHandling: 4, arcana: 0, athletics: 2,
            deception: 1, history: 3, insight: 7, intimidation: 1, investigation: 0, medicine: 7,
            nature: 0, perception: 5, performance: 1, persuasion: 4, religion: 3, sleightOfHand: 0, stealth: 0, survival: 4
        },
        resources: { channelDivinity: { current: 1, max: 2 } },
        spellSlots: {
            level1: { current: 4, max: 4 },
            level2: { current: 2, max: 3 },
            level3: { current: 1, max: 2 }
        },
        statuses: ['poisoned'], 
        size: 'medium',
        x: 800, y: 440, radius: TOKEN_SIZE.medium, color: '#2ecc71', initiative: 0, isTurn: false,
        visuals: {
            token_img: 'https://static.wixstatic.com/media/de04c6_dacda57cc90144489ab218e3061f9195~mv2.png/v1/fill/w_602,h_831,al_c,q_90/de04c6_dacda57cc90144489ab218e3061f9195~mv2.png',
            aura_preset: 'holy_light',
            scale: 1.0
        }
    },
    { 
        id: '3', 
        name: 'Ladino', 
        charClass: 'Rogue', 
        level: 5,
        hp: 36, maxHp: 36, tempHp: 0,
        ac: 15, 
        speed: 9,
        passivePerception: 14,
        attributes: { str: -1, dex: 4, con: 1, int: 2, wis: 0, cha: 2 },
        skills: {
            acrobatics: 7, animalHandling: 0, arcana: 2, athletics: -1,
            deception: 5, history: 2, insight: 0, intimidation: 2, investigation: 5, medicine: 0, nature: 2, perception: 4, performance: 2, persuasion: 2,
            religion: 2, sleightOfHand: 7, stealth: 10, survival: 0
        },
        resources: { sneakAttackDice: '3d6' }, 
        spellSlots: {},
        statuses: ['prone'],
        size: 'medium',
        x: 700, y: 300, radius: TOKEN_SIZE.medium, color: '#9b59b6', initiative: 0, isTurn: false,
        visuals: {
            token_img: 'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/02/DD-Assassin-Rogue.jpg?q=50&fit=crop&w=825&dpr=1.5',
            aura_preset: 'shadow_mist',
            scale: 0.9
        }
    },
    { 
        id: '4', 
        name: 'Mago', 
        charClass: 'Wizard', 
        level: 5,
        hp: 28, maxHp: 28, tempHp: 0,
        ac: 12, 
        speed: 9,
        passivePerception: 12,
        attributes: { str: -1, dex: 2, con: 1, int: 4, wis: 1, cha: 0 },
        skills: {
            acrobatics: 2, animalHandling: 1, arcana: 7, athletics: -1, deception: 0, history: 7, insight: 4,
            intimidation: 0, investigation: 7, medicine: 1, nature: 4, perception: 2, performance: 0, persuasion: 0,
            religion: 4, sleightOfHand: 2, stealth: 2, survival: 1
        },
        resources: { arcaneRecovery: { current: 1, max: 1 } },
        spellSlots: {
            level1: { current: 1, max: 4 },
            level2: { current: 3, max: 3 },
            level3: { current: 2, max: 2 }
        },
        statuses: [], 
        size: 'medium',
        x: 1000, y: 440, radius: TOKEN_SIZE.medium, color: '#e74c3c', initiative: 0, isTurn: false,
        visuals: {
            token_img: 'https://oldschooldnd.westhistory.net/uploads/6/4/3/0/6430621/published/wizard-image.png?250',
            aura_preset: 'arcane_rings',
            scale: 1.0
        }
    },
    { 
        id: '5', 
        name: 'Bárbaro', 
        charClass: 'Barbarian', 
        level: 5,
        hp: 65, maxHp: 65, tempHp: 0,
        ac: 15, 
        speed: 12, 
        passivePerception: 13,
        attributes: { str: 4, dex: 2, con: 3, int: -1, wis: 1, cha: -1 },
        skills: {
            acrobatics: 2, animalHandling: 4, arcana: -1, athletics: 7,
            deception: -1, history: -1, insight: 1, intimidation: 2,
            investigation: -1, medicine: 1, nature: -1, perception: 3,
            performance: -1, persuasion: -1, religion: -1, sleightOfHand: 2, 
            stealth: 2, survival: 4
        },
        resources: { rage: { current: 2, max: 3 } },
        spellSlots: {},
        statuses: [], 
        size: 'medium',
        x: 900, y: 200, radius: TOKEN_SIZE.medium, color: '#e67e22', initiative: 0, isTurn: false,
        visuals: {
            token_img: 'https://i0.wp.com/standsinthefire.com/wp-content/uploads/2014/09/conan-the-barbarian.jpg',
            aura_preset: 'primal_rage',
            scale: 1.2
        }
    }
];