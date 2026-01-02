
export interface TattooStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  gallery: string[]; // Array of 3 detail images
}

export interface ContactFormData {
  name: string;
  email: string;
  idea: string;
}
