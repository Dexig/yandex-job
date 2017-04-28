'use strict';

const travelRoute = (() => {
  /**
   * Карточка путешественника
   * @typedef {Object} card
   * @property {string} from - Точка отправления
   * @property {string} to - Точка прибытия
   * @property {object} transport - Информация о транспорте
   */

  const templates = new Map();

  /**
   *  Проверяет корректность карточек
   *
   * @param {card[]} cards Карточки путешественника
   * @returns {boolean}
   */
  function _isValidCards(cards) {
    return cards.every(card => card.transport ? card.to && card.from && card.transport.type : false);
  };

  /**
   * Применяет шаблон к объекту с данными
   *
   * @param {card} card Карточка путешественника
   * @param {string} template Строка шаблона
   * @returns {string} Карточка в виде строки
   */
  function _cardToString(card, template) {
    const reTemplateVariableGlobal = /\{\{(\w*)\}\}/g;
    const reTemplateVariable = /\{\{(\w*)\}\}/;
    const reTemplateOperation = /\{\%([\d\w\s{}|]*)\%\}/g;
    const reTemplateSpaces = /\s{2,}/g;

    return template
      .replace(reTemplateOperation, (match, value) => {
        const [varString, defString] = value.split('|').map(str => str.trim());
        const variable = varString.match(reTemplateVariable)[1];

        if (card[variable] || card.transport[variable]) {
          return varString;
        }

        return defString;
      })
      .replace(reTemplateVariableGlobal, (match, value) => card.transport[value] || card[value] || '')
      .replace(reTemplateSpaces, ' ');
  };

  /**
   * Создает хэш таблицу соотвествия точки отправления/прибытия и номера карточки в массиве до сортировки
   *
   * @param {string} point Точка отправления/прибытия form/to
   * @param {card[]} cards Карточки путешественника
   * @returns {object} Возвращается хэш таблица где ключ это точка, а значение индекс карточки
   */
  function _createHashTable(point, cards) {
    if (!cards) {
      throw new Error('Cards array must a have several card');
    }

    if (point !== 'from' && point !== 'to') {
      throw new Error('Point must be equal a "from" or "to"');
    }

    return cards.reduce((table, card, index) => {
      table[card[point]] = index;
      return table;
    }, {});
  }

  /**
   * Ищет начало пути
   *
   * @param {object} tableTo Хэш таблица с точками прибытия
   * @param {card[]} cards Карточки путешественника
   * @returns {object|null}
   */
  function _getBeginRoute(tableTo, cards) {
    if (!tableTo && !cards) {
      throw new Error('All arguments must be a defined');
    }

    for (let index = 0; index < cards.length - 1; index++) {
      const from = cards[index].from;
      if (!tableTo[from]) {
        return index;
      }
    }
    return null;
  }

  /**
   * Добавление шаблона для конкретного типа транспорта,
   * По данному шаблону создается строковое описание карточки
   *
   * @param {string} type Тип транспорта
   * @param {string} template Строка шаблона
   * @returns {void}
   */
  function addTemplate(type, template) {
    if (!type && !template) {
      throw new Error('All arguments must be a define');
    }

    if (templates.hasOwnProperty(type)) {
      throw new Error(`Template for ${type} is already exists`);
    }

    templates.set(type, template);
  }

  /**
   * Приводит карточки путешественника в формат словесного описания
   *
   * @param {card[]} cards Карточки путешественника
   * @returns {string[]} Массив со словесным описанием маршрута
   */
  function formatCards(cards) {
    if (!templates.size) {
      throw new Error('There are no templates');
    }

    if (!cards) {
      return null;
    }

    if (!Array.isArray(cards)) {
      throw new TypeError('Cards must be a array');
    }

    if (!_isValidCards(cards)) {
      throw new TypeError('Bad card format');
    }

    return cards.map((card) => {
      const template = templates.get(card.transport.type);
      if (template) {
        return _cardToString(card, template);
      } else {
        throw new Error(`Template for ${card.transport.type} is not exists`);
      }
    });
  }

  /**
   * Создает маршрут путишествия на основе карточек.
   * Иначе говоря, сортирует карточки.
   *
   * @param {card[]} cards Карточки путешественника
   * @returns {card[]} Отсортированные карточки
   */
  function createRoute(cards) {
    if (!cards) return null;

    if (!Array.isArray(cards)) {
      throw new TypeError('Cards must be a array');
    }

    if (!_isValidCards(cards)) {
      throw new TypeError('Bad card format');
    }

    const tableFrom = _createHashTable('from', cards);
    const tableTo = _createHashTable('to', cards);
    const beginRoute = _getBeginRoute(tableTo, cards);

    if (!beginRoute) {
      return null;
    }

    const sortedCards = [cards[beginRoute]];

    for (let i = 0; i < cards.length - 1; i++) {
      const pointTo = sortedCards[i].to;
      const currentCard = cards[tableFrom[pointTo]];

      if (!currentCard) {
        return null;
      }

      sortedCards.push(currentCard);
    }

    return sortedCards;
  }

  return {
    createRoute,
    addTemplate,
    formatCards
  };

})();
