/**
 * Sanitiza o texto fornecido normalizando-o, removendo os acentos diacríticos,
 * eliminando caracteres não alfanuméricos, removendo espaços em excesso e convertendo para minúsculas.
 *
 * @param {string} text - O texto que será sanitizado.
 * @returns {string} - A versão sanitizada do texto, contendo apenas caracteres alfanuméricos,
 *                     em minúsculas, sem acentos e sem espaços extras.
 */
export const sanitizeText = (text: string) => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '')
        .trim()
        .toLocaleLowerCase();
};

/**
 * Normaliza uma string decompondo os caracteres em suas formas canônicas
 * e removendo os acentos, deixando apenas os caracteres base.
 *
 * @param {string} string - A string que será normalizada.
 * @returns {string} - A string normalizada, sem acentos diacríticos.
 */
export const normalizeString = (string: string): string => {
    return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
};
