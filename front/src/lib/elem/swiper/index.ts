// Lien de la lib: https://sveltethemes.dev/flo-bit/svelte-swiper-cards

export type CardData = {
	title?: string;
	color?: string;
	description?: string;
	image?: string;
};

export type Direction = 'left' | 'right';

export { default as CardSwiper } from './CardSwiper.svelte';
