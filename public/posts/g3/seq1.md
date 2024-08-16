최상단에 navbar에 게시판으로 이동할 메뉴를 추가하려고 한다.<br/>
메뉴 버튼을 만들고, 눌렀을 때 오버레이 형태로 화면에 메뉴가 drop되는 형태로 구현했다.<br/>
먼저 DB에 메뉴를 저장하고 사용 중으로 활성화된 메뉴만 화면에 뿌려줄 예정이므로, Entity, Service, Repository, DTO, Controller를 구현하였다.
<br/><br/>

### 1. Entity

/src/main/java/com/example/rmfr/menu/entity/Menus.java

```
package com.example.rmfr.menu.entity;

import com.example.rmfr.member.entity.Members;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "menus")
@Data
@DynamicInsert
@DynamicUpdate
public class Menus {

    // menuUuid : 고유번호
    @Id
    @GenericGenerator(name="uuid2", strategy = "uuid2")
    @GeneratedValue(generator="uuid2")
    @Column(columnDefinition = "VARCHAR(100)")
    private String menuUuid;

    // menuName : 이름
    @Column(columnDefinition = "VARCHAR(50)")
    private String menuName;

    // menuType : 유형, 0 - title, 1 - subMenus
    @Column(columnDefinition = "INT")
    private int menuType;

    // menuSection : 화면 섹션, 1~3
    @Column(columnDefinition = "INT")
    private int menuSection;

    // menuSeq : 순서 번호
    @Column(columnDefinition = "INT")
    private int menuSeq;

    // menuLink : 링크 URL
    @Column(columnDefinition = "VARCHAR(1000)")
    private String menuLink;

    // menuStatus : 사용 여부, 0 - 사용 / 1 - 미사용
    @Column(columnDefinition = "INT DEFAULT 0")
    private int menuStatus;

    // menuAuth : 권한, 0 - 전체 공개, 1 - 회원 공개, 2 - 비공개
    @Column(columnDefinition = "INT DEFAULT 1")
    private int menuAuth;

    // menuRegUuid : 등록 회원
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "menuRegUuid")
    private Members menuRegUuid;

    // menuRegDate : 등록 일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime menuRegDate;

    // menuUpdaterUuid : 수정 회원
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "menuUpdaterUuid")
    private Members menuUpdaterUuid;

    // menuUpdateDate : 수정 일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime menuUpdateDate;

    public Menus() {}
}
```

### 2. Service

나중이되면 관리자 메뉴에서 메뉴를 추가/삭제하는 등의 기능을 구현할 예정이다.<br/>
지금은 직접 DB에 입력하고 저장된 메뉴를 불러오는 기능만 구현했다.
<br/><br/>

##### ① MenuService

/src/main/java/com/example/rmfr/menu/service/MenuService.java

```
package com.example.rmfr.menu.service;

import com.example.rmfr.menu.dto.MenusDto;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
@Service
public interface MenuService {

    public List<MenusDto> getMenus(Principal principal);
}
```

##### ② MenuServiceImpl

/src/main/java/com/example/rmfr/menu/service/impl/MenuServiceImpl.java

```
package com.example.rmfr.menu.service;

import com.example.rmfr.menu.dto.MenusDto;
import com.example.rmfr.menu.entity.Menus;
import com.example.rmfr.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;

    @Override
    public List<MenusDto> getMenus(Principal principal) {
        List<MenusDto> dtos = new ArrayList<>();
        try {
            int status = principal != null ? 1 : 0; // 로그인된 유저일 때 1, 아닐 때 0
            List<Menus> entities = menuRepository.findByMenuStatusLessThanEqualOrderByMenuSectionAscMenuSeqAsc(status);

            for ( Menus menu : entities ) {
                dtos.add(new MenusDto().of(menu));
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return dtos;
    }
}
```

### 3. Repository

메서드 명이 엄〰〰청 길다.🙄<br/>
Service에서 status를 넘길 때, 로그인 유무를 따져 1, 0으로 보내준다.<br/>
`findBy${columnName}LessThanEqual` 이라는 메서드는 parameter로 전달한 값보다 ${columnName}의 값이 작거나 같은 것을 조회한다.<br/>
따라서, 로그인되지 않은 유저는 menuStatus가 0이고, 회원만 조회할 수 있는 메뉴는 조회할 수 없도록 한다.
<br/><br/>
또한, `findBy~~OrderBy${columnName}${OrderType}~~`으로 지정하면 ${columnName} 값이 ${OrderType}에 정의된 기준으로 정렬되어 조회된다.<br/>

/src/main/java/com/example/rmfr/menu/repository/MenuRepository.java

```
package com.example.rmfr.menu.repository;

import com.example.rmfr.menu.entity.Menus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MenuRepository extends JpaRepository<Menus, String> {

    public List<Menus> findByMenuStatusLessThanEqualOrderByMenuSectionAscMenuSeqAsc(int menuStatus);
}

```

### 4. DTO

/src/main/java/com/example/rmfr/menu/dto/MenusDto.java

```
package com.example.rmfr.menu.dto;

import com.example.rmfr.member.entity.Members;
import com.example.rmfr.menu.entity.Menus;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class MenusDto {

    private String menuUuid;
    private String menuName;
    private int menuType;
    private String menuClass;
    private int menuSection;
    private int menuSeq;
    private String menuLink;
    private int menuStatus;
    private int menuAuth;
    private Members menuRegUuid;
    private LocalDateTime menuRegDate;
    private Members menuUpdaterUuid;
    private LocalDateTime menuUpdateDate;

    public MenusDto() {}

    // Entity -> DTO
    public MenusDto of(Menus menus) {
        this.menuUuid = menus.getMenuUuid();
        this.menuName = menus.getMenuName();
        this.menuType = menus.getMenuType();
        this.menuClass = menus.getMenuType() == 0 ? "titles" : "subMenus";
        this.menuSection = menus.getMenuSection();
        this.menuSeq = menus.getMenuSeq();
        this.menuLink = menus.getMenuLink();
        this.menuStatus = menus.getMenuStatus();
        this.menuAuth = menus.getMenuAuth();
        this.menuRegUuid = menus.getMenuRegUuid();
        this.menuRegDate = menus.getMenuRegDate();
        this.menuUpdaterUuid = menus.getMenuUpdaterUuid();
        this.menuUpdateDate = menus.getMenuUpdateDate();
        return this;
    }
}
```

### 5. Controller

/src/main/java/com/example/rmfr/menu/controller/MenuRestController.java

```
package com.example.rmfr.menu.controller;

import com.example.rmfr.menu.dto.MenusDto;
import com.example.rmfr.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
@RestController
@RequiredArgsConstructor
@Slf4j
public class MenusRestController {

    private final MenuService menuService;

    @GetMapping("/rest/menuList")
    public List<MenusDto> getMenus(Principal principal) {
        return menuService.getMenus(principal);
    }
}

```

DB에 저장된 메뉴를 불러오기 위한 서버 작업은 마무리되었다.<br/>
이제 화면에서 `/rest/menuList`를 호출하여 메뉴를 출력해보자.😎
