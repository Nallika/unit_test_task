const unitTestingTask = require('../unitTestingTask');

const mockDate = new Date(2021, 1, 25, 1, );

const langTestList = {
  en: {
    generalFormatting: 'January Jan Wednesday Wed We 17 pm',
    customDateFormatting: 'AM',
  },
  be: {
    generalFormatting: 'студзень сту серада сер сер 17 вечара',
    customDateFormatting: 'ночы',
  },
  cs: {
    generalFormatting: 'leden led středa stř stř 17 odpoledne',
    customDateFormatting: 'dopoledne',
  },
  kk: {
    generalFormatting: 'January Jan Wednesday Wed We 17 pm',
    customDateFormatting: 'AM',
  },
  pl: {
    generalFormatting: 'styczeń sty środa śr Śr 17 ',
    customDateFormatting: 'rano',
  },
  ru: {
    generalFormatting: 'январь янв среда ср ср 17 вечера',
    customDateFormatting: 'ночи',
  },
  tr: {
    generalFormatting: 'January Jan Wednesday Wed We 17 pm',
    customDateFormatting: 'AM',
  },
  tt: {
    generalFormatting: 'January Jan Wednesday Wed We 17 pm',
    customDateFormatting: 'AM',
  },
  uk: {
    generalFormatting: 'січень січ середа ср ср 17 вечора',
    customDateFormatting: 'ночі',
  },
};

const runTestForList = (lang, testList) => {
  describe(`Test formatting for ${lang} `, () => {

    beforeAll(() => {
      unitTestingTask.lang(lang);
    });

    const {generalFormatting, customDateFormatting} = testList;

    it(`should correct return general formatting`, function () {
      const result = unitTestingTask('MMMM MMM DDD DD D HH a');
      expect(result).toBe(generalFormatting);
    });

    it(`should correct return custom date formatting`, function () {
      const result = unitTestingTask('A', mockDate);
      expect(result).toBe(customDateFormatting);
    });
  });
};

describe('Test for unitTestingTask', () => {

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2023, 0, 25, 17, 47, 11));
  });

  describe('Base methods and error handling test', () => {

    it(`should switch language`, function () {
      unitTestingTask.lang('be');
      const result = unitTestingTask.lang();
      expect(result).toBe('be');

      unitTestingTask.lang('en');
    });

    it(`should register new format`, function () {
      const formatName = 'test';
      unitTestingTask.register(formatName, 'dd')
      expect(unitTestingTask.formatters()).toContain(formatName);
    });

    it(`should correct use custom date`, function () {
      const result = unitTestingTask('YYYY MM dd', mockDate);
      expect(result).toBe('2021 02 25');
    });

    it(`should correct return base formatting`, function () {
      const result = unitTestingTask('YYYY YY MM M HH H hh h dd d mm m ss s ff f ZZ Z');
      expect(result).toBe('2023 23 01 1 17 17 05 5 25 25 47 47 11 11 000 0 +0100 +01:00');
    });

    it(`should correct return registered format`, function () {
      const result = unitTestingTask('ISODateTimeTZ');
      expect(result).toBe('2023-01-25T05:47:11+01:00');
    });

    it(`should throw an error if no format was passed`, function () {
      expect(() => unitTestingTask()).toThrowError('Argument `format` must be a string');
    });

    it(`should throw an error if wrong date was passed`, function () {
      expect(() => unitTestingTask('ss', {})).toThrowError('Argument `date` must be instance of Date or Unix Timestamp or ISODate String');
    });
  });

  const languages = Object.keys(langTestList);
  languages.forEach((lang) => runTestForList(lang, langTestList[lang]));
});