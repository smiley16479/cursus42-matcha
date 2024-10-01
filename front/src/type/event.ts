type SwipeEventDetail = {
  direction: string;
  element: HTMLElement; // ou le type spécifique que vous utilisez
  data: any; // ou un type plus spécifique selon vos besoins
  index: number;
};

export interface SwipeEvent extends CustomEvent<SwipeEventDetail> {}