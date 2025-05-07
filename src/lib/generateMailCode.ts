// 인증번호 생성 로직

export function generateCode(length: number = 6): string {
    const digits = "0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }