export type Recipe = {
  author: string;
  authorRole: string;
  title: string;
  description: string;
  image: string;
  stats: {
    icon: string;
    label: string;
    value: string;
    tone: string;
  }[];
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
