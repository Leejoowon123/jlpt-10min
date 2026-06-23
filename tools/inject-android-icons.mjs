// (라운드 66) 비활성화 — no-op.
//
// 라운드 65 에서 이 스크립트는 생성된 Android 프로젝트의 런처 아이콘을 JLPT10M 브랜드 아이콘으로
// 강제 교체했으나, 사용자 요청에 따라 **기본(Capacitor 생성) 아이콘을 그대로 유지**하기로 했다.
// android-release.yml 의 호출 단계도 제거됨. 이 파일은 호환/이력 보존을 위해 no-op 으로 남긴다.
//
// 다시 브랜드 아이콘을 적용하려면 강제 복사 대신 docs/android-release.md §3-B 의
// @capacitor/assets 절차(밀도별 adaptive icon 생성)를 명시적으로 사용할 것.

console.log('inject-android-icons: 비활성화(no-op) — 기본 런처 아이콘 유지. (docs/android-release.md §3-B 참조)');
