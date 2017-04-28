const cm = (() => {
  const extMethods = {};

  /**
   * Класс при создании экземплера принимает селектор
   * и находит все узлы удовлетворяющие этому селектору
   *
   * @class Node
   */
  class Node {
    /**
     * Создает экземпляр класса Node, который содержит результат поиска по заданному селектору
     * @param {string} selector css селектор
     * @param {boolean} one если true то поиск ведется до первого результата
     */
    constructor(selector, one) {
      if (!selector) {
        return null;
      }

      if (one) {
        this.el = [document.querySelector(selector)];
      } else {
        this.el = document.querySelectorAll(selector);
      }
    }

    /**
     * Добавление класса элементу/элементам
     *
     * @param {string} cl css класс
     * @returns {NodeList}
     */
    addClass(cl) {
      this.el.forEach(n => {
        n.classList.add(cl);
      });
      return this;
    }

    /**
     * Удаление класса у элемента/элементов
     *
     * @param {string} cl css класс
     * @returns {NodeList}
     */
    removeClass(cl) {
      this.el.forEach(n => {
        n.classList.remove(cl);
      });
      return this;
    }

    /**
     * Добавляет класс если его нет, либо удаляет если есть
     *
     * @param {string} cl css класс
     * @returns {NodeList}
     */
    toggleClass(cl) {
      this.el.forEach(n => {
        n.classList.toggle(cl);
      });
      return this;
    }
  }


  const init = (selector, one) => {
    const node = new Node(selector, one);

    // Дописываем в прототип методы, которые регистрируются извне модуля
    Node.prototype = Object.assign(Node.prototype, extMethods);

    return node;
  };


    /**
     * Функция для регистрации нового метода
     *
     * @param {string} name Имя метода
     * @param {function} method Метод
     * @returns
     */
  init.registerMethod = (name, method) => {
    if (typeof method !== 'function') {
      throw new TypeError('Method is not a function');
    }

    if (Node.prototype.hasOwnProperty(name) && extMethods.hasOwnProperty(name)) {
      throw new Error('This method is already exists');
    }

    extMethods[name] = method;
  };

  return init;
})();
