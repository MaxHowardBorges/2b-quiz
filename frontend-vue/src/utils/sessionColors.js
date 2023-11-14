const couleurs = [
  '#87CEFA',
  '#e58c8c',
  '#90EE90',
  '#fff695',
  '#adc6e6',
  '#FFA07A',
  '#cb8ffa',
  '#FFB6C1',
  '#30b9b1',
];

export function getAnswerItemColor(index) {
  return couleurs[index % couleurs.length];
}
