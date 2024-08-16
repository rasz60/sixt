### 1. Entity / DTO

게시판으로 이동할 메뉴를 완성하였으니, 이제 본격적으로 게시판을 구현해보자.<br/>
Entity와 DTO를 작성하기 전에 이 프로젝트에서 Entity와 DTO를 어떻게 개념적으로 구분하였는지 정리해보았다.<br/>

##### Entity

&nbsp; - JPA에서 DB 테이블과 1:1로 매핑되는 객체 클래스<br/>
&nbsp; - Service 로직에서 필요한 참조 데이터를 가져올 때 사용<br/>

##### DTO

&nbsp; - Entity를 기준으로 실제 응용 단에서 불필요한 속성을 제외하거나 특정 기능 수행을 위해 필요한 속성을 정의한 객체 클래스<br/>
&nbsp; - App -> Server / Server -> App으로 Entity의 정보를 편집하여 보낼 때 사용<br/>
&nbsp; ex><br/>
&nbsp;&nbsp; - DB에서 가져온 회원 정보 중 비밀번호는 App으로 직접 보내면 안되므로 DTO에는 Password 속성을 정의하지 않음<br/>
&nbsp;&nbsp; - DB에서 가져온 게시물의 작성자 정보가 현재 로그인한 정보와 동일하면 수정/삭제 권한을 부여하는 방식으로 동적인 속성 DTO에 정의
<br/><br/>

위와 같은 개념으로 정의하고 생성자나 메서드로 필요에 따라 2가지 요소가 서로 변환될 수 있도록 로직을 구현해두었다.<br/>
회원가입/로그인 당시에는 무턱대고 구현하였는데..😅 게시판 구현하면서 일정 부분을 바꾸어 주었다.
<br/><br/>

/src/main/java/com/example/rmfr/entity/Members.java

```
package com.example.rmfr.member.entity;

import com.example.rmfr.member.dto.MemberDto;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "members")
@Data
@DynamicInsert
@DynamicUpdate
public class Members implements UserDetails {

    .
    .

    /* DTO -> Entity 메서드 변경 */
    public static Members of(MemberDto memberDto) {
        Members member = new Members();

        if ( memberDto.getMemPw() != null && !memberDto.getMemPw().isEmpty() ) {
            member.setMemPw(memberDto.getMemPw());
            member.setMemPwUpdateDate(LocalDateTime.now());
        }
        member.setMemEmail(memberDto.getMemEmail());
        member.setMemPhone(memberDto.getMemPhone());
        member.setZipcode(memberDto.getZipcode());
        member.setMemAddr1(memberDto.getMemAddr1());
        member.setMemAddr2(memberDto.getMemAddr2());

        return member;
    }

    .
    .

}
```

<br/>

/src/main/java/com/example/rmfr/dto/MemberDto.java

```
package com.example.rmfr.member.dto;

import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class MemberDto {
    private String memUuid;
    private String memId;
    private String memPw;
    private String memEmail;
    private Integer memLevel;
    private LocalDateTime memPwUpdateDate;
    private String memPhone;
    private String zipcode;
    private String memAddr1;
    private String memAddr2;

    /* Entity -> DTO 메서드 변경 */
    public static MemberDto of(Members member) {
        MemberDto dto = new MemberDto();

        dto.setMemUuid(member.getMemUuid());
        dto.setMemId(member.getMemId());
        dto.setMemEmail(member.getMemEmail());
        dto.setMemLevel(member.getMemLevel());
        dto.setMemPwUpdateDate(member.getMemPwUpdateDate());
        dto.setMemPhone(member.getMemPhone());
        dto.setZipcode(member.getZipcode());
        dto.setMemAddr1(member.getMemAddr1());
        dto.setMemAddr2(member.getMemAddr2());

        return dto;
    }
}
```

<br/><br/>

### 2. Entity 설계

게시판 구현을 위해 Entity로 설계할 요소는 게시물, 댓글, 머릿말, 좋아요(게시물/댓글), 조회 기록이다.
<br/><br/>

##### ① 게시물 (BoardItems)

/src/main/java/com/example/rmfr/board/entity/BoardItems.java

```
package com.example.rmfr.board.entity;

import com.example.rmfr.board.dto.BoardItemsDto;
import com.example.rmfr.board.entity.item.ItemComments;
import com.example.rmfr.board.entity.item.ItemHeaders;
import com.example.rmfr.board.entity.item.ItemHits;
import com.example.rmfr.board.entity.item.ItemLikes;
import com.example.rmfr.member.entity.Members;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "boardItems")
@Data
@DynamicInsert
@DynamicUpdate
public class BoardItems {

    // itemUuid : 게시물 고유번호
    @Id
    @GenericGenerator(name="uuid2", strategy = "uuid2")
    @GeneratedValue(generator="uuid2")
    @Column(columnDefinition = "VARCHAR(100)")
    private String itemUuid;

    // itemSeq : 게시물 순번
    @Column(columnDefinition = "INT")
    private int itemSeq;

    // itemHeader : 게시물 말머리
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="itemHeaderId", name = "itemHeader")
    private ItemHeaders itemHeader;

    // itemTitle : 게시물 제목
    @Column(columnDefinition = "VARCHAR(200)", nullable=false)
    private String itemTitle;

    // itemContents : 게시물 내용, MySQL LONGTEXT Type
    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable=false)
    private String itemContents;

    // itemKeywords : 게시물 키워드, #을 구분자로하는 문자열
    @Column(columnDefinition = "VARCHAR(1000)")
    private String itemKeywords;

    // itemStatus : 게시물 상태 - 0: 임시저장, 1: 등록, 2: 삭제
    @Column(columnDefinition = "INT")
    private int itemStatus;

    // itemRegUuid : 게시물 등록자
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "itemRegUuid")
    private Members itemRegUuid;

    // itemRegDate : 게시물 등록일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime itemRegDate;

    // itemUpdaterUuid : 게시물 수정자
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "itemUpdaterUuid")
    private Members itemUpdaterUuid;

    // itemUpdateDate : 게시물 수정 일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime itemUpdateDate;

    @OneToMany(mappedBy = "itemUuid", fetch = FetchType.EAGER)
    List<ItemHits> itemHits = new ArrayList<>();

    @OneToMany(mappedBy = "itemUuid", fetch = FetchType.EAGER)
    List<ItemLikes> itemLikes = new ArrayList<>();

    @OneToMany(mappedBy = "itemUuid", fetch = FetchType.EAGER)
    List<ItemComments> itemComments = new ArrayList<>();

    public BoardItems() {}

    // DTO -> Entity : 전체 요소 변환
    public static BoardItems of(BoardItemsDto boardItemsDto) {
        BoardItems boardItems = new BoardItems();

        boardItems.setItemUuid(boardItems.getItemUuid());
        boardItems.setItemSeq(boardItems.getItemSeq());
        boardItems.setItemHeader(boardItemsDto.getItemHeader());
        boardItems.setItemTitle(boardItemsDto.getItemTitle());
        boardItems.setItemContents(boardItemsDto.getItemContents());
        boardItems.setItemKeywords(boardItemsDto.getItemKeywords());
        boardItems.setItemStatus(boardItemsDto.getItemStatus());
        boardItems.setItemRegUuid(boardItemsDto.getItemRegUuid());
        boardItems.setItemRegDate(boardItemsDto.getItemRegDate());
        boardItems.setItemUpdaterUuid(boardItemsDto.getItemUpdaterUuid());
        boardItems.setItemUpdateDate(boardItemsDto.getItemUpdateDate());

        return boardItems;
    }

    // DTO -> Entity : 특정 부분만 변환 (게시물 수정)
    public void updateItems(BoardItemsDto boardItemsDto) {
        this.setItemHeader(boardItemsDto.getItemHeader());
        this.setItemTitle(boardItemsDto.getItemTitle());
        this.setItemContents(boardItemsDto.getItemContents());
        this.setItemKeywords(boardItemsDto.getItemKeywords());
        this.setItemStatus(boardItemsDto.getItemStatus());
        this.setItemUpdaterUuid(boardItemsDto.getItemUpdaterUuid());
        this.setItemUpdateDate(boardItemsDto.getItemUpdateDate());
    }
}
```

<br/><br/>

##### ② 댓글 (ItemComments)

/src/main/java/com/example/rmfr/board/entity/item/ItemComments.java

```
package com.example.rmfr.board.entity.item;

import com.example.rmfr.board.dto.ItemCommentsDto;
import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "itemComments")
@Getter
@Setter
@DynamicInsert
@DynamicUpdate
public class ItemComments {

    // itemUuid : 댓글을 작성한 게시물의 고유번호
    @Column(columnDefinition = "VARCHAR(100)")
    private String itemUuid;

    // commentUuid : 댓글 고유번호
    @Id
    @GenericGenerator(name="uuid2", strategy = "uuid2")
    @GeneratedValue(generator="uuid2")
    @Column(columnDefinition = "VARCHAR(100)")
    private String commentUuid;

    // commentDepth : 댓글 계층 레벨
    @Column(columnDefinition = "INT DEFAULT 0")
    private int commentDepth;

    // commentParentUuid : 모댓글 고유번호
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName="commentUuid", name ="commentParentUuid")
    private ItemComments commentParentUuid;

    // commentContents : 댓글 내용
    @Column(columnDefinition = "VARCHAR(300)")
    private String commentContents;

    // commentStatus : 댓글 상태 - 0: 등록 / 1: 삭제
    @Column(columnDefinition = "INT")
    private int commentStatus;

    // commentRegUuid : 댓글 작성자
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "commentRegUuid")
    private Members commentRegUuid;

    // commentRegDate : 댓글 작성 일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime commentRegDate;

    // commentUpdaterUuid : 댓글 수정자
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "commentUpdaterUuid")
    private Members commentUpdaterUuid;

    // commentUpdateDate : 댓글 수정 일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime commentUpdateDate;

    @OneToMany(mappedBy = "itemUuid", fetch = FetchType.EAGER)
    List<ItemLikes> commentLikes = new ArrayList<>();

    @OneToMany(mappedBy = "commentParentUuid", fetch = FetchType.EAGER)
    List<ItemComments> childComments = new ArrayList<>();


    public ItemComments() {}

    // DTO -> Entity
    public static ItemComments of(ItemCommentsDto itemCommentsDto) {
        ItemComments cmms = new ItemComments();

        cmms.setItemUuid(itemCommentsDto.getItemUuid());
        cmms.setCommentDepth(itemCommentsDto.getCommentDepth());
        cmms.setCommentContents(itemCommentsDto.getCommentContents());
        cmms.setCommentStatus(itemCommentsDto.getCommentStatus());
        cmms.setCommentRegUuid(itemCommentsDto.getCommentRegUuid());
        cmms.setCommentUpdaterUuid(itemCommentsDto.getCommentUpdaterUuid());
        cmms.setCommentRegDate(itemCommentsDto.getCommentRegDate());
        cmms.setCommentUpdateDate(itemCommentsDto.getCommentUpdateDate());

        return cmms;
    }
}
```

<br/><br/>

##### ③ 머릿말 (ItemHeaders)

/src/main/java/com/example/rmfr/board/entity/item/ItemHeaders.java

```
package com.example.rmfr.board.entity.item;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table(name = "ItemHeaders")
@Getter
@Setter
@DynamicInsert
@DynamicUpdate
public class ItemHeaders {

    // itemHeaderId : 말머리 고유 번호
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long itemHeaderId;

    // itemHeaderName : 말머리 이름
    @Column(columnDefinition = "VARCHAR(20)")
    private String itemHeaderName;

    // itemHeaderAuth : 말머리 권한, 1 - 일반, 2 - 관리자
    @Column(columnDefinition = "INT DEFAULT 1")
    private int itemHeaderAuth;

    // itemHeaderSortOrder : 정렬기준
    @Column(columnDefinition = "INT")
    private int itemHeaderSortOrder;

}
```

<br/><br/>

##### ④ 좋아요 (ItemLikes)

/src/main/java/com/example/rmfr/board/entity/item/ItemLikes.java

```
package com.example.rmfr.board.entity.item;

import com.example.rmfr.member.entity.Members;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "itemLikes")
@Getter
@Setter
@DynamicInsert
@DynamicUpdate
public class ItemLikes {

    // itemUuid : 좋아요가 눌린 컨텐츠(게시물, 댓글 등)의 고유번호
    @Column(columnDefinition = "VARCHAR(100)")
    private String itemUuid;

    // itemLikeId : 좋아요의 고유번호
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long itemLikeId;

    // itemLikerUuid : 좋아요를 누른 회원의 UUID
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "itemLikerUuid")
    private Members itemLikerUuid;

    // itemLikeDate : 좋아요를 누른 일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime itemLikeDate;

    public ItemLikes() {};
}

```

<br/><br/>

##### ④ 조회 기록 (ItemHits)

/src/main/java/com/example/rmfr/board/entity/item/ItemHits.java

```
package com.example.rmfr.board.entity.item;

import com.example.rmfr.board.entity.BoardItems;
import com.example.rmfr.member.entity.Members;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "itemHits")
@Getter
@Setter
@DynamicInsert
@DynamicUpdate
public class ItemHits {

    // itemUuid : 조회한 게시물의 고유번호
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="itemUuid", name = "itemUuid")
    private BoardItems itemUuid;

    // itemHits : 조회 정보 고유번호
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long itemHitId;

    // itemHitMemUuid : 조회한 회원의 UUID
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "itemHitMemUuid")
    private Members itemHitMemUuid;

    // itemHitDate : 조회한 일자
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime itemHitDate;

    public ItemHits() {};
}
```

Entity 설정하면서 회원 정보에서 사용하지 않았던 JPA 어노테이션을 정리해보자.
<br/><br/>

&nbsp; ① `@ManyToOne(fetch=FetchType.${TYPE})`<br/>
&nbsp;&nbsp; ⑴ entity 와 참조 entity 간의 연관관계 설정 (ManyToOne, OneToMany 등등)<br/>
&nbsp;&nbsp; ⑵ 엔티티 생성 시 참조되는 entity를 언제 생성할지는 fetch 속성으로 설정할 수 있다.<br/>
&nbsp;&nbsp;&nbsp;&nbsp; - FetchType.LAZY : 해당 엔티티 생성 시 연관 엔티티는 null인 상태로 생성하고 사용(get, set 등등) 시 생성<br/>
&nbsp;&nbsp;&nbsp;&nbsp; - FetchType.EAGER : 해당 엔티티 생성 시 연관 엔티티까지 모두 생성<br/>
&nbsp;&nbsp; ⑶ 해당 속성의 자료형은 참조하는 Entity 클래스로 지정한다.<br/>

###### ex> Members Entity를 참조하므로, itemHitsMemUuid의 자료형은 Members 클래스로 지정

```
@ManyToOne(fetch=FetchType.EAGER)
@JoinColumn(referencedColumnName="memUuid", name = "itemHitMemUuid")
private Members itemHitMemUuid;
```

<br/>

&nbsp; ② `@JoinColumn(referencedColumnName="${COLUMN_NAME}", name = "${COLUMN_NAME}")`<br/>
&nbsp;&nbsp; ⑴ ManyToOne, OneToMany 등으로 연결한 엔티티와 실제 JOIN에 대한 설정<br/>
&nbsp;&nbsp; ⑵ referencedColumnName : 참조 Entity의 어떤 컬럼을 기준으로 Join할지 설정, Entity 속성명으로 기입<br/>
&nbsp;&nbsp; ⑶ name : 현재 Entity에서 사용할 컬럼명 기입
<br/><br/>

### 3. DTO 설계

위에 설계한 Entity와 매핑되고 화면에서 사용할 속성이 추가된 DTO 클래스도 만들어주었다.
<br/><br/>

##### ① 게시물 (BoardItems)

/src/main/java/com/example/rmfr/board/dto/BoardItemsDto.java

```
package com.example.rmfr.board.dto;

import com.example.rmfr.board.entity.BoardItems;
import com.example.rmfr.board.entity.item.ItemHeaders;
import com.example.rmfr.member.entity.Members;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardItemsDto {

    // Entity Mapping
    private String itemUuid;
    private int itemSeq;
    private ItemHeaders itemHeader;
    private String itemHeaderName;
    private String itemTitle;
    private String itemContents;
    private String itemKeywords;
    private int itemStatus;
    private Members itemRegUuid;
    private LocalDateTime itemRegDate;
    private Members itemUpdaterUuid;
    private LocalDateTime itemUpdateDate;

    // DTO Attributes
    private String itemHeaderId; // 머릿말 아이디
    private int itemHitsCnt; // 조회 수
    private int itemLikesCnt; // 좋아요 수
    private int itemCommentsCnt; // 댓글 수

    private boolean cAuth; // 생성권한
    private boolean eAuth; // 수정권한
    private boolean dAuth; // 삭제권한

    private boolean likeItem;

    public BoardItemsDto() {}

    // Entity -> DTO
    public BoardItemsDto(BoardItems boardItems) {
        this.itemUuid = boardItems.getItemUuid();
        this.itemSeq = boardItems.getItemSeq();
        this.itemHeader = boardItems.getItemHeader();
        if ( this.itemHeader != null ) {
            this.itemHeaderName = boardItems.getItemHeader().getItemHeaderName();
        }
        this.itemTitle = boardItems.getItemTitle();
        this.itemContents = boardItems.getItemContents();
        this.itemKeywords = boardItems.getItemKeywords();
        this.itemStatus = boardItems.getItemStatus();
        this.itemRegUuid = boardItems.getItemRegUuid();
        this.itemRegDate = boardItems.getItemRegDate();
        this.itemUpdaterUuid = boardItems.getItemUpdaterUuid();
        this.itemUpdateDate = boardItems.getItemUpdateDate();
        this.itemHitsCnt = boardItems.getItemHits().size();
        this.itemLikesCnt = boardItems.getItemLikes().size();
        this.itemCommentsCnt = boardItems.getItemComments().size();
    }
}
```

<br/>

##### ② 댓글 (ItemComments)

/src/main/java/com/example/rmfr/board/dto/ItemCommentsDto.java

```
package com.example.rmfr.board.dto;

import com.example.rmfr.board.entity.item.ItemComments;
import com.example.rmfr.member.entity.Members;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ItemCommentsDto {

    // Entity Mapping
    private String itemUuid;
    private String commentUuid;
    private int commentDepth;
    private ItemCommentsDto parentComment;
    private String commentContents;
    private int commentStatus;
    private Members commentRegUuid;
    private LocalDateTime commentRegDate;
    private Members commentUpdaterUuid;
    private LocalDateTime commentUpdateDate;
    private int commentLikeCnt;
    private int commentChildCnt;

    // DTO Attr.
    private String commentParentUuid; // 모댓글 UUID
    private boolean editYn; // 수정 여부
    private boolean likeComment; // 좋아요 수
    private boolean childYn; // 대댓글 여부
    private boolean childOpen; // 대댓글 오픈 여부
    private boolean eAuth; // 수정 권한
    private boolean dAuth; // 삭제 권한

    public ItemCommentsDto() {}

    // Entity -> DTO
    public static ItemCommentsDto of(ItemComments itemComments) {
        ItemCommentsDto dto = new ItemCommentsDto();

        dto.setItemUuid(itemComments.getItemUuid());
        dto.setCommentUuid(itemComments.getCommentUuid());
        dto.setCommentDepth(itemComments.getCommentDepth());

        if ( itemComments.getCommentParentUuid() != null) {
            dto.setParentComment(ItemCommentsDto.of(itemComments.getCommentParentUuid()));
            dto.setCommentParentUuid(dto.getParentComment().getCommentParentUuid());
        }
        dto.setCommentStatus(itemComments.getCommentStatus());

        // 삭제된 댓글 내용 처리
        if ( dto.getCommentStatus() == 0 ) {
            dto.setCommentContents(itemComments.getCommentContents());
        } else {
            dto.setCommentContents("삭제된 댓글입니다.");
        }
        dto.setCommentRegUuid(itemComments.getCommentRegUuid());
        dto.setCommentRegDate(itemComments.getCommentRegDate());
        dto.setCommentUpdaterUuid(itemComments.getCommentUpdaterUuid());
        dto.setCommentUpdateDate(itemComments.getCommentUpdateDate());
        dto.setCommentLikeCnt(itemComments.getCommentLikes().size());
        dto.setCommentChildCnt(itemComments.getChildComments().size());

        dto.setEditYn(dto.getCommentUpdateDate().isAfter(dto.getCommentRegDate()));
        dto.setChildYn(dto.getCommentChildCnt() > 0);

        return dto;
    }
}
```

게시판 구현을 위한 Entity, DTO 설정이 완료되었다.😎
