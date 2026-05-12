export interface BackgroundConfig {
    path: string;
    repeat: boolean;
}

export const backgroundDefinitions: Record<string, BackgroundConfig> = {
    grass:   { path: '/images/grass.jpg',   repeat: false },
    tavern:  { path: '/images/tavern.jpg',  repeat: true },
    castle:  { path: '/images/castle.jpg',  repeat: true },
    dungeon: { path: '/images/dungeon.jpg', repeat: true },
    road:    { path: '/images/road.jpg',    repeat: false },
    village: { path: '/images/village.jpg', repeat: true },
    cave:    { path: '/images/cave.jpg',    repeat: true },
    forest:  { path: '/images/forest.jpg',  repeat: true },
    ruins:   { path: '/images/ruins.jpg',   repeat: true },
    sand:    { path: '/images/sand.jpg',    repeat: false },
    snow:    { path: '/images/snow.jpg',    repeat: true }
};