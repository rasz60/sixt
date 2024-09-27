### MySQL 연동하기

이번 프로젝트에서는 JPA를 사용해 DB에 접근하려고 한다.<br/>
JPA가 Entity Class에 정의된대로 직접 테이블을 만들기 때문에 계정, Schema, Datasource 설정만 하면 된다.<br/>
우선 MySQL을 설치한다❗
<br/><br/>

#### ① MySQL 설치 및 계정/Schema 추가

[🔗다운로드](https://dev.mysql.com/downloads/windows/installer/8.0.html)
[🔗설치 가이드](https://hongong.hanbit.co.kr/mysql-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0mysql-community-8-0/)<br/>

설치 가이드에서 Samples and Examples를 제외하고 설치하였고, 설치된 Workbench에서 root 계정으로 로그인한다.<br/>
여기서 이번 프로젝트에서 사용할 Schema와 계정을 생성한다.

```
-- mysql schema 접속
USE mysql;

-- 계정 생성
CREATE USER 'rmfr'@localhost identified by '${비밀번호}';

-- 계정 생성 확인
SELECT * FROM USER WHERE USER = 'rmfr';

-- 아이디/비밀번호 로그인 방식으로 변경
UPDATE USER SET plugin = 'mysql_native_password' WHERE USER = 'rmfr';

-- 스키마 생성
CREATE SCHEMA rmfrDB;

-- rmfrDB 접속
USE rmfrDB;

-- rmfr 계정에 rmfrDB 하위 모든 테이블에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON rmfrDB.* TO 'rmfr'@'localhost';
```

<br/><br/>

그리고 나서 다시 workbench 메인 화면으로 돌아가서 아래 캡처이미지를 번호 순서대로 선택하고,<br/>
④ 빈 칸에 접속할 db와 계정정보를 입력하고 나면 메인 페이지에 root 계정 옆에 계정이 추가되어 로그인할 수 있다.<br/>
![img1](/sixt/images/workbench-capture.jpg)
<br/><br/>

#### ② Spring-boot 프로젝트 DB 연동

생성한 DB를 boot 프로젝트와 연동하기 위해서 application.yml에 Datasource 설정을 추가한다.
<br/><br/>

src/main/resources/application.yml

```
server:
  port: 8082

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/rmfrDB?serverTimezone=Asia/Seoul
    username: rmfr
    password: ${비밀번호}
```

#### ③ JPA 설정

실제 DB 작업은 JPA 통해서 할 예정이므로, application.yml에 JPA 설정도 추가해준다.<br/>

src/main/resources/application.yml

```
server:
  port: 8082

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/rmfrDB?serverTimezone=Asia/Seoul
    username: rmfr
    password: ${비밀번호}
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
    open-in-view: false
    show_sql: true
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
        highlight_sql: true
        use_sql_comments: true
```

JPA 설정 항목이 많아서 하나하나 정리해보았다.
<br/><br/>
① database-platform<br/>
＋ MySQL 버전에 맞는 hibernate package 작성
<br/><br/>
② open-in-view<br/>
＋ @Transactional 메소드 실행 시, JPA에서 DB Connection을 언제 맺고 끊을지를 설정<br/>
＋ true : Client 단의 응답이 완료된 다음, Connection close<br/>
＋ false : 메서드가 종료되면 Connection close
<br/><br/>
③ show-sql<br/>
＋ 실제로 수행되는 쿼리문 콘솔에 보여주기
<br/><br/>
④ hibernate.ddl-auto<br/>
&nbsp;⑴ create<br/>
&nbsp;&nbsp;＋ 엔티티로 등록된 클래스와 매핑되는 테이블을 자동으로 생성<br/>
&nbsp;&nbsp;＋ 기존에 해당 클래스와 매핑되는 테이블이 존재한다면 기존 테이블을 삭제(drop)하고 테이블을 생성<br/>
&nbsp;⑵ create-drop<br/>
&nbsp;&nbsp;＋ create와 동일하게 엔티티 클래스 테이블 생성 후, App이 종료될 때 테이블을 삭제<br/>
&nbsp;⑶ update (\* 프로젝트에 적용된 설정)<br/>
&nbsp;&nbsp;＋ create와 동일하게 신규 엔티티 클래스 테이블 생성<br/>
&nbsp;&nbsp;＋ 자료형이나 속성 변경 값은 감지하지 못함, 엔티티/컬럼 추가 유무만 판단하여 업데이트<br/>
&nbsp;⑷ validate<br/>
&nbsp;&nbsp;＋ 엔티티 클래스와 테이블이 정상적으로 매핑되는지만 검사<br/>
&nbsp;&nbsp;＋ 테이블이 아예 존재하지 않거나, 테이블에 엔티티의 필드에 매핑되는 컬럼이 존재하지 않으면 예외를 발생시키면서 애플리케이션을 종료<br/>
&nbsp;&nbsp;＋ 엔티티 클래스의 필드가 매핑되는 테이블에 모두 존재하기만 한다면, 테이블의 컬럼이 더 많더라도 괜찮음<br/>
&nbsp;⑸ none<br/>
&nbsp;＋ 엔티티 클래스 변화에 대한 아무 반응도 하지 않음<br/>

###### hibernate.ddl-auto 권장 사항 (김영한 JPA 강좌)

```
개발 초기 단계 또는 로컬에서 테스트 : create 또는 update
테스트 서버 : update 또는 validate
스테이징 및 운영 서버 : validate 또는 none
```

<br/>
⑤ properties.hibernate<br/>
&nbsp;⑴ format\_sql : 콘솔 로그에 포맷팅 된 sql문으로 입력<br/>
&nbsp;⑵ highlight\_sql : ANSI 문 식별하여 색깔 처리<br/>
&nbsp;⑶ use\_sql\_comments : SQL 내부에 /\* \*/의 주석을 추가
<br/><br/>

#### ④ Entity 추가

JPA 설정이 완료되고나서 Members라는 이름의 Entity 클래스를 작성해보았다.<br/>
Members 클래스는 이번 프로젝트의 회원 정보를 담는 Entity이며 아래와 같이 구성했다.<br/>
클래스를 추가하고 프로젝트를 run하면 프로젝트와 연동한 MySQL Schema에 members 테이블이 생성된 것을 확인할 수 있다.
<br/><br/>

src/main/java/com/example/rmfr/member/entity/Members.java

```
package com.example.rmfr.member.entity;

import com.example.rmfr.member.dto.MemberDto;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Data
@DynamicInsert
@DynamicUpdate
public class Members {    // MEMBERS Entity 테이블
    @Id
    @GenericGenerator(name="uuid2", strategy = "uuid2")
    @GeneratedValue(generator="uuid2")
    @Column(columnDefinition = "VARCHAR(100)")
    private String memUuid;

    @Column(columnDefinition = "VARCHAR(40)")
    private String memId;

    @Column(columnDefinition = "VARCHAR(100)", nullable=false)
    private String memPw;

    @Column(columnDefinition = "VARCHAR(200)", nullable=false)
    private String memEmail;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer memLevel;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime memPwUpdateDate;

    @Column(columnDefinition = "VARCHAR(11)")
    private String memPhone;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String zipcode;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String memAddr1;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String memAddr2;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime memRegDate;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime memDelDate;

    @Column(columnDefinition = "VARCHAR(1) DEFAULT 'N'")
    private String memDelYn;

}

}
```

어노테이션 부터 하나씩 떼어내서 보자.
<br/><br/>

`@Data`<br/>
&nbsp;＋ Lombok 어노테이션, 해당 클래스 모든 속성의 getter, setter, 생성자까지 만들어준다.
<br/><br/>

`@Entity`<br/>
&nbsp;＋ JPA가 프로젝트 내에서 entity 클래스임을 인식할 수 있도록 해주는 어노테이션
<br/><br/>

`@Table`<br/>
&nbsp;＋ JPA가 실제로 DB에 테이블을 생성할 때, 테이블에 대한 정보
<br/><br/>

`@DynamicInsert` | `@DynamicUpdate`<br/>
&nbsp;＋ Default 속성을 위해서 동적인 insert, update할 수 있도록 설정<br/>
&nbsp;＋ 과거에 진행했던 프로젝트에서 [issue#2. JPA Default 설정 무시되는 현상](/#/logging/2/18)이 발생하여 이번 프로젝트는 시작부터 추가해주었다.
<br/><br/>

`@Id`<br/>
&nbsp;＋ 테이블 생성 시 해당 속성을 PK로 지정한다.
<br/><br/>

`@GenericGenerator`<br/>
&nbsp;＋ Hibernate 에서 제공하는 @GenericGenerator 를 사용하면, Optimizer 를 직접 지정해서 최적화할 수 있다.<br/>
&nbsp;＋ MySQL은 sequence를 제공하지 않기 때문에, uuid로 지정했다.<br/>
<br/><br/>

`@GeneratedValue`<br/>
&nbsp;＋ 기본키를 자동으로 생성해주는 어노테이션이다.<br/>
&nbsp;＋ strategy에 정의된 방식으로 Id 값을 생성한다.<br/>
&nbsp; ⓐ GenerationType.IDENTITY : 식별자 생성을 데이터베이스에 위임한다.<br/>
&nbsp; ⓑ GenerationType.SEQUENCE : 데이터베이스의 sequence를 이용한다.<br/>
&nbsp; ⓒ GenerationType.TABLE : 기 생성용 테이블을 사용한다.(???)<br/>
&nbsp; ⓓ GenerationType.AUTO : 데이터 베이스 방언에 따라 자동 지정된다. (Default)<br/>
&nbsp;＋ generator="${@GenericGenerator.Name}"으로 지정하면 GenericGenerator로 정의한 strategy로 value가 생성된다.
<br/><br/>

`@Column`<br/>
&nbsp;＋ columnDefinition : 자료형, 길이, Default 등 설정<br/>
&nbsp;＋ nullable : null 허용 유무 설정<br/>
&nbsp;＋ 이 외 unique 등 제약조건 설정 가능
<br/><br/>

column이 되는 속성 명은 camelCase 형태로 입력하면 camel_case 형태의 컬럼이 생성된다.<br/>
다음으로는 Vue3를 연동하여 간단한 회원가입 페이지를 만들어보겠다.😎
