// the whole menu. the menu page, the home-page house favorites and the menu
// structured data are all built from this file.
//
// sources (details in RESEARCH.md):
//  - food names, descriptions and prices: the café's own Grubhub/DoorDash menu (mirrored on res-discover,
//    "Updated 2026"; spot-checked against Grubhub and DoorDash on Oct 30, 2026), with the newer names
//    from the café's Instagram menu board (Oct 2025) where they differ. "Served with…" notes are from DoorDash
//  - Japanese lunch & dinner: DoorDash (section + vegetable tempura) and Instagram (oyakodon set, Oct 2025).
//    the full list of that section and of "Korean Entrées" still needs to come from the café
//  - drinks: the café's Instagram drink board (Oct 2025) + the 2022 Sunnyside Shines interview.
//    no drink prices were published except smoothies, so drinks show without prices for now
//  - soups: the café's Instagram (Oct–Nov 2025), Google reviews, and a Yelp review (Feb 2026) for the
//    clam chowder bread bowl price. Donkatsu Donburi Set: a Yelp photo caption (Feb 2026), price unknown
//
// to change a price, edit `price`. leave `price` out to hide it (shows `priceNote` instead, if set).

export type Tag = 'korean' | 'spicy' | 'meatless';

export const TAG_LABELS: Record<Tag, string> = {
    korean: 'Korean',
    spicy: 'Spicy',
    meatless: 'Meatless'
};

export interface MenuItem {
    name: string;
    description?: string;
    /** in dollars, e.g. 14.95 */
    price?: number;
    /** shown when there's no price, e.g. "Ask us" */
    priceNote?: string;
    tags?: readonly Tag[];
    /** small "House favorite" badge */
    favorite?: boolean;
    seasonal?: boolean;
}

export interface MenuSection {
    id: string;
    title: string;
    kind: 'food' | 'drinks';
    /** one line under the heading */
    blurb?: string;
    /** one price for every item in the section (smoothies) */
    price?: number;
    items: readonly MenuItem[];
}

export const MENU: readonly MenuSection[] = [
    {
        id: 'breakfast',
        title: 'Breakfast, all day',
        kind: 'food',
        blurb: 'From the minute we open until we close.',
        items: [
            { name: 'Bagel', price: 2.25, tags: ['meatless'] },
            { name: 'Egg & Cheese Bagel', price: 5.95, tags: ['meatless'] },
            { name: 'Egg & Cheese Croissant', price: 7.95, tags: ['meatless'] },
            { name: 'Two Eggs with Home Fries & Toast', price: 8.95, description: 'With bacon, ham or sausage.' },
            { name: 'Grilled Cheese & Tomato Soup', price: 11.95 }
        ]
    },
    {
        id: 'omelettes',
        title: 'Omelettes',
        kind: 'food',
        blurb: 'All day, with home fries and toast.',
        items: [
            { name: 'Cheese Omelette', price: 9.95, description: 'Your choice of cheese.', tags: ['meatless'] },
            { name: 'Garden Omelette', price: 11.95, description: 'Mixed greens and your choice of cheese.', tags: ['meatless'] },
            { name: 'Western Omelette', price: 11.95, description: 'Ham, green and red peppers, onion.' },
            { name: 'Southwest Omelette', price: 12.95, description: 'Turkey, onion, green and red peppers, olives, feta.' },
            { name: 'Bacon & Spinach Omelette', price: 12.95, description: 'Bacon, spinach, mozzarella.' },
            {
                name: 'Santa Fe Omelette',
                price: 13.95,
                description: 'Grilled chicken, portobello, green and red peppers, onion and cheddar, with tomato sauce.'
            },
            { name: 'Italian Tuna Omelette', price: 13.95, description: 'Tuna, onion, roasted peppers, olives, tomato.' },
            {
                name: "Meat Lover's Omelette",
                price: 15.95,
                description: 'Bacon, sausage, ham, green and red peppers, onion, tomato, spinach.'
            }
        ]
    },
    {
        id: 'healthy-omelettes',
        title: 'Healthy omelettes',
        kind: 'food',
        blurb: 'Lighter and protein-packed, with home fries and salad.',
        items: [
            {
                name: 'Bulgogi Omelette',
                price: 16.95,
                description: 'Our specialty. Marinated sliced rib-eye, onion, green pepper, portobello, spinach, mozzarella.',
                tags: ['korean'],
                favorite: true
            },
            { name: 'Greek Omelette', price: 13.95, description: 'Egg whites, oregano, olives, tomatoes, onion, green and red peppers, feta.', tags: ['meatless'] },
            {
                name: 'Protein Omelette',
                price: 14.95,
                description: 'Egg whites, grilled chicken, green and red peppers, onion, spinach, with vanilla protein powder.'
            },
            {
                name: 'California Omelette',
                price: 15.95,
                description: 'Avocado, portobello, green pepper, onion, tomatoes, cheddar.',
                tags: ['meatless']
            },
            { name: 'Baked Potato Omelette', price: 15.95, description: 'Bacon, potatoes, onion, green pepper, cheddar, sour cream.' },
            { name: 'Smoked Salmon Omelette', price: 17.95, description: 'Smoked salmon, red onion, roasted peppers, cream cheese.' }
        ]
    },
    {
        id: 'brunch',
        title: 'Brunch',
        kind: 'food',
        blurb: 'Served with home fries and salad.',
        items: [
            { name: 'The "American" Breakfast', price: 15.95, description: 'Two eggs your way with thick-cut smoked bacon.' },
            { name: 'French Omelette', price: 15.95, description: 'Ham, Swiss, onion, tomatoes.' },
            {
                name: 'Bon Café Avocado Toast',
                price: 16.95,
                description: 'Fried kimchi, tofu steak, grilled portobello and a poached egg on multigrain toast.',
                tags: ['korean']
            },
            {
                name: 'Southern Chicken Benedict',
                price: 16.95,
                description: 'Poached eggs, melted provolone, portobello gravy and grilled tomatoes on multigrain toast.'
            },
            {
                name: 'Florentine Crab Benedict',
                price: 16.95,
                description: 'Poached eggs, crab salad, cucumber, avocado, arugula and tomatoes on a croissant.'
            },
            {
                name: 'Traditional Eggs Benedict',
                price: 16.95,
                description: 'Poached eggs, smoked bacon, whole-grain honey mustard and tomatoes on a whole-grain pancake.'
            },
            {
                name: 'French Toast Tiramisu',
                price: 17.95,
                description: 'Vanilla bean and maple syrup, fresh strawberries, banana, blueberries and a dusting of chocolate.',
                tags: ['meatless']
            },
            {
                name: 'Smoked Salmon Benedict',
                price: 18.95,
                description: 'Poached eggs, sautéed garlic spinach, roasted peppers and cream cheese on a bagel.'
            }
        ]
    },
    {
        id: 'tteokbokki',
        title: 'Appetizers & tteokbokki',
        kind: 'food',
        blurb: 'Tteokbokki: chewy Korean rice cakes, stir-fried in sauce.',
        items: [
            { name: 'Steamed Dumplings', price: 12, description: 'Six pieces.' },
            { name: 'Buffalo Chicken Wings', price: 12, description: 'Buffalo hot sauce, blue cheese dressing.', tags: ['spicy'] },
            {
                name: 'Rose Tteokbokki with Meatballs',
                price: 14,
                description: 'Rice cakes, meatballs, portobello and mixed vegetables in a creamy pink rosé sauce.',
                tags: ['korean'],
                favorite: true
            },
            {
                name: 'Tteokbokki with Crispy Chicken',
                price: 15,
                description: 'Rice cakes, crispy chicken breast, portobello and mixed vegetables under melted mozzarella.',
                tags: ['korean']
            },
            {
                name: 'Bulgogi Quesadilla',
                price: 15,
                description: 'Marinated sliced rib-eye, pico de gallo, cheddar, guacamole.',
                tags: ['korean']
            },
            {
                name: 'Royal Bulgogi Tteokbokki',
                price: 18,
                description: 'Gungjung-style: rice cakes stir-fried with marinated rib-eye, portobello and mixed vegetables. A generous portion.',
                tags: ['korean']
            },
            {
                name: 'Tofu, Kimchi & Spicy BBQ Pork',
                price: 22,
                description: 'Pan-fried marinated pork and kimchi with pan-fried tofu. A generous portion.',
                tags: ['korean', 'spicy']
            }
        ]
    },
    {
        id: 'bibimbap',
        title: 'Korean bibimbap',
        kind: 'food',
        blurb: 'Over rice with Bon Café spicy sauce, most topped with a sunny-side-up egg.',
        items: [
            {
                name: 'Bulgogi Bibimbap',
                price: 18,
                description: 'Marinated sliced rib-eye and mixed greens, topped with a sunny-side-up egg.',
                tags: ['korean'],
                favorite: true
            },
            {
                name: 'Spicy Chicken Bibimbap',
                price: 16,
                description: 'Spicy grilled chicken breast and mixed greens, topped with a sunny-side-up egg.',
                tags: ['korean', 'spicy']
            },
            {
                name: 'Spicy Pork & Kimchi Bibimbap',
                price: 18,
                description: 'Spicy pork, mixed greens and kimchi, topped with a sunny-side-up egg.',
                tags: ['korean', 'spicy']
            },
            {
                name: 'Pork Belly Bibimbap',
                price: 18,
                description: 'Grilled pork belly and mixed greens, topped with a sunny-side-up egg.',
                tags: ['korean']
            },
            { name: 'Tofu Bibimbap', price: 16, description: 'Tofu, avocado and mixed greens.', tags: ['korean', 'meatless'] }
        ]
    },
    {
        id: 'bowls',
        title: 'Healthy bibim bowls',
        kind: 'food',
        blurb: 'Fresh, colorful and served on rice, each with its own house sauce.',
        items: [
            {
                name: 'Honey Ginger Chicken Bowl',
                price: 14.95,
                description:
                    'Chicken breast, mixed greens, cucumber, tomatoes, mango, jalapeño, corn, cilantro and mixed nuts, with our ginger-garlic sauce.',
                favorite: true
            },
            {
                name: 'Spicy Tuna Bowl',
                price: 14.95,
                description: 'Tuna, mixed greens, pineapple, avocado, cherry tomatoes, cucumber, jalapeño, red onion, cilantro, chipotle mayo.',
                tags: ['spicy']
            },
            {
                name: 'Spicy Coconut Shrimp Bowl',
                price: 14.95,
                description:
                    'Shrimp sautéed with coconut and sweet-and-spicy garlic sauce, with mango, cilantro, jalapeño, red onion, cucumber, sliced almonds.',
                tags: ['spicy']
            },
            {
                name: 'Sunrise Bowl',
                price: 14.95,
                description: 'Crab salad, spinach, avocado, egg, cucumber, sliced almonds, cranberries, sweet balsamic vinaigrette.'
            },
            {
                name: 'Tofu & Kimchi Bowl',
                price: 14.95,
                description:
                    'Tofu, kimchi, mixed greens, avocado, red pepper, onion, cucumber, portobello, sliced almonds and sesame, with our special spicy sauce.',
                tags: ['korean', 'spicy']
            },
            {
                name: 'Smoked Salmon Bowl',
                price: 16.95,
                description:
                    'Smoked salmon, arugula, cucumber, red onion, red pepper, cranberries, sliced almonds, honey mustard and sweet-spicy sauce.'
            },
            {
                name: 'Butter Grilled Salmon Bowl',
                price: 16.95,
                description:
                    'Salmon, mixed greens, avocado, egg, red onion, cherry tomatoes, cucumber, cranberries, sliced almonds, balsamic and honey mustard.'
            }
        ]
    },
    {
        id: 'salads',
        title: 'Salads',
        kind: 'food',
        items: [
            {
                name: 'Bon Café Green Salad',
                price: 13.95,
                description:
                    'Avocado, mixed greens, green apple, cranberries, tomatoes, cucumber, sliced almonds and shaved parmesan with lemon vinaigrette.',
                tags: ['meatless'],
                favorite: true
            },
            {
                name: 'Greek Hemp Seed Salad',
                price: 14.95,
                description: 'Romaine, tomatoes, cucumber, hemp seeds, red onion, olives, feta.',
                tags: ['meatless']
            },
            {
                name: 'Premium Heat Burger Salad',
                price: 15.95,
                description:
                    '100% premium ground beef, fried egg, provolone, portobello, grilled onion, lettuce and tomatoes with whole-grain honey mustard.'
            },
            {
                name: 'Chicken Salad',
                price: 15.95,
                description: 'Grilled chicken breast, chopped bacon, mixed greens, tomatoes, corn, red onion and shredded cheese with BBQ ranch.'
            },
            {
                name: 'Alaskan Salmon Salad',
                price: 16.95,
                description: 'Grilled salmon fillet, mixed greens, tomatoes, walnuts and cranberries with balsamic vinaigrette.'
            },
            {
                name: 'Bulgogi Salad',
                price: 16.95,
                description:
                    'Marinated sliced rib-eye, mixed greens, cheddar, tomatoes, walnuts and hard-boiled egg with cucumber-wasabi dressing.',
                tags: ['korean']
            }
        ]
    },
    {
        id: 'avocado-toast',
        title: 'Avocado toast',
        kind: 'food',
        blurb: 'On multigrain bread, served with salad.',
        items: [
            { name: 'Avocado Toast with Hard-Boiled Egg', price: 10.95, tags: ['meatless'] },
            { name: 'Avocado Toast with Tomato & Arugula', price: 10.95, description: 'With balsamic glaze.', tags: ['meatless'] },
            { name: 'Avocado Cream Cheese Bagel', price: 10.95, description: 'Avocado, cream cheese and arugula on a bagel.', tags: ['meatless'] },
            {
                name: 'Avocado Toast with Kimchi',
                price: 11.95,
                description: 'Avocado, hard-boiled egg and kimchi.',
                tags: ['korean'],
                favorite: true
            },
            { name: 'Avocado Toast with Tuna Salad', price: 11.95 },
            { name: 'Avocado Toast with Bacon, Arugula & Tomato', price: 12.95 },
            { name: 'Avocado Toast with Crab Salad', price: 12.95, description: 'With hard-boiled egg.' }
        ]
    },
    {
        id: 'croissants',
        title: 'Croissant sandwiches',
        kind: 'food',
        blurb: 'Built on a buttery croissant.',
        items: [
            { name: 'Egg, Avocado & Bacon', price: 9.95, description: 'Lettuce and tomatoes.' },
            { name: 'Poached Egg & Avocado', price: 9.95, description: 'Tomatoes, arugula and seasoning.', tags: ['meatless'] },
            { name: 'Strawberry & Cream Cheese', price: 9.95, description: 'With white chocolate sauce.', tags: ['meatless'] },
            { name: 'Turkey, Bacon & Swiss', price: 9.95, description: 'Tomatoes, red onion and lettuce.' },
            { name: 'Egg & Beef Sausage', price: 9.95, description: 'Tomatoes and arugula.' },
            { name: 'Egg Salad & Smoked Ham', price: 9.95, description: 'Tomatoes and lettuce.' },
            { name: 'Boiled Egg, Ham & Cheese', price: 9.95, description: 'With avocado.' },
            { name: 'Chicken Salad & Melted Cheese', price: 9.95, description: 'Arugula and tomatoes.' },
            { name: 'Crab Salad & Avocado', price: 10.95, description: 'Tomatoes, arugula and seasoning.' },
            {
                name: 'Pastrami & Melted Swiss',
                price: 14.95,
                description: 'Grilled onion, green and red peppers and tomatoes with Russian dressing.'
            },
            {
                name: 'Smoked Salmon & Cream Cheese',
                price: 14.95,
                description: 'Lettuce, tomatoes, onion and arugula with whole-grain honey mustard.'
            }
        ]
    },
    {
        id: 'sandwiches',
        title: 'Sandwiches & paninis',
        kind: 'food',
        blurb: 'Served with your choice of fries or salad.',
        items: [
            {
                name: 'Grilled Vegetable Sandwich',
                price: 13.95,
                description: 'Roasted red pepper, grilled zucchini, onions, arugula, goat cheese and pesto on multigrain toast.',
                tags: ['meatless']
            },
            {
                name: 'Pesto Chicken Sandwich',
                price: 14.95,
                description: 'House-made basil pesto aioli, grilled chicken, roasted red pepper, arugula and mozzarella on ciabatta.',
                favorite: true
            },
            { name: 'Chicken Club Panini', price: 14.95, description: 'Grilled chicken, bacon, lettuce, tomatoes, Muenster.' },
            {
                name: 'California Chicken Wrap',
                price: 14.95,
                description: 'Spicy chicken, avocado, lettuce, tomatoes and cucumber with ranch.',
                tags: ['spicy']
            },
            {
                name: 'Bulgogi Cheese Panini',
                price: 15.95,
                description: 'Marinated sliced rib-eye, grilled onion, portobello, cheddar and pesto.',
                tags: ['korean']
            },
            {
                name: 'Chicken Milanese Sandwich',
                price: 16.95,
                description: 'Crusted chicken, arugula, plum tomatoes, red onion and fresh mozzarella on ciabatta.'
            },
            {
                name: 'Grilled Atlantic Salmon Sandwich',
                price: 16.95,
                description: 'Red onion, tomatoes, arugula, cucumber and chipotle mayo on multigrain toast.'
            }
        ]
    },
    {
        id: 'burgers',
        title: 'Burgers',
        kind: 'food',
        blurb: 'On a sautéed bun, served with fries.',
        items: [
            {
                name: 'Bon Café Premium Beef Burger',
                price: 14.95,
                description:
                    '100% premium ground beef, fried egg, provolone, portobello, grilled onion, lettuce and tomatoes with whole-grain honey mustard.'
            },
            { name: 'Chicken Burger', price: 13.95, description: 'Crispy chicken breast, lettuce and tomatoes with ranch and BBQ sauce.' },
            { name: 'Tuna Burger', price: 13.95, description: 'Tuna fillet, lettuce, red onion, tomatoes and arugula with chipotle mayo.' },
            {
                name: 'Tofu Burger',
                price: 14.95,
                description: 'Grilled tofu, avocado, cucumber, lettuce and tomatoes with our special Bon Café red sauce.',
                tags: ['meatless']
            }
        ]
    },
    {
        id: 'entrees',
        title: 'Entrées',
        kind: 'food',
        blurb: 'Lunch or dinner, plated.',
        items: [
            {
                name: 'Bulgogi Cheesesteak',
                price: 17,
                description: 'Marinated sliced rib-eye, American cheese, grilled peppers and onions, with fries.',
                tags: ['korean']
            },
            {
                name: 'Gochujang Penne Pasta',
                price: 18,
                description: 'Spicy pork, grilled peppers and onions and portobello, tossed with penne in gochujang sauce.',
                tags: ['korean', 'spicy'],
                favorite: true
            },
            { name: 'Rigatoni & Bacon Pasta', price: 18, description: 'Fresh pasta with chopped bacon and spinach in a cream sauce.' },
            { name: 'Steamed Salmon', price: 22, description: 'Salmon steamed with eggplant and squash, served with fried rice.' }
        ]
    },
    {
        id: 'japanese',
        title: 'Japanese lunch & dinner',
        kind: 'food',
        blurb: 'Monday to Saturday, from noon. Ask what’s on today.',
        items: [
            { name: 'Vegetable Tempura', price: 12, tags: ['meatless'] },
            {
                name: 'Donkatsu Donburi Set',
                priceNote: 'Ask us',
                description: 'Crispy pork cutlet over rice, with vegetable tempura.'
            },
            {
                name: 'Oyakodon & Vegetable Tempura Set',
                price: 19.95,
                description: 'Chicken and egg simmered over rice, with crispy vegetable tempura on the side.'
            }
        ]
    },
    {
        id: 'soups',
        title: 'Soups',
        kind: 'food',
        blurb: 'Something warm, all day.',
        items: [
            {
                name: 'Soup of the Day',
                price: 6.95,
                description: 'Made fresh (often chicken noodle) with your choice of healthy bread. Ask what’s on today.'
            },
            {
                name: 'Clam Chowder Bread Bowl',
                price: 14,
                description: 'Creamy clam chowder topped with bacon, served in a bread bowl.'
            },
            {
                name: 'Shrimp & Corn Chowder',
                priceNote: 'Ask us',
                description: 'In a bread bowl, when it’s on.'
            }
        ]
    },
    {
        id: 'sweets',
        title: 'Sweets',
        kind: 'food',
        items: [
            { name: 'Macaron', price: 3, tags: ['meatless'] },
            { name: 'Box of 6 Macarons', price: 16, tags: ['meatless'] },
            { name: 'Pastries', priceNote: 'See the case', description: 'Croissants and pastries, fresh in the case every morning.' }
        ]
    },
    {
        id: 'coffee',
        title: 'Coffee & lattes',
        kind: 'drinks',
        blurb: 'Hot or iced. Dine in and it comes in a real cup.',
        items: [
            { name: 'Dirty Chai Latte', description: 'Chai latte with a shot of espresso.', favorite: true },
            { name: 'Caramel Latte' },
            { name: 'Acacia Honey Latte' },
            { name: 'Ginger Honey Latte' },
            { name: 'Dalgona Coffee Latte', description: 'Whipped Korean-style coffee over milk.', tags: ['korean'] },
            { name: 'Matcha Coffee Latte', description: 'Matcha and espresso, layered.' },
            { name: 'Strawberry Matcha Latte' },
            { name: 'Pumpkin Chocolate Fudge Latte', seasonal: true }
        ]
    },
    {
        id: 'tea',
        title: 'Tea & more',
        kind: 'drinks',
        items: [{ name: 'Taro Milk Tea' }, { name: 'Hot Chocolate' }]
    },
    {
        id: 'frappes',
        title: 'Frappés',
        kind: 'drinks',
        items: [
            { name: 'Strawberry Cheesecake Frappé' },
            { name: 'Oreo Cookie Chocolate Frappé' },
            { name: 'Banana Peanut Butter Espresso Frappé' },
            { name: 'Honeydew & White Chocolate Frappé' }
        ]
    },
    {
        id: 'lemonades',
        title: 'Lemonades & coolers',
        kind: 'drinks',
        items: [
            { name: 'Butterfly Pea Tea Lemonade', description: 'The purple one.' },
            { name: 'Hibiscus Tea Strawberry Lemonade' },
            { name: 'Lavender Lemonade' },
            { name: 'Mango or Peach Lemonade' },
            { name: 'Frozen Yogurt Pineapple Piña Colada' }
        ]
    },
    {
        id: 'smoothies',
        title: 'Healthy smoothies',
        kind: 'drinks',
        price: 7.95,
        blurb: 'Every smoothie $7.95.',
        items: [
            { name: 'Morning Sunrise', description: 'Green apple, vanilla whey protein, yogurt, yogurt drink.' },
            { name: 'Skinny', description: 'Cranberry, grapefruit, lemon juice, honey.' },
            { name: 'Berry Sinful', description: 'Strawberry, blueberry, yogurt, honey, milk.' },
            { name: 'Yellow', description: 'Peach, mango, yogurt, orange juice.' },
            { name: 'Dolce Vida', description: 'Banana, peanut butter, chocolate whey protein, coconut milk.' },
            { name: 'Pink', description: 'Strawberry, banana, yogurt, peanut butter, almond milk.' },
            { name: 'Golden Milk Mango', description: 'Mango, banana, yogurt, turmeric, milk.' },
            { name: 'Peanut Butter Banana', description: 'Banana, almond milk, yogurt, peanut butter.' },
            { name: 'Green', description: 'Mango, almond milk, spinach, banana.' },
            { name: 'Purple', description: 'Banana, blueberries, yogurt, peanut butter, almond milk.' }
        ]
    }
];

export interface Favorite {
    /** must match a MENU item name exactly */
    item: string;
    /** the line shown on the home page; falls back to the item's description */
    blurb?: string;
}

/** "House favorites" on the home page. */
export const FAVORITES: readonly Favorite[] = [
    { item: 'Bulgogi Bibimbap', blurb: 'Marinated rib-eye and greens over rice, topped with a sunny-side-up egg and Bon Café spicy sauce.' },
    { item: 'Honey Ginger Chicken Bowl', blurb: 'Chicken breast, mango, corn, cucumber and mixed nuts over rice with our ginger-garlic sauce.' },
    { item: 'Rose Tteokbokki with Meatballs', blurb: 'Chewy rice cakes and meatballs in a creamy rosé sauce.' },
    { item: 'Gochujang Penne Pasta', blurb: 'Spicy pork, grilled peppers and portobello tossed with penne in gochujang sauce.' },
    { item: 'Bon Café Green Salad', blurb: 'Avocado, green apple, cranberries, sliced almonds and shaved parmesan with lemon vinaigrette.' },
    { item: 'Bon Café Avocado Toast', blurb: 'Fried kimchi, tofu steak, grilled portobello and a poached egg on multigrain toast.' }
];

/** "Ask us" / "$14.95" / "" */
export function formatPrice(item: MenuItem, section?: MenuSection): string {
    const price = item.price ?? section?.price;
    if (price === undefined) return item.priceNote ?? '';
    return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export function slug(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export const itemId = (section: MenuSection, item: MenuItem): string => `${section.id}--${slug(item.name)}`;

export function findItem(name: string): { section: MenuSection; item: MenuItem } {
    for (const section of MENU) {
        const item = section.items.find((i) => i.name === name);
        if (item) return { section, item };
    }
    throw new Error(`FAVORITES lists "${name}", which isn't on the MENU. Check the spelling in src/data/menu.ts.`);
}
