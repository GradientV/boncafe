// short quotes from public Google reviews of Bon Café (read Oct 30, 2026).
// keep them short, word-for-word and credited. swap in new ones as reviews come in

export interface Review {
    quote: string;
    /** first name + last initial, or "Google review" when the summary didn't show a name */
    by: string;
    source: 'Google';
}

export const REVIEWS: readonly Review[] = [
    { quote: 'This neighborhood cafe is a gem.', by: 'Aricia D.', source: 'Google' },
    { quote: 'The honey ginger chicken was enough for two people on its own.', by: 'Joseph K.', source: 'Google' },
    { quote: 'The shrimp & corn chowder served in a bread bowl was absolutely delicious!', by: 'Google review', source: 'Google' },
    { quote: 'This is the best cafe I have been to in the LIC/Sunnyside/Woodside area.', by: 'Stephanos T.', source: 'Google' },
    { quote: 'A great place to have a tasty cup of espresso, and a meal.', by: 'Google review', source: 'Google' }
];
