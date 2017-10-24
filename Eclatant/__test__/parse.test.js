const { arrParse } = require("../parse");

describe("Parse Test", () => {
  it("input number[]", () => {
    // given
    const input = `[ 10, 21, 4, 314, 99, 0, 72 ]`;

    // when
    const result = arrParse(input);

    // then
    expect(result).toEqual(`총 7개의 데이터 중에 숫자 7개가 포함되어 있습니다.`);
  });

  it("input []", () => {
    // given
    const input = `[ 10, "jk", 4, "314", 99, "crong", false ]`;

    // when
    const result = arrParse(input);

    // then
    expect(result).toEqual(`총 7개의 데이터 중에 문자열 3개, 숫자 3개, 부울 1개가 포함되어 있습니다.`);
  });
});
