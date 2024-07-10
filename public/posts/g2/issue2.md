### JPA Default 설정 방법

Entity로 지정한 클래스를 아래와 같이 생성했다.
<br/><br/>

src/main/java/com/example/rmfr/member/entity/Members.java

```
package com.example.rmfr.member.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Data
public class Members {
    // MEMBERS Entity 테이블
    @Id
    @Column(columnDefinition = "VARCHAR(40)")
    private String mId;

    @Column(columnDefinition = "VARCHAR(100)", nullable=false)
    private String mPw;

    @Column(columnDefinition = "VARCHAR(200)", nullable=false)
    private String mEmail;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer mLevel;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime mPwUpdateDate;

    @Column(columnDefinition = "VARCHAR(11)")
    private String mPhone;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String mAddr1;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String mAddr2;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String mAddr3;

}
```

mLevel와 mPwUpdateDate에 Default 설정을 해놓았지만, 실제 insert가 일어났을 때 값을 주지 않으면 그래도 null 값이 insert 되었다.<br/>
MySQL Workbench에서 실제 컬럼의 속성을 조회해보아도 Default 값이 제대로 설정되어있지만,<br/>
JPA에서 Insert, Update 시 Default 설정을 무시하고 parameter 값을 그대로 넣고 있다.
<br/><br/>

Default 설정을 제대로 적용시키려면 Entity 클래스에 `@DynamicInsert` | `@DynamicUpdate` 어노테이션을 추가한다.<br/>
이렇게 하면 동적으로 parameter를 인식하여 null인 경우 default 값을 적용하게 된다.<br/>

src/main/java/com/example/rmfr/member/entity/Members.java

```
package com.example.rmfr.member.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@DynamicInsert
@DynamicUpdate
@Data
public class Members {
    // MEMBERS Entity 테이블
    @Id
    @Column(columnDefinition = "VARCHAR(40)")
    private String mId;

    @Column(columnDefinition = "VARCHAR(100)", nullable=false)
    private String mPw;

    @Column(columnDefinition = "VARCHAR(200)", nullable=false)
    private String mEmail;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer mLevel;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime mPwUpdateDate;

    @Column(columnDefinition = "VARCHAR(11)")
    private String mPhone;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String mAddr1;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String mAddr2;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String mAddr3;

}
```
