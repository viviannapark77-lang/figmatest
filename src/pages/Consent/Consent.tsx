import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Divider } from '../../components/Divider/Divider';
import { Header } from '../../components/Header/Header';
import { ListCheckbox } from '../../components/ListCheckbox/ListCheckbox';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';

/**
 * `Items` 프레임의 자식 4개. 문구는 Figma 텍스트 노드 그대로다.
 * `id` 는 체크 상태를 담을 키이며 Figma 값이 아니다.
 */
const AGREEMENT_ROWS = [
  { id: 'terms', title: '[필수] 서비스 이용약관' },
  { id: 'privacy', title: '[필수] 개인정보 수집·이용 동의' },
  { id: 'unique-id', title: '[필수] 고유식별정보 처리 동의' },
  { id: 'marketing', title: '[선택] 마케팅 정보 수신 동의' },
] as const;

/**
 * Figma `page/Consent` (node 27683:3187).
 * 값 대조표와 판단 근거는 `Consent.design.md` 에 있다.
 *
 * ## 새로 만든 컴포넌트가 없다
 * Figma 트리의 인스턴스 8종이 `src/components` 의 컴포넌트와 1:1 로 맞는다.
 * 이 파일이 직접 그리는 것은 Figma 의 레이아웃 프레임 4개뿐이고, 그 프레임들은
 * 시각 값으로 패딩만 갖는다. `ListCheckbox` 의 `size`·`hasIconEnd`·`hasDivider`
 * 축은 이미 저장소에 있다 (이 화면이 그 근거였다).
 *
 * ## 첫 행은 전체동의다 — 요청자 결정이 근거다. Figma 에는 없다
 * Figma 에는 이 행과 아래 4행 사이의 연동이 정의돼 있지 않고, 라벨도 기본
 * 플레이스홀더 `타이틀 영역입니다.` 그대로다. 양방향으로 묶었다 — 첫 행을 켜면
 * 아래 4행이 모두 켜지고, 끄면 모두 꺼진다. 첫 행의 표시 상태는 저장하지 않고
 * 아래 4행이 전부 켜졌는지에서 파생한다 (`isAllChecked`).
 *
 * ## CTA 비활성 조건 — 요청자 결정이다. Figma 에는 없다
 * 아래 4행 중 하나라도 켜졌는가(`hasAnyChecked`) 하나뿐이다. 필수/선택을
 * 구분하지 않는다 — 문구를 파싱해 필수 약관을 판정하는 것은 지어내는 것이다.
 *
 * ## 화면 이동
 * 헤더 뒤로가기 → `/login`. CTA "동의하고 계속하기" → `/benefit`
 * (Figma 에 프로토타입 연결이 없다 — 요청자 결정이 근거다. `Benefit` 페이지는
 * 이번 작업 범위가 아니라 만들지 않는다. 라우트가 없어도 컴파일에는 영향 없다).
 *
 * ## 접근성은 이 화면이 붙인다
 * `role="group"` + 행마다 `role="checkbox"` · `aria-checked` · `tabIndex` ·
 * 클릭 · Space 토글. 포커스 표시는 UA 아웃라인이 그대로 살아 있다.
 */
export function Consent() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const isAllChecked = AGREEMENT_ROWS.every((row) => checked[row.id]);

  const toggleAll = () =>
    setChecked(Object.fromEntries(AGREEMENT_ROWS.map((row) => [row.id, !isAllChecked])));

  const hasAnyChecked = AGREEMENT_ROWS.some((row) => checked[row.id]);

  const rowProps = (isChecked: boolean, onToggle: () => void) => ({
    role: 'checkbox',
    'aria-checked': isChecked,
    tabIndex: 0,
    onClick: onToggle,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== ' ') return;
      event.preventDefault();
      onToggle();
    },
  });

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      <OSBarTopNavigation />

      <Header title="" hasTitle={false} onSlotStartClick={() => navigate('/login')} />

      <div className="flex flex-1 flex-col items-start px-20 pt-40">
        <TextSetTitle
          title={
            <>
              서비스 이용을 위해
              <br />
              약관에 동의해 주세요
            </>
          }
        />

        <div role="group" aria-label="약관 동의" className="flex w-full flex-col pt-40">
          <ListCheckbox
            title="타이틀 영역입니다."
            hasIconEnd={false}
            isChecked={isAllChecked}
            {...rowProps(isAllChecked, toggleAll)}
          />

          <Divider />

          <div className="flex w-full flex-col">
            {AGREEMENT_ROWS.map((row) => (
              <ListCheckbox
                key={row.id}
                title={row.title}
                size="compact"
                hasDivider={false}
                isChecked={Boolean(checked[row.id])}
                {...rowProps(Boolean(checked[row.id]), () => toggle(row.id))}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col px-20 pt-8 pb-20">
          <Button className="w-full" isDisabled={!hasAnyChecked} onClick={() => navigate('/benefit')}>
            동의하고 계속하기
          </Button>
        </div>
      </div>

      <OSBarBottomNavigation />
    </div>
  );
}
