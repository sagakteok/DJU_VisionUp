// 인증번호 메일 전송 로직

import { NextResponse } from 'next/server';
import { transporter } from '@/lib/nodemailer';
import { generateCode } from '@/lib/generateMailCode';

export async function POST(req: Request) {
  const { email } = await req.json();
  const code = generateCode();

  try {
    await transporter.sendMail({
      from: `"카셀렉트" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '카셀렉트 서비스 이메일 인증 코드입니다',
      html: `
        <div style="margin: auto; width: 100vw; max-width: 600px; height: 700px; background: linear-gradient(to bottom, #1C1F26, #57595E); z-index: 0;">
          <div style="display: flex; align-items: center; width: 100vw; max-width: 600px; height: 160px; background: #000000; z-index: 1">
            <div style="margin-left: 30px;">
              <div><span style="font-family: 'SpoqaHanSansNeo-Regular'; font-size: 15px; color: #FFFFFF">LOGO in Here</span></div>
              <div style="margin-top: 15px;"><span style="font-family: 'SpoqaHanSansNeo-Thin'; font-size: 35px; color: #F7D7C5">카셀렉트 이메일 인증</span></div>
            </div>
          </div>
          <div style="margin-top: 70px;">
            <div style="margin-left: 30px;"><span style="font-family: 'SpoqaHanSansNeo-Thin'; font-size: 16px; color: #E8EEFF">${email}</span><span style="font-family: 'SpoqaHanSansNeo-Thin'; font-size: 16px; color: #FFFFFF"> 님, 안녕하세요!</span></div>
            <div style="margin-top: 15px; margin-left: 30px; margin-bottom: 50px;"><span style="font-family: 'SpoqaHanSansNeo-Regular'; font-size: 20px; color: #FFFFFF">아래는 이메일 인증을 위한 6자리 코드입니다.</span></div>
            <div style="display: flex; align-items: center; justify-content: center; width: 90vw; max-width: 500px; height: 100px; background-color: #D7D1CC; border-radius: 20px; margin: auto"><span style="font-family: 'SpoqaHanSansNeo-Medium'; font-size: 30px; color: #2F3644">${code}</span></div>
            <div style="margin-top: 50px; margin-left: 30px;"><span style="font-family: 'SpoqaHanSansNeo-Light'; font-size: 16px; color: #FFFFFF">해당 인증 코드는 7분간 유효하며,</span></div>
            <div style="margin-top: 10px; margin-left: 30px;"><span style="font-family: 'SpoqaHanSansNeo-Light'; font-size: 16px; color: #FFFFFF">타인에게 공유하지 마세요.</span></div>
            <div style="margin-top: 50px; margin-left: 30px;"><span style="font-family: 'SpoqaHanSansNeo-Thin'; font-size: 14px; color: #D7D1CC">본 메일은 카셀렉트 이메일 인증 요청에 따라 발송되었습니다.</span></div>
          </div>
        </div>  
      `,
    });

    return NextResponse.json({ success: true, code });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: '메일 전송 실패' }, { status: 500 });
  }
}