import type { TattooStyle } from './types';
import appConfig from './data/app-config.json';

export const APP_CONFIG = appConfig;
export const TATTOO_STYLES: TattooStyle[] = appConfig.styles;
export const COMPANY = appConfig.company;
export const NAVIGATION = appConfig.navigation;
export const LOADING = appConfig.loading;
export const HERO = appConfig.hero;
export const GALLERY = appConfig.gallery;
export const CONTACT = appConfig.contact;
export const PHILOSOPHY = appConfig.philosophy;
export const MEDIA = appConfig.media;

// Legacy support (to avoid breaking things immediately)
export const ARTIST_NAME = appConfig.company.name;
export const ARTIST_TAGLINE = appConfig.company.tagline;
