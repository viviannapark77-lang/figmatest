import type { Meta, StoryObj } from '@storybook/react';
import { Consent } from './Consent';

/** Figma `page/Consent`. 사용자가 준 링크: fileKey Dxj8pDHoaiWox49YsKhQHE, node 4628:17687. */
const FIGMA_URL =
  'https://www.figma.com/design/Dxj8pDHoaiWox49YsKhQHE/%EA%B3%B5%EC%9C%A0%EC%9A%A9--LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%88%98%EC%97%85%EC%9E%90%EB%A3%8C-%EA%B3%BC%EC%A0%952--%EB%B3%B5%EC%82%AC-?node-id=4628-17687';

const meta = {
  title: 'Pages/Consent',
  component: Consent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `page/Consent`. `src/components` 의 컴포넌트 7종을 조립한 화면입니다.\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`hasTitle=false`) → `TextSetTitle`(`size=xl`) → ' +
          '`ListCheckbox`(전체동의 행) → `Divider` → `ListCheckbox` × 4(`size="compact"`) → ' +
          '`Button` → `OSBarBottomNavigation`.\n\n' +
          '**전체동의 행과 아래 4행은 서로 연동됩니다.** 전체동의를 켜면 4행이 모두 켜지고, 끄면 ' +
          '모두 꺼집니다. 반대로 전체동의 행의 표시 상태는 저장하지 않고 4행이 전부 켜졌는지에서 ' +
          '파생합니다(`isAllChecked`). 전체동의 행의 라벨은 Figma 에서 기본 플레이스홀더 ' +
          '`타이틀 영역입니다.` 로 남아 있습니다(디자이너 미오버라이드). 근거는 `Consent.design.md` 참조.\n\n' +
          '**전체동의 행 아래 구분선이 두 겹입니다.** 행이 자기 구분선을 그리고 그 바로 아래 ' +
          '독립 `Divider` 인스턴스가 또 있습니다. Figma 파일의 실제 상태이며 눈대중으로 하나를 ' +
          '지우지 않았습니다.\n\n' +
          '**화면 이동은 요청자 결정입니다 — Figma 에는 프로토타입 연결이 없습니다.** ' +
          '헤더 뒤로가기 → `/login`, CTA "동의하고 계속하기" → `/benefit`(이번 작업 범위 밖이라 ' +
          '아직 페이지가 없습니다).\n\n' +
          '**CTA 는 하나도 체크되지 않으면 비활성입니다** (요청자 결정). 조건은 "4개 행 중 ' +
          '하나라도 켜졌는가" 하나뿐입니다 — `[필수]`·`[선택]` 은 Figma 텍스트 노드의 문구이지 ' +
          '컴포넌트 속성이 아니라, 문구를 파싱해 필수 약관을 판정하지 않았습니다 (원칙 1).\n\n' +
          '접근성 시맨틱(`role="group"` · 행마다 `role="checkbox"` · `aria-checked` · `tabIndex` · ' +
          'Space 토글)은 이 화면이 붙입니다.',
      },
    },
  },
} satisfies Meta<typeof Consent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 5개 행이 모두 꺼진 최초 상태입니다. */
export const Default: Story = {};
