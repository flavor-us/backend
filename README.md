## Foowinkle's Backend Server

flavorUs 서비스의 MVP 프로젝트로 진행되는 안드로이드 네이티브 어플리케이션 뿌잉클의 백엔드 서버 코드입니다.
<br>
협업을 위한 명세로, 프로젝트를 다운로드 받아도 RDS 엔드포인트에 접근할 수 없으므로 <b>서버를 활용할 수 없습니다.<b>

[FlavorUs 웹사이트](https://www.notion.so/lightningcy/FlavorUs-ffe29c76eacf4f04be7719d14626992f)<br>
  
[PlayStore 다운로드](https://play.google.com/store/apps/details?id=com.FLAVOR.mvp)

## ENVIRONMENT
AWS EC2 서버의 t2.micro 환경에서 구동 중입니다.<br><br>
DATABASE는 AWS RDS (Mysql)를 활용 중이며 ec2 인스턴스에서만 접근 할 수 있습니다.<br><br>
NODEJS, EXPRESS, MYSQL, NUNJUCKS, NGINX 를 활용합니다.

* 서버는 Amazon Web Service Ec2 인스턴스에서 구동 중입니다.

## PREREQUISITE

node Version 14 미만에서는 동작을 보장하지 못합니다. <br><br>
ES6 미만에서는 동작을 보장하지 못합니다.

## USAGE

```node
git clone
.env 파일 작성 (.env_sample 참조)
npm install
npm start
```

## API LIST 
  
<img width="308" alt="스크린샷 2022-03-27 오후 9 06 39" src="https://user-images.githubusercontent.com/58672664/160280721-a11824f7-5b6c-46b0-a82e-e6b0145ec883.png">
<img width="308" alt="스크린샷 2022-03-27 오후 9 06 08" src="https://user-images.githubusercontent.com/58672664/160280714-bdd26095-8c64-42e1-b467-971414b7c077.png">

