// every photo on the site: file, alt text, crop point and where it came from.
//
//   source 'bon-cafe'  the café's own photo (their DoorDash store photo, their Instagram)
//   source 'unsplash'  a free stock placeholder (Unsplash License: free for commercial use, no
//                      attribution required). Swap these for the café's own photos before launch
//
// to add or replace a photo: drop the original in images-raw/, run `npm run images`,
// then point an entry below at the new file name (and update the credit)
import { IMAGE_SIZES } from './image-sizes.ts';

export interface Photo {
    /** public/images/<file>.webp and <file>-sm.webp */
    file: string;
    alt: string;
    source: 'bon-cafe' | 'unsplash';
    credit: string;
    link?: string;
    /** CSS object-position for crops, e.g. "50% 60%" */
    focus?: string;
}

export const PHOTOS = {
    avocadoToast: {
        file: 'avocado-toast',
        alt: 'Avocado toast topped with two poached eggs',
        source: 'unsplash',
        credit: 'David B Townsend',
        link: 'https://unsplash.com/photos/IQSDSFO9UuI'
    },
    bibimbap: {
        file: 'bibimbap',
        alt: 'Bibimbap in a stone bowl with an egg yolk, carrots, bean sprouts and greens',
        source: 'unsplash',
        credit: 'Dmitry Pavlovsky',
        link: 'https://unsplash.com/photos/SbHulgzS_eo',
        focus: '50% 56%'
    },
    lattePour: {
        file: 'latte-pour',
        alt: 'A barista pouring latte art into a white cup',
        source: 'unsplash',
        credit: 'Fahmi Fakhrudin',
        link: 'https://unsplash.com/photos/nzyzAUsbV0M',
        focus: '55% 55%'
    },
    interior: {
        file: 'interior',
        alt: 'A warm café dining room with wood tables and tall windows',
        source: 'unsplash',
        credit: 'Hyeryeong Song',
        link: 'https://unsplash.com/photos/BlcwH5Z-B5g',
        focus: '50% 62%'
    },
    croissantSandwich: {
        file: 'croissant-sandwich',
        alt: 'A croissant sandwich with tomato, mozzarella and greens',
        source: 'unsplash',
        credit: 'Luis Covarrubias',
        link: 'https://unsplash.com/photos/ESXMLLiZcWU'
    },
    bulgogiBowl: {
        file: 'bulgogi-bowl',
        alt: 'Bon Café’s bulgogi over rice with peppers, onions and a fried egg',
        source: 'bon-cafe',
        credit: 'Bon Café et Restaurant (their DoorDash store photo)',
        focus: '40% 45%'
    },
    bulgogiUdon: {
        file: 'bulgogi-udon',
        alt: 'Bon Café’s bulgogi udon with kimchi, with chopsticks and a spoon on the side',
        source: 'bon-cafe',
        credit: 'Bon Café et Restaurant (their Instagram post, Nov 14, 2025; cropped to remove the caption)',
        link: 'https://www.instagram.com/p/DRDbVHREoPM/',
        focus: '45% 50%'
    },
    latte: {
        file: 'latte',
        alt: 'A latte with leaf latte art on a saucer',
        source: 'unsplash',
        credit: 'nameless 3791',
        link: 'https://unsplash.com/photos/T3fFz5W0Foc'
    },
    strawberryMatcha: {
        file: 'strawberry-matcha',
        alt: 'A layered strawberry matcha latte in a glass',
        source: 'unsplash',
        credit: 'Lala Azizli',
        link: 'https://unsplash.com/photos/UFgB4e7JA1g',
        focus: '50% 65%'
    },
    cafeTables: {
        file: 'cafe-tables',
        alt: 'Guests working and talking at wood tables in a café',
        source: 'unsplash',
        credit: 'Petr Sevcovic',
        link: 'https://unsplash.com/photos/qE1jxYXiwOA',
        focus: '50% 60%'
    },
    tteokbokki: {
        file: 'tteokbokki',
        alt: 'Tteokbokki, Korean rice cakes in red sauce, in a black bowl with chopsticks',
        source: 'unsplash',
        credit: 'Marcin Skalij',
        link: 'https://unsplash.com/photos/w_2vlvTgk7E'
    },
    koreanTable: {
        file: 'korean-table',
        alt: 'A table set with bibimbap and Korean side dishes',
        source: 'unsplash',
        credit: 'Jakub Kapusnak',
        link: 'https://unsplash.com/photos/4f4YZfDMLeU'
    },
    sevenTrain: {
        file: 'seven-train',
        alt: 'An elevated subway train with the Manhattan skyline behind it',
        source: 'unsplash',
        credit: 'Jimmy Hu',
        link: 'https://unsplash.com/photos/GjIT0m2yilw',
        focus: '50% 72%'
    },
    icedLatte: {
        file: 'iced-latte',
        alt: 'An iced latte with cream swirling through it',
        source: 'unsplash',
        credit: 'Demi DeHerrera',
        link: 'https://unsplash.com/photos/L-sm1B4L1Ns'
    }
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/** The hero slideshow on the home page, in order. */
export const HERO_SLIDES: readonly PhotoKey[] = ['avocadoToast', 'bibimbap', 'lattePour', 'interior'];

export function photoSize(photo: Photo): { width: number; height: number } {
    return IMAGE_SIZES[photo.file] ?? { width: 1600, height: 1067 };
}
