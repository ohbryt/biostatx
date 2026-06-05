# BioStatX Claude Code 워크플로우 도입 제안

**작성:** Brown Biotech AI Team  
**날짜:** 2026-06-05  
**대상:** biostatx 개발팀  
**상태:** Internal Proposal

---

## Executive Summary

biostatx 코드베이스에 **Claude Code Dynamic Workflows**를 팀 코딩 표준으로 공식 도입 제안합니다.

현재 `.claude/workflows/stat-report.yaml`이 프로토타입으로 이미 존재합니다. 이를 정형화하고 확장해서 팀 전체의 반복 작업 속도 + 코드 품질을 동시에 개선합니다.

---

## What is Claude Code Dynamic Workflow?

Claude Code 에서 `/report`, `/plan`, `/review` 등의 슬래시 명령으로 실행하는 **작업 흐름 자동화**입니다.

YAML로 정의되며:
- 단계별 프롬프트 체인
- 파일 생성/수정 자동화
- 출력 포맷 (brief, code, report 등)

---

## 현재 biostatx 워크플로우 상태

| 항목 | 상태 |
|------|------|
| `stat-report.yaml` | ✅ 프로토타입 완성 |
| 데이터 검증 → 분석 → 차트 → brief | ✅ 4단계 완료 |
| 팀 표준 문서화 | ❌ 미정형 |

---

## 제안: 3단계 도입 로드맵

### Phase 1 — 표준 문서화 (이번 주)
- [ ] `CLAUDE.md`에 워크플로우 섹션 추가 (이미 존재 — 보강)
- [ ] `CONTRIBUTING.md`에 `/report`, `/plan` 사용법 명시
- [ ] 코드 리뷰 시 워크플로우 활용 규칙 추가

### Phase 2 — 워크플로우 확장 (2주 이내)
- [ ] `code-review.yaml` — PR 리뷰 워크플로우 추가
- [ ] `test-gen.yaml` — 테스트 자동 생성 워크플로우
- [ ] `deploy-check.yaml` — 배포 전 QA 체크리스트

### Phase 3 — 팀 채택 (1개월 이내)
- [ ] 모든 PR에 최소 1개 워크플로우 실행 의무화
- [ ] 월 1회 워크플로우 리뷰 + 개선 사이클

---

## 기대 효과

| 항목 | 현재 | 도입 후 |
|------|------|---------|
| 통계 분석 → brief 소요 시간 | ~45분 | ~10분 |
| 코드 리뷰 품질 | 사람 의존 | 워크플로우 + 사람 |
| 차트 생성 일관성 | 개별 구현 | 표준 템플릿 |

---

## 즉시 실행할 것 (오늘)

```bash
# biostatx repo에서 확인
cd /Users/ocm/apps/biostatx
claude /report
# → 데이터 입력 → 분석 → Notion brief 자동 생성
```

---

## Decision Required

1. **Phase 1 표준 문서화** — 이 proposal.merge() 할까요?
2. **Phase 2 워크플로우 확장** — 어떤 워크플로우 우선순위?
3. **팀 리뷰 주기** — 월 1회 or 격주 1회?

---

*Brown Biotech AI Team — "다 하자"*
