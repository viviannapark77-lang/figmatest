import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextFieldPassword } from '../../components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '../../components/TextFieldText/TextFieldText';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';
import { isEmail } from '../../lib/email';
import { supabase } from '../../lib/supabase';

/**
 * Figma `page/Login/SignIn` (node 27821:7158).
 * 값 대조표와 판단 근거는 `SignIn.design.md` 에 있다.
 *
 * ## `page/Login`(27818:7071) 과 다른 점은 셋뿐이다
 * 나머지(폭·배경·Header 설정·Contents 패딩·Fields 간격·두 필드의 라벨과 필수 표시)는
 * 노드 단위로 같다.
 *
 * 1. **타이틀이 한 줄이다.** `size` 는 여전히 `xl` 이다.
 * 2. **하단 TextButton 행이 없다.**
 * 3. **CTA 버튼이 하나이고 폭을 다 쓴다.** `hierarchy=secondary` 라 `filled-secondary` 다.
 *
 * ## `Bottom` 두 단을 접었다
 * Figma 는 3단인데 앞의 두 단은 시각 값을 하나도 갖지 않고 자식도 하나씩이라 한
 * 요소로 합쳤다 (CLAUDE.md 원칙 2).
 *
 * ## 가입 요청은 Supabase Auth 로 간다
 * `src/lib/supabase.ts` 의 클라이언트 하나를 쓴다. 성공 경로는 세 단계다:
 * `auth.signUp` → `profiles` 에 본인 행 1개 → `/consent` 이동.
 * `profiles.username` 에는 이메일의 `@` 앞부분을 넣는다 (요청자 결정).
 *
 * 아이디 필드 값이 이메일 형식이 아니면 요청을 보내지 않고 아이디 필드만 error
 * 상태로 만들어 "이메일을 입력해주세요" 를 띄운다. 판정은 `Login` 과 같은
 * `isEmail` 함수를 쓴다.
 *
 * ## 세션이 없으면 `profiles` 행을 만들지 않는다
 * `profiles` 의 RLS 는 INSERT 에 `authenticated` 롤과 `auth.uid() = id` 를 요구한다.
 * 이메일 확인이 켜져 있으면 `signUp` 직후 세션이 없어 이 조건을 만족할 수 없다.
 * 그때는 행을 만들지 않고 "인증 후 로그인" 안내만 띄운다.
 *
 * ## `<form>` 은 여전히 두지 않았다
 */
export function SignIn() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const ERROR_PROPS = { isDisabled: true, isError: true } as const;
  const idErrorProps = error !== null || idError !== null ? ERROR_PROPS : {};
  const passwordErrorProps = error !== null ? ERROR_PROPS : {};

  async function handleSignUp() {
    setError(null);
    setIdError(null);
    setNotice(null);

    if (!isEmail(id)) {
      setIdError('이메일을 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: id,
      password,
    });

    if (signUpError) {
      setIsSubmitting(false);
      setError(signUpError.message);
      return;
    }

    if (data.user !== null && data.user.identities?.length === 0) {
      setIsSubmitting(false);
      setError('이미 가입된 아이디입니다');
      return;
    }

    if (data.session === null || data.user === null) {
      setIsSubmitting(false);
      setNotice('가입 확인 메일을 보냈습니다. 인증을 마친 뒤 로그인해 주세요');
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: id.split('@')[0],
    });

    setIsSubmitting(false);

    if (profileError) {
      setError(`계정은 만들어졌지만 프로필 저장에 실패했습니다: ${profileError.message}`);
      return;
    }

    navigate('/consent');
  }

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      {/* 27821:7159 */}
      <OSBarTopNavigation />

      {/* 27821:7160 — Login 과 같이 hasTitle=false 다. 뒤로가기로 로그인 화면에
          돌아간다 (요청자 결정). `navigate(-1)` 이 아니라 `/login` 을 명시하는
          이유: 이 화면에 직접 URL 로 들어온 경우 히스토리에 돌아갈 곳이 없다. */}
      <Header title="" hasTitle={false} onSlotStartClick={() => navigate('/login')} />

      {/* Contents 27821:7161 */}
      <div className="flex flex-1 flex-col items-start px-20 pt-40">
        {/* 27821:7162 — size=xl (세트 기본값). 한 줄이라 <br /> 이 없다. */}
        <TextSetTitle title="회원가입" />

        {/* Fields 27821:7163 — Login 27818:7076 과 노드 단위로 같다. */}
        <div className="flex w-full flex-col gap-40 pt-64">
          {/* 27821:7164 — 필수 표시 `*` 가 꺼져 있다. */}
          <TextFieldText
            label="아이디"
            required={false}
            {...idErrorProps}
            supporting={idError ?? undefined}
            input={{
              id: 'signin-id',
              name: 'username',
              value: id,
              placeholder: '아이디를 입력해 주세요',
              autoComplete: 'username',
              onChange: (event) => setId(event.target.value),
            }}
            onClear={() => setId('')}
          />

          {/* 27821:7165 — 필수 표시 `*` 가 켜져 있다. 새 계정의 비밀번호라
              autoComplete 은 `new-password` 다. */}
          <TextFieldPassword
            label="비밀번호"
            {...passwordErrorProps}
            supporting={error ?? notice ?? undefined}
            input={{
              id: 'signin-password',
              name: 'new-password',
              value: password,
              autoComplete: 'new-password',
              onChange: (event) => setPassword(event.target.value),
            }}
            onClear={() => setPassword('')}
          />
        </div>
      </div>

      {/* CTA 27821:7170 — Bottom 두 단을 접었다. 27821:7171 하나뿐이고 폭을
          다 쓴다. */}
      <div className="flex w-full px-20 pt-8 pb-20">
        <Button
          variant="filled-secondary"
          className="flex-1"
          isDisabled={isSubmitting}
          onClick={handleSignUp}
        >
          회원가입
        </Button>
      </div>

      {/* 27821:7173 */}
      <OSBarBottomNavigation />
    </div>
  );
}
