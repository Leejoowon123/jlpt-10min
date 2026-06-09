# 데이터 / 라이브러리 라이선스 메모

## 코드
- 본 저장소의 JavaScript / CSS / HTML 은 본 프로젝트용으로 작성한 신규 코드입니다.
- 외부 npm 패키지에 의존하지 않습니다.

## 학습 콘텐츠 (data/*.js)
- `vocab.js`, `grammar.js`, `reading.js`, `listening.js`, `grammarPairs.js` 의 예문/번역/해설은 본 프로젝트용 창작 샘플입니다.
- 외부 사전 데이터(JMdict, KANJIDIC2 등)나 시판 교재 문장은 포함되어 있지 않습니다.
- 향후 공개 라이선스 데이터를 임포트할 경우 다음 가이드라인을 따르세요.

### JMdict / JMnedict
- 라이선스: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)
- 출처: https://www.edrdg.org/jmdict/edict.html
- 임포트 시 데이터 파일 헤더에 출처와 라이선스를 명시할 것. ShareAlike 조건상 파생물도 동일 라이선스로 공개해야 합니다.

### KANJIDIC2
- 라이선스: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)
- 출처: https://www.edrdg.org/kanjidic/kanjidic2.html
- 임포트 시 위와 동일하게 표기.

### Tatoeba (예문 코퍼스)
- 라이선스: Creative Commons Attribution 2.0 France (CC BY 2.0 FR) — 문장별로 다를 수 있음
- 출처: https://tatoeba.org
- 문장별 기여자/번역자 크레딧 보존 권장.

## 무료 TTS
- 브라우저 내장 Web Speech API (`SpeechSynthesisUtterance`) 사용. 외부 음성 합성 서비스에 데이터를 보내지 않습니다.
- 브라우저별 일본어 음성 가용성에 차이가 있어, 음성을 못 찾는 경우 사용자에게 폴백 안내가 표시됩니다.

## 이미지
- 단어 연상 카드는 동적 SVG 로 그립니다. 외부 이미지/이미지 생성 API 미사용. 이모지는 시스템 폰트 렌더링.
