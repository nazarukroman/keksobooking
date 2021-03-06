'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');
  var formFieldset = noticeForm.querySelectorAll('fieldset');
  var fileChooserAvatar = document.querySelector('#avatar');
  var noticePreview = document.querySelector('.notice__preview img');
  var title = document.querySelector('#title');
  var addressInput = document.querySelector('#address');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var accomondationType = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var accomondationTypes = ['bungalo', 'flat', 'house', 'palace'];
  var accomondationPrices = [0, 1000, 5000, 10000];
  var roomNumber = document.querySelector('#room_number');
  var roomCapacity = document.querySelector('#capacity');
  var descriptionField = document.querySelector('#description');
  var featuresFields = noticeForm.querySelectorAll('.features input[type=checkbox]');
  var fileChooserPhotos = document.querySelector('#images');
  var photosContainer = document.querySelector('.form__photo-container');

  /** 
   * Добавляем атрибут disabled для полей формы
   */
  var addDisabledFieldset = function () {
    for (var i = 0; i < formFieldset.length; i++) {
      formFieldset[i].disabled = true;
    }
  };
  addDisabledFieldset();

  /** 
   * Удаляем атрибут disabled с полей формы
   */
  var removeDisabledFieldset = function () {
    for (var i = 0; i < formFieldset.length; i++) {
      formFieldset[i].removeAttribute('disabled');
    }
  };

  /**
   * Хэндлер для загрузки аватара
   * @param  {[string]} result [Картинка в base64]
   */
  var avatarClickHandler = function (result) {
    noticePreview.src = result;
  };
  /**
   * Обработчик события на загрузку аватарки
   */
  window.loadPhoto.setImage(fileChooserAvatar, avatarClickHandler);

  var titleInvalidHandler = function () {
    if (title.validity.tooShort) {
      title.setAttribute('style', 'border-color: red');
    } else if (title.validity.tooLong) {
      title.setAttribute('style', 'border-color: red');
    } else if (title.validity.valueMissing) {
      title.setAttribute('style', 'border-color: red');
    } else {
      title.setCustomValidity('');
      title.removeAttribute('style');
    }
  };
  title.addEventListener('invalid', titleInvalidHandler);
  /**
   * Обработчик событий для "Заголовка объявления"
   * Если сообщение сообщение слишком короткое, длинное или не значение пропущено
   * То у инпута border становится красным
   * Если полве валидное, то удаляется атрибут style
   */
  // title.addEventListener('invalid', titleInvalidHandler);

  /**
   * Если число слишком маленькое, большое или вводится не число
   * То у инпута border становится красным
   * Если полве валидное, то удаляется атрибут style
   */
  var priceInputInvalidHandler = function () {
    if (priceInput.validity.rangeUnderflow) {
      priceInput.setAttribute('style', 'border-color: red');
    } else if (priceInput.validity.rangeOverflow) {
      priceInput.setAttribute('style', 'border-color: red');
    } else if (priceInput.validity.typeMismatch) {
      priceInput.setAttribute('style', 'border-color: red');
    } else {
      priceInput.removeAttribute('style');
    }
  };

  /**
   * В поле "Адрес" записываем координаты главной метки
   * @param {[number]} xCoord [Координата X]
   * @param {[number]} yCoord [Координата Y]
   */
  var setAddress = function (xCoord, yCoord) {
    var addressString = 'x: ' + xCoord + ', ' + 'y: ' + yCoord;

    addressInput.setAttribute('value', addressString);
  };

  var syncValues = function (element, value) {
    element.value = value;
  };
  window.synchronizeFields(timeIn, timeOut, window.data.times, window.data.times, syncValues);

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };
  window.synchronizeFields(accomondationType, priceInput, accomondationTypes, accomondationPrices, syncValueWithMin);
  priceInput.addEventListener('invalid', priceInputInvalidHandler);

  /**
   * Делаем селекты неактивными
   */
  var disableRoomSelects = function () {
    for (var i = 0; i < roomCapacity.length; i++) {
      roomCapacity[i].disabled = true;
    }
  };
  /**
   * Проверяем выбранное значение
   * Запускаем функцию, которая делает неактивными селекты
   * Если количество человек равно выбранному количеству комнат, селект становится активным
   * Если количество человек меньше или равно выбранному количеству комнат, но больше нуля, то селект становится активным
   * @param  {[evt]} evt [Событие]
   */
  var roomNumberChangeHandler = function (evt) {
    disableRoomSelects();
    var choosenValue = (evt.target.value === '100') ? '0' : evt.target.value;
    for (var i = 0; i < roomCapacity.length; i++) {
      if (roomCapacity[i].value === choosenValue) {
        roomCapacity[i].disabled = false;
      }
      if (roomCapacity[i].value <= choosenValue && roomCapacity[i].value > 0) {
        roomCapacity[i].disabled = false;
      }
    }
  };

  roomNumber.addEventListener('change', roomNumberChangeHandler);

  /**
   * Хэндлер для загрузки фотографий
   * Вставляет img в html в блок form__photo-container
   * @param  {[string]} result [Картинка в base64]
   */
  var photoClickHandler = function (result) {
    var previewPhoto = document.createElement('img');
    previewPhoto.src = result;
    previewPhoto.style = 'max-width: 100px; max-height: 100px; margin-top: 10px;';
    photosContainer.appendChild(previewPhoto);
  };
  /**
   * Обработчик события на загрузку фотографий
   */
  window.loadPhoto.setImage(fileChooserPhotos, photoClickHandler);

  /**
   * Функция при успешной загрузке формы выводит сообщение и сбрасывает форму к дефолтным значениям.
   */
  var onLoad = function () {
    var fragment = document.createDocumentFragment();
    var div = document.createElement('div');
    var p = document.createElement('p');
    div.classList.add('success-message');
    div.style = 'position: fixed; z-index: 10; width: 300px; height: 50px; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #6EBC72; color: #ffffff; text-align: center; border: 2px solid white';
    p.textContent = 'Данные успешно отправлены';
    div.appendChild(p);
    fragment.appendChild(div);
    window.map.mapSection.appendChild(fragment);
    window.setTimeout(function () {
      document.querySelector('.success-message').style = 'display: none;';
    }, 3000);

    syncValues(title, '');
    syncValues(accomondationType, 'flat');
    syncValues(priceInput, '1000');
    syncValues(timeIn, '12:00');
    syncValues(timeOut, '12:00');
    roomNumber.selectedIndex = 0;
    roomCapacity.selectedIndex = 2;
    featuresFields.forEach(function (elem) {
      elem.checked = false;
    });
    syncValues(descriptionField, '');
  };

  /**
   * Обработчик на отправку данных формы
   * @param  {[event]} evt [Событие]
   */
  var formSubmitHandler = function (evt) {
    window.backend.upload(new FormData(noticeForm), onLoad, window.utils.onError);
    evt.preventDefault();
  };

  noticeForm.addEventListener('submit', formSubmitHandler);

  window.form = {
    removeDisabledFieldset: removeDisabledFieldset,
    noticeForm: noticeForm,
    setAddress: setAddress,
  };
})();
