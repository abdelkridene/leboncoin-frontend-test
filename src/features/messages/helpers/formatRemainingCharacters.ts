const pluralRules = new Intl.PluralRules('fr-FR')

export const formatRemainingCharacters = (count: number): string =>
  pluralRules.select(count) === 'one' ? `${count} caractère restant` : `${count} caractères restants`
