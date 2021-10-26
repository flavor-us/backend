# FlavorUs 백엔드 서버

flavorUs 서비스의 MVP 프로젝트로 진행되는 안드로이드 네이티브 어플리케이션의 백엔드 서버 코드입니다.
<br><br>
협업을 위한 명세로, 프로젝트를 다운로드 받아도 RDS 엔드포인트에 접근할 수 없으므로 <b>서버를 활용할 수 없습니다.<b>

[FLAVORUS 웹 사이트](https://www.notion.so/lightningcy/FlavorUs-ffe29c76eacf4f04be7719d14626992f)

## ENVIRONMENT
AWS EC2 서버의 t2.micro 환경에서 구동 중입니다.<br><br>
DATABASE는 AWS RDS (Mysql)를 활용 중이며 ec2 인스턴스에서만 접근 할 수 있습니다.<br><br>
NODEJS, EXPRESS , MYSQL , NUNJUCKS , NGINX 를 활용합니다.<br>

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

> default로 3000번 포트에서 서버가 구동됩니다.

* Web Controller 와 App Controller 가 분리되어 있으며 /web 과 /app 으로 라우팅합니다.

<br>

## APP 컨트롤러 명세

### 1. 식당 이름 리스트 반환 <br>
```  
  URL : "app/name"
  METHOD : POST
  RETURN : restData
  RETURN TYPE : JsonArray
```
  req.file 의  EXIF 데이터에서 위치정보 추출하여 jsonarray 반환 <br><br>
  식당명(name), 위도(lat), 경도(lng)
  
  > restData 의 내용 에시
  <img width="339" alt="스크린샷 2021-10-26 오후 12 33 55" src="https://user-images.githubusercontent.com/58672664/138844227-81800596-bc7c-4983-a70a-a24075b4faaa.png">
<br>

### 2. 인공지능 인식 결과 반환 <br>
```
  URL : "app/rekog"
  METHOD : POST
  RETURN : rekogData, filename, userId(admin : 1)
  RETURN TYPE : JsonArray
```
  req.file 객체를 AWS S3 스토리지에 업로드 , Rekognition 결과 json 반환
  
  > rekogData 의 내용 예시
  <img width="339" alt="스크린샷 2021-10-26 오후 5 59 43" src="https://user-images.githubusercontent.com/58672664/138846779-67de74df-0aad-4ad6-afe8-93c37a882294.png">

  > filename 의 내용 예시 (filename 은 uploadedFileInfo의 key 입니다.)
  <img width="757" alt="스크린샷 2021-10-26 오후 6 02 31" src="https://user-images.githubusercontent.com/58672664/138847062-d5f15b8e-c2d3-4efc-8336-91654d124717.png">
  
  
