import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ResultPage() {
  const router = useRouter();
  const { vs1, vs2, condition, id } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState('');
  const [recentList, setRecentList] = useState<any[]>([]);
  const hasFetchedRef = useRef(false); // 중복 호출 방지

  // 승자 강조 텍스트 변환 함수
  const highlightWinner = (text: string) => {
    return text.replace(
      /최종 결과: (.*?)를 선택합니다/,
      '최종 결과: ⭐ $1 ⭐를 선택합니다'
    );
  };

  // 결과 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const docRef = doc(db, 'results', id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setResult(highlightWinner(data.result));
          } else {
            setResult('⚠️ 결과를 찾을 수 없습니다.');
          }
        } catch (err) {
          console.error('Firestore 오류:', err);
          setResult('⚠️ 결과를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      } else if (vs1 && vs2 && !hasFetchedRef.current) {
        hasFetchedRef.current = true;
        try {
          const res = await fetch('/api/judge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vs1, vs2, condition }),
          });
          const data = await res.json();
          setResult(highlightWinner(data.result));
          if (data.id) {
            router.replace(`/result?id=${data.id}`);
          }
        } catch (err) {
          console.error('GPT API 오류:', err);
          setResult('⚠️ AI 판정 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [vs1, vs2, condition, id]);

  // 실시간 최근 VS 목록
  useEffect(() => {
    const fetchRecent = async () => {
      const q = query(
        collection(db, 'results'),
        orderBy('createdAt', 'desc'),
        limit(9)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        vs1: doc.data().vs1,
        vs2: doc.data().vs2,
      }));
      const unique = Array.from(
        new Map(results.map((item) => [item.id, item])).values()
      );
      setRecentList(unique);
    };
    fetchRecent();
  }, []);

  return (
    <div className='min-h-screen bg-[#fefefe] px-4 py-8 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold text-center mb-6'>AI 판정 결과</h1>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center h-[300px] text-gray-600'>
          <img
            src='/loading-chilgai.png'
            alt='로딩 중'
            className='w-32 mb-4 animate-bounce'
          />
          <p className='text-lg animate-pulse'>AI 고민 중이에요...</p>
        </div>
      ) : (
        <>
          <div className='prose max-w-none bg-white p-6 rounded-xl shadow text-base text-gray-800 leading-relaxed overflow-x-auto'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <table className='table-auto border border-gray-300'>
                    {props.children}
                  </table>
                ),
                th: ({ node, ...props }) => (
                  <th className='border border-gray-300 px-2 py-1 bg-gray-100 text-left'>
                    {props.children}
                  </th>
                ),
                td: ({ node, ...props }) => (
                  <td className='border border-gray-300 px-2 py-1'>
                    {props.children}
                  </td>
                ),
                // ✅ 제목 직접 스타일 지정
                h1: ({ node, ...props }) => (
                  <h1 className='text-3xl font-bold text-gray-800 mt-6 mb-4'>
                    {props.children}
                  </h1>
                ),
                h2: ({ node, ...props }) => (
                  <h2 className='text-2xl font-semibold text-gray-800 mt-6 mb-2'>
                    {props.children}
                  </h2>
                ),
                h3: ({ node, ...props }) => (
                  <h3 className='text-xl font-medium text-gray-800 mt-6 mb-2'>
                    {props.children}
                  </h3>
                ),
              }}
            >
              {result}
            </ReactMarkdown>
          </div>

          <div className='flex flex-col md:flex-row justify-center gap-2 mt-4'>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('📋 링크가 클립보드에 복사되었습니다!');
              }}
              className='px-4 py-2 bg-[#66ccff] text-black rounded-md font-bold hover:bg-[#55bbf0] transition'
            >
              📤 이 결과 공유하기
            </button>

            <button
              onClick={() => router.push('/')}
              className='px-4 py-2 bg-gray-200 text-black rounded-md font-bold hover:bg-gray-300 transition'
            >
              🔁 처음으로 돌아가기
            </button>
          </div>

          {!isLoading && recentList.length > 0 && (
            <div className='mt-10'>
              <h2 className='text-lg font-semibold mb-2'>
                🟢 실시간 VS 판정결과
              </h2>
              <ul className='space-y-2 text-blue-600 text-sm'>
                {recentList.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`/result?id=${item.id}`}
                      className='hover:underline'
                    >
                      {item.vs1} vs {item.vs2} 승자는?
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
