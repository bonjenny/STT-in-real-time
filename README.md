# AI Real-time Meeting Notes (Tiro Reference)

이 프로젝트는 실시간 음성을 텍스트로 변환(STT)하고, LLM을 통해 마크다운 형식의 회의록 블록을 자동으로 생성하는 웹 애플리케이션입니다.

## 🛠️ 기술 스택

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB
- **AI Services:** OpenAI Whisper (STT), GPT-4o-mini (Summary/Structuring)

## 🚀 실행 방법

### 1. 사전 요구사항 (Prerequisites)

- **Node.js**: v18.0.0 이상 권장
- **MongoDB**: 로컬 또는 원격 MongoDB 인스턴스가 실행 중이어야 합니다.
- **OpenAI API Key**: Whisper 및 GPT 사용을 위해 필수입니다.

### 2. 프로젝트 설정 (Setup)

**서버 (Backend)**

1.  서버 디렉토리로 이동 및 의존성 설치:
    ```bash
    cd server
    npm install
    ```
2.  환경 변수 설정:
    `server/.env` 파일을 생성하고 아래 내용을 입력하세요.
    ```env
    MONGO_URI=mongodb://localhost:27017/stt-notes
    OPENAI_API_KEY=sk-your-openai-api-key-here
    PORT=5000
    ```

**클라이언트 (Frontend)**

1.  클라이언트 디렉토리로 이동 및 의존성 설치:
    ```bash
    cd client
    npm install
    ```

### 3. 애플리케이션 실행 (Run)

두 개의 터미널을 열어 각각 실행합니다.

**Terminal 1: Backend**

```bash
cd server
npm run dev
```

**Terminal 2: Frontend**

```bash
cd client
npm run dev
```

### 4. 사용 방법

1.  브라우저에서 `http://localhost:5173` 접속.
2.  자동으로 새 회의록이 생성됩니다.
3.  하단의 **Start Recording** 버튼을 클릭하여 녹음을 시작합니다.
4.  말을 하면 약 10초마다 서버로 전송되어 인식 및 요약이 진행됩니다.
5.  생성된 마크다운 블록이 화면에 실시간으로 표시됩니다.
6.  블록을 클릭하여 내용을 직접 수정할 수 있습니다.

## ⚠️ 주의사항

- **비용:** OpenAI API 사용량에 따라 비용이 발생합니다.
- **브라우저 권한:** 마이크 접근 권한을 허용해야 합니다.
- **Node 버전:** 현재 프로젝트는 Node v18 환경에서 테스트되었습니다. `npm install` 시 엔진 경고가 뜰 수 있으나, 주요 기능 작동에는 문제가 없습니다.
