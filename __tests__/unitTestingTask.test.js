const unitTestingTask = require('../unitTestingTask');

const mockDate = new Date(2021, 1, 25, 1, );

const langTestList = {
  en: {
    generalFormatting: ['January', 'Jan', 'Wednesday', 'Wed', 'We', 'pm'],
    customDateFormatting: 'AM',
  },
  be: {
    generalFormatting: ['студзень', 'сту', 'серада', 'сер', 'сер', 'вечара'],
    customDateFormatting: 'ночы',
  },
  cs: {
    generalFormatting: ['leden', 'led', 'středa', 'stř', 'stř', 'odpoledne'],
    customDateFormatting: 'dopoledne',
  },
  pl: {
    generalFormatting: ['styczeń', 'sty', 'środa', 'śr', 'Śr', ''],
    customDateFormatting: 'rano',
  },
  ru: {
    generalFormatting: ['январь', 'янв', 'среда', 'ср', 'ср', 'вечера'],
    customDateFormatting: 'ночи',
  },
  uk: {
    generalFormatting: ['січень', 'січ', 'середа', 'ср', 'ср', 'вечора'],
    customDateFormatting: 'ночі',
  },
};

const runTestForList = (lang, testList) => {
  describe(`Test formatting for ${lang} language`, () => {

    beforeAll(() => {
      unitTestingTask.lang(lang);
    });

    const {generalFormatting, customDateFormatting} = testList;
    const tokensList = ['MMMM', 'MMM', 'DDD', 'DD', 'D', 'a'];

    it.each(tokensList)('should return correct output for %p', (token) => {
      // take output by current token index
      const index = tokensList.indexOf(token);
      const result = unitTestingTask(token);
      expect(result).toBe(generalFormatting[index]);
    });

    it('should return correct output of am time', function () {
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

    it('should correct switch to new language', function () {
      // Check for current language
      let result = unitTestingTask.lang();
      expect(result).toBe('en');

      // Switch language, and check is it switched correctly
      unitTestingTask.lang('be');
      result = unitTestingTask.lang();
      expect(result).toBe('be');
    });

    it('should register new format', function () {
      const formatName = 'test';
      unitTestingTask.register(formatName, 'dd')
      expect(unitTestingTask.formatters()).toContain(formatName);
    });

    it('should correctly use custom date from args and format it', function () {
      const result = unitTestingTask('YYYY-MM-dd', mockDate);
      expect(result).toBe('2021-02-25');
    });

    it('should return correct data for numbered tokens', function () {
      const result = unitTestingTask('YYYY YY MM M HH H hh h dd d mm m ss s ff f ZZ Z');
      expect(result).toBe('2023 23 01 1 17 17 05 5 25 25 47 47 11 11 000 0 +0100 +01:00');
    });

    it('should return correct output for pre-registered format', function () {
      const result = unitTestingTask('ISODateTimeTZ');
      expect(result).toBe('2023-01-25T05:47:11+01:00');
    });

    it('should throw an error if no format was passed', function () {
      expect(() => unitTestingTask()).toThrowError('Argument `format` must be a string');
    });

    it('should throw an error if wrong date was passed', function () {
      expect(() => unitTestingTask('ss', {})).toThrowError('Argument `date` must be instance of Date or Unix Timestamp or ISODate String');
    });
  });

  const languages = Object.keys(langTestList);
  languages.forEach((lang) => runTestForList(lang, langTestList[lang]));
});