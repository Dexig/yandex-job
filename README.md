# Сортировщик карточек путешественника
Модуль для сортировки карточек представлен в файле `travel/travelRoute.js`.<br>
В файле `travel/script.js` представлено использование модуля.<br>
Демонстрацию работы можно посмотреть открыв в браузере `travel/index.html`.

## Формат входных данных
Формат входных данных представляет собой массив с объектами (карточками) `cards:`
```
[
  {
    from: string,
    to: string,
    transport: {
      type: string,
      someProp?: string,
      someProt?: string
    }
  }
]
```

## Функции модуля:

```ts
travelRoute.createRoute(cards): sortedCards
```
Cортирует набор карточек, выстраивая цепочку маршрута.

Функция может вернуть **null** в 3 случаях:
1) Если исходный массив карточек пуст;
2) Если не удалось определить начало пути, например маршрут закольцован.
3) Если из карточек нельзя построить неразрывный маршрут.

---

```ts
travelRoute.formatCards(cards): string[]
```
Конвертирует массив карточек в строковое представление. Для работы функции необходимо добавить шаблоны всех используемых типов транспорта. Функция вернет null если массив карточек пуст.

---

```ts
travelRoute.addTemplate(type: string, template: string): void
```
Добавляет шаблон конкретного типа транспорта для того, чтобы карточку можно было конвертировать в строковое представление.

Для каждого типа транспорта будет использоваться свой шаблон.

Шаблон имеет следующий вид:

`Text {{prop1}} more text {% text {{prop2}} | default text %}`

**Где:**

`{{prop1}}`, `{{prop2}}` - названия свойств, которые соответствует свойствам карточки.

`{% text {{prop2}} | default text %}` - условная конструкция, если свойство **prop2** отсутствует в карточке будет подставлен текст справа от `|` то есть **default text**.

## Пример использования:

```js
// Добавляем шаблоны
travelRoute.addTemplate('train', 'Take {{tname}} {{number}} from {{from}} to {{to}}. Train carriage {{carriage}}. Seat {{seat}}.');
travelRoute.addTemplate('bus', 'Take the {{tname}} {{number}} from {{from}} to {{to}}. {% Seat {{seat}} | No seat assigment %}.');

// Создаем массив с карточками
const unsortedCards = [
  {
    from: 'Barcelona',
    to: 'Moscow',
    transport: {
      type: 'bus',
      tname: 'hyper bus',
      number: '666',
      seat: '13'
    }
  },
  {
    from: 'Madrid',
    to: 'Barcelona',
    transport: {
      type: 'train',
      tname: 'train',
      number: '78A',
      carriage: '12',
      seat: '45B',
    }
  }
];

// Передаем массив карточек в метод createRoute, который вернет маршрут (отсортировав карточки).
const cards = travelRoute.createRoute(unsortedCards);

// После конвертируем полученный массив с карточками в строковое представление
const stringCards = travelRoute.formatCards(cards);
```

# Фреймворк для работы с CSS классами
Фреймворк представлен в файле `cm/cm.js`.<br>
Демонстрацию работы можно посмотреть открыв в браузере `cm/index.html`.

## Работа с фреймворком
Для работы с фреймворком достаточно вызвать функцию `cm(selector: string, one:boolean)` и указать в качестве **selector** любой CSS-селектор.<br>
Если аргумент **one** равен **true** то будет найден только самый первый результат, по умолчанию значение **false** - то есть функция ищет все подходящие dom элементы.<br>
Функция возвращает обертку с методами над найденными dom элементами.<br>
Через свойство **el** доступны сами dom элементы в массиве `cm(selector: string).el`

### Методы
`cm(selector).addClass(class: string)` - Добавляет класс элементу/элементам<br>
`cm(selector).removeClass(class: string)` - Удаляет класс у элемента/элементов<br>
`cm(selector).toggleClass(class: string)` - Переключает класс элементу/элементам (удаляет или добавляет)<br>

Все методы можно "чейнить", тоесть вызывать последовательно:
```js
cm('.class').addClass('new').removeClass('remove');
```
### Статические методы

`cm.registerMethod(name: string, function)` - Добавляет новый метод во фреймворк с именем **name** и функциональностью **function**. Внутри **function** через **this** доступен текущий результат работы функции **cm**.

Пример использования:
```js
cm.registerMethod('hasClass', function(cl) {
  const result = [];
  this.el.forEach(node => {
    result.push(Boolean(~node.classList.value.search(cl)));
  });
  return result.length > 1 ? result : result[0];
});
```
