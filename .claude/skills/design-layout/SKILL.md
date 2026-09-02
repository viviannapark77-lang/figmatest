---
name: design-layout
description: PRD Analyzer가 도출한 UI 컴포넌트 목록으로 화면의 계층 구조와 Auto Layout(Flexbox) 트리를 설계한다. 디자인 토큰 적용 전에 사용한다. layout-architect 에이전트를 호출한다.
---

# /design-layout

**이 작업을 인라인으로 하지 않는다.** 반드시 `Agent`(subagent_type: `layout-architect`)를 호출한다.

## 절차

### 1. 입력 확인 (호출 전)

| 필요 | 없으면 |
|---|---|
| UI 컴포넌트 목록 — `/analyze-prd` 산출물 또는 그에 준하는 목록 | 사용자에게 묻는다. 추측하지 않는다 |
| 대상 화면/기능명 (`{FeatureName}` — 산출물 파일명에 쓴다) | 사용자에게 묻는다 |

### 2. 에이전트 호출

`Agent`를 `subagent_type: "layout-architect"`로 호출한다. 프롬프트에 반드시 포함:

- UI 컴포넌트 목록 전체 (목록에 없는 컴포넌트를 만들지 말라고 명시)
- 화면/기능명
- "색상·타이포그래피 등 시각적 속성은 정의하지 말고, 계층 구조와 Auto Layout 속성만 설계해 반환하라"

### 3. 반환 검증 + 파일 저장

`layout-architect`는 `Write` 권한이 없어 파일을 직접 쓰지 않는다. 반환된 JSON을 확인한 뒤,
**메인 세션이** `/docs/ui_specs/{FeatureName}-Layout_Tree.json`으로 저장한다.

확인 항목:
- 노드마다 `type`·`layoutMode`·`primaryAxisAlignItems`·`counterAxisAlignItems`·
  `layoutAlign`·`itemSpacing`·`padding`이 있다
- 입력받은 컴포넌트 목록에 없는 컴포넌트가 임의로 추가되지 않았다
- 색상·폰트·텍스트 크기 등 시각 속성이 섞여 있지 않다
- Auto Layout 중첩 뎁스가 5~6단계를 넘지 않는다

다음이면 다시 요청한다:
- 위 확인 항목 중 하나라도 위반됐다
- 입력 목록에 없는 컴포넌트나 기능이 추가됐다

### 4. 다음 단계

이 산출물은 `/apply-design-tokens`(`design-system-manager`)의 입력이다. 이 스킬은
색상·타이포그래피 등 시각적 스타일을 정의하지 않는다.
