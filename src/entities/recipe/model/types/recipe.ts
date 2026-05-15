export type Recipe = {
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  author: string;
  authorRole: string;
  title: string;
  description: string;
  image: string;
  ingredients: {
    name: string;
    amount: string;
    checked?: boolean;
  }[];
  equipment: string[];
  steps: {
    text: string;
    image?: string;
  }[];
  comments: {
    initials: string;
    name: string;
    text: string;
    label?: string;
  }[];
};
