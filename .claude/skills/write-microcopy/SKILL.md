---
name: write-microcopy
description: Layout Architect가 만든 UI 트리의 빈 텍스트·더미 텍스트를 B2B 어드민에 맞는 실무 마이크로카피로 채운다. Figma 노드 생성 전 마지막 콘텐츠 채우기 단계. ux-writer 에이전트를 호출한다.
---

# /write-microcopy

**이 작업을 인라인으로 하지 않는다.** 반드시 `Agent`(subagent_type: `ux-writer`)를 호출한다.

## 절차

### 1. 입력 확인 (호출 전)

| 필요 | 없으면 |
|---|---|
| 텍스트를 채울 UI 트리 — `/design-layout` 산출물(`*-Layout_Tree.json`) | 사용자에게 묻는다. 추측하지 않는다 |
| 원본 PRD 또는 도메인 컨텍스트 (용어 선택 근거) | 없으면 `/analyze-prd` 산출물을 함께 넘긴다. 그것도 없으면 사용자에게 도메인을 확인한다 |
| 대상 화면/기능명 (`{FeatureName}` — 산출물 파일명에 쓴다) | 사용자에게 묻는다 |

### 2. 에이전트 호출

`Agent`를 `subagent_type: "ux-writer"`로 호출한다. 프롬프트에 반드시 포함:

- 텍스트를 채울 UI 트리 전체
- PRD/도메인 컨텍스트
- 화면/기능명
- 산출물 저장 경로: `/docs/ui_specs/{FeatureName}-Text_Populated_Tree.json` (에이전트가 이
  경로에만 쓰고, 입력으로 받은 원본 Layout Tree 파일은 건드리지 않는다는 것을 명시)

### 3. 반환 검증

`ux-writer`는 `Write` 권한이 있어 산출물 파일을 직접 쓴다. 완료 후 아래를 확인한다:

- `'Lorem Ipsum'`·`'테스트'`·`'가나다'`·`'버튼1'` 같은 더미 텍스트가 하나도 없다
- 입력 트리의 계층 구조·Auto Layout 속성(`layoutMode`, `itemSpacing`, `padding` 등)이
  텍스트 값 교체 전후로 완전히 동일하다
- 각 텍스트가 3~5단어 이내의 간결한 표현이다
- 입력에 없던 알림창·설명 문구 등 새 노드가 추가되지 않았다
- 원본 `*-Layout_Tree.json` 파일이 그대로 남아 있다 (덮어써지지 않았다)

다음이면 다시 요청한다:
- 위 확인 항목 중 하나라도 위반됐다
- 도메인 용어가 일반적인 단어로만 채워져 B2B 맥락이 드러나지 않는다

### 4. 다음 단계

이 산출물이 Figma 노드 생성 단계의 최종 입력이다. 이 스킬은 Figma 노드를 직접 만들지
않는다 — 그 작업은 별도 스킬/에이전트의 역할이다.
