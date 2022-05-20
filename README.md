## Foowinkle's Backend Server

flavorUs 서비스의 MVP 프로젝트로 진행되는 안드로이드 네이티브 어플리케이션 뿌잉클의 백엔드 서버 코드입니다.
<br>

[FlavorUs](https://www.notion.so/lightningcy/FlavorUs-ffe29c76eacf4f04be7719d14626992f) 소개 페이지 | 
[PlayStore](https://play.google.com/store/apps/details?id=com.FLAVOR.mvp) 다운로드 링크

## Environment
AWS EC2 서버의 t2.micro 환경에서 구동 중입니다.<br><br>
DATABASE는 AWS RDS (Mysql)를 활용 중이며 ec2 인스턴스에서만 접근 할 수 있습니다.<br><br>
  
## Technical Stacks
NODEJS, EXPRESS, MYSQL, NGINX 를 활용합니다.

* 서버는 Amazon Web Service EC2 인스턴스에서 구동 중입니다.

## Prerequisite

node Version 14 미만에서는 동작을 보장하지 못합니다. <br><br>
ES6 미만에서는 동작을 보장하지 못합니다.

## Usage

```node
git clone
.env 파일 작성 (.env_sample 참조)
npm install
npm start
```

## ERD
  <img width="591" alt="image" src="https://user-images.githubusercontent.com/58672664/167283429-44d73272-7a9d-4d62-a98f-b8a885eea622.png">

## API 목록

<img width="308" alt="스크린샷 2022-03-27 오후 9 06 39" src="https://user-images.githubusercontent.com/58672664/160280721-a11824f7-5b6c-46b0-a82e-e6b0145ec883.png"><br>
<img width="308" alt="스크린샷 2022-03-27 오후 9 06 08" src="https://user-images.githubusercontent.com/58672664/160280714-bdd26095-8c64-42e1-b467-971414b7c077.png">

