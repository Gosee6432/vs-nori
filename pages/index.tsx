import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [vs1, setVs1] = useState('');
  const [vs2, setVs2] = useState('');
  const [condition, setCondition] = useState('');
  const router = useRouter();

  const handleClick = () => {
    if (!vs1 || !vs2) {
      alert('비교할 두 대상을 모두 입력해주세요!');
      return;
    }

    // 광고 새탭 열기
    window.open('https://link.coupang.com/a/cn0WcC', '_blank');

    // 결과 페이지 이동
    router.push({
      pathname: '/result',
      query: { vs1, vs2, condition },
    });
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[#003B5C] text-white'>
      <h1 className='text-4xl font-bold mb-6'>AI 심판의 VS 판정기</h1>

      {/* 비교 입력칸 */}
      <div className='flex justify-center items-center gap-4 w-full max-w-lg mb-6'>
        <input
          type='text'
          value={vs1}
          onChange={(e) => setVs1(e.target.value)}
          placeholder='ex) 아이유'
          className='bg-[#66ccff] text-black px-4 py-3 rounded-md w-full text-center'
        />
        <span className='text-3xl font-extrabold'>VS</span>
        <input
          type='text'
          value={vs2}
          onChange={(e) => setVs2(e.target.value)}
          placeholder='ex) 이효리'
          className='bg-[#66ccff] text-black px-4 py-3 rounded-md w-full text-center'
        />
      </div>

      {/* 세부 조건 */}
      <textarea
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        placeholder='ex) 누가 더 대중에 영향력이 있는가, 연기영역 제외 비교 (선택 입력)'
        className='bg-[#99ddff] text-black px-4 py-3 rounded-md w-full max-w-lg h-24 resize-none mb-6'
      />

      {/* 결과 버튼 */}
      <button
        onClick={handleClick}
        className='bg-[#66ccff] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#55bbf0] transition'
      >
        결과 보러가기
      </button>

      {/* 하단 안내글 (선택) */}
      <p className='text-sm text-gray-300 mt-2'>
        ※ 클릭 시 광고 페이지가 새 창에서 열립니다.
      </p>
    </div>
  );
}
