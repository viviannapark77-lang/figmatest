import type { Meta, StoryObj } from '@storybook/react';
import { SignIn } from './SignIn';

/** Figma `page/Login/SignIn`. 사용자가 준 링크: fileKey Dxj8pDHoaiWox49YsKhQHE, node 4628:17674 (section 4628:17657 안). */
const FIGMA_URL =
  'https://www.figma.com/design/Dxj8pDHoaiWox49YsKhQHE/%EA%B3%B5%EC%9C%A0%EC%9A%A9--LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%88%98%EC%97%85%EC%9E%90%EB%A3%8C-%EA%B3%BC%EC%A0%952--%EB%B3%B5%EC%82%AC-?node-id=4628-17657';

const meta = {
  title: 'Pages/SignIn',
  component: SignIn,
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
          'Figma `page/Login/SignIn`. 회원가입 화면입니다. ' +
          '**새로 만든 컴포넌트도, 새로 추가한 토큰도 없습니다.**\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`hasTitle=false`) → ' +
          '`TextSetTitle`(`size=xl`, 한 줄) → `TextFieldText`(아이디) → ' +
          '`TextFieldPassword`(비밀번호) → `Button`(`filled-secondary`, 폭 전체) → ' +
          '`OSBarBottomNavigation`.\n\n' +
          '**`Pages/Login` 과 다른 점은 셋뿐입니다** — 타이틀이 한 줄, 하단 TextButton 행이 없음, ' +
          'CTA 가 하나이고 폭을 다 씀.\n\n' +
          '**두 필드는 실제로 입력됩니다.** 비밀번호의 눈 아이콘은 표시/숨김을 토글합니다.\n\n' +
          '**[회원가입] 은 Supabase Auth 로 가입 요청을 보냅니다.** `signUp` → `profiles` 에 ' +
          '본인 행 생성(`id`, `username`) → `/consent` 이동 순서입니다. 실패하면 두 필드가 error ' +
          '상태가 되고 비밀번호 필드 하단에 사유가 뜹니다. 요청 처리 중에는 버튼이 비활성화됩니다.\n\n' +
          '**아이디가 이메일 형식이 아니면 요청을 보내지 않습니다.** `Pages/Login` 과 같은 ' +
          '`isEmail` 판정입니다.\n\n' +
          '⚠ 이 스토리는 실제 Supabase 프로젝트에 계정을 만듭니다. `.env.local` 의 ' +
          '`VITE_SUPABASE_URL`·`VITE_SUPABASE_ANON_KEY` 가 필요합니다.\n\n' +
          '`<form>` 은 두지 않았습니다.',
      },
    },
  },
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 두 필드가 비어 있는 최초 상태입니다. */
export const Default: Story = {};
