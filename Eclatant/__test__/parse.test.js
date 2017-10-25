const { printCheckResult, checkArray, checkObject } = require("../parse");

describe("JSON.parse replacement", () => {
  describe("checkArray(input)", () => {
    it("input number[]", () => {
      // given
      const input = `[ 10, 21, 4, 314, 99, 0, 72 ]`;

      // when
      const result = checkArray(input);

      // then
      expect(result).toEqual({ leng: 7, bool: 0, num: 7, str: 0 });
    });

    it("input []", () => {
      // given
      const input = `[ 10, "jk", 4, "314", 99, "crong", false ]`;

      // when
      const result = checkArray(input);

      // then
      expect(result).toEqual({ leng: 7, bool: 1, num: 3, str: 3 });
    });
  });

  describe("printCheckResult(type, checkResult{})", () => {
    it("input number[]", () => {
      // given
      const input = `[ 10, 21, 4, 314, 99, 0, 72 ]`;
      const checkedInput = checkArray(input);

      // when
      const result = printCheckResult("[]", checkedInput);

      // then
      expect(result).toEqual(`총 7개의 배열 데이터 중에 숫자 7개가 포함되어 있습니다.`);
    });

    it("input []", () => {
      // given
      const input = `[ 10, "jk", 4, "314", 99, "crong", false ]`;
      const checkedInput = checkArray(input);

      // when
      const result = printCheckResult("[]", checkedInput);

      // then
      expect(result).toEqual(
        `총 7개의 배열 데이터 중에 문자열 3개, 숫자 3개, 부울 1개가 포함되어 있습니다.`
      );
    });

    it("input {}", () => {
      // given
      const input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`;
      const checkedInput = checkObject(input);

      // when
      const result = printCheckResult("{}", checkedInput);

      // then
      expect(result).toEqual(
        `총 4개의 객체 데이터 중에 문자열 2개, 숫자 1개, 부울 1개가 포함되어 있습니다.`
      );
    });
  });

  describe("checkObject", () => {
    it("input {}", () => {
      // given
      const input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`;

      // when
      const result = checkObject(input);

      // then
      expect(result).toEqual({
        leng: 4,
        bool: 1,
        num: 1,
        str: 2
      });
    });
  });
});
