// pages/api/judge.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { vs1, vs2, condition } = req.body;

  const prompt = `
너는 지금 'VS 놀이'의 심판입니다.  
사용자가 입력한 두 인물 혹은 개체를 비교하여, 마치 판결문을 작성하듯 결과를 정리해줘야 합니다.

다음의 형식과 기준을 반드시 따르세요:

1. 제목은 다음과 같이 시작합니다:  
   [VS 결과] 
   승리자는 바로~ [이부분에 승리한 비교대상 이름 쓰고] 승리!]

2. 아래 항목을 포함하세요:
- 개요: 간단한 비교 대상 소개  
- 근거: 사실에 기반한 정보, 두 항목 각각의 특징, 업적, 객관적 수치(가능한 경우 웹 검색을 통해 – 조회수, 연도, 수상, 판매량, 팔로워 등)를 기반으로 설명, 검색 사실이 아닌 내용은 명시하지 말 것, 가급적 웹에서 최근 자료를 사용할 것, 비교대상을 객관적으로 판단할 수 있는 다섯 개 기준을 설정하고, 그 기준에 맞춰 분석
- 심판 판단: 중립적인 어조로 판단 근거를 서술  
- 최종 결과: 한쪽을 선정하고 이유를 다시 짧게 정리  
- 한 줄 요약: 위트 있게 요약

3. 글 스타일:
- 심판처럼 공정하고 중립적인 어조를 사용  
- 문장은 논리적이되, 가끔 재치 있는 표현을 허용  
- 양쪽을 균형 있게 설명하되, 반드시 하나를 승자로 뽑는다.  
- 사용자가 지루하지 않게끔 포맷과 리듬을 조절할 것.
- 근거는 두 항목의 비교표를 만들어서 제시 할것 
- 각 항목은 2~3줄 이내로 작성하고, 전체 글은 800자 내외로 요약해 주세요.  
- 불필요한 반복이나 장황한 설명은 피해주세요.
- 마크다운 형식으로 출력해주세요.

비교 대상: ${vs1} vs ${vs2}  
세부 조건: ${condition || '없음'}

4. 
+## AI 판정 결과
 # 🏆 승자는 바로~~~~~ ㅇㅇㅇ 승리!🎉🎉
<br>
<br>
+## 📌 개요  
+간단한 비교 설명...
<br>
+## 📊 판정 근거
+| 항목 | ${vs1} | ${vs2} |
+|------|--------|--------|
+| 항목1 | ... | ... |
+
<br>
+## 🤖 AI 심판의 판단
+판단 내용...
+
<br>
+## ✅ 최종 결과  
+승자와 이유...
+
<br>
+## 📝 한 줄 요약  
+재미있고 위트 있는 요약 한 줄

`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    console.log('🟢 GPT 응답 완료');

    const content = completion.choices[0].message.content;

    console.log('✅ Firestore 저장 시작');

    const docRef = await addDoc(collection(db, 'results'), {
      vs1,
      vs2,
      condition,
      result: content,
      createdAt: Timestamp.now(),
    });

    console.log('✅ 저장 완료: ', docRef.id);

    // 고유 ID도 응답에 포함
    res.status(200).json({ result: content, id: docRef.id });
  } catch (error) {
    console.error('GPT 오류:', error);
    res.status(500).json({ error: 'GPT 호출 실패' });
  }
}
