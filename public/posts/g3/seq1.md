### 게시판 Entity 설계

회원가입/로그인을 마치고 이번엔 기본적인 형태의 게시판을 구현해보았다.<br/>
게시판을 구성하는 요소는 다음과 같다.
<br/><br/>

① 게시물 (BoardItems)
&nbsp; - itemUuid : 고유번호
&nbsp; - itemSeq : 순번
&nbsp; - itemHeader : 머리말
&nbsp; - itemTitle : 제목
&nbsp; - itemContents : 내용
&nbsp; - itemKeywords : 해시태그 형태 키워드
&nbsp; - itemStatus : 상태
&nbsp; - itemRegUuid : 등록 회원 고유번호
&nbsp; - itemRegDate : 등록 일자
&nbsp; - itemUpdaterUuid : 수정 회원 고유번호
&nbsp; - itemUpdateDate : 수정 일자
&nbsp; - itemHits : 조회자 리스트
&nbsp; - itemLikes : 좋아요 등록자 리스트
&nbsp; - itemComments : 댓글 등록자 리스트

/src/main/java/com/example/rmfr/board/entity/BoardItems.java

```
package com.example.rmfr.board.entity;

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

    @Id
    @GenericGenerator(name="uuid2", strategy = "uuid2")
    @GeneratedValue(generator="uuid2")
    @Column(columnDefinition = "VARCHAR(100)")
    private String itemUuid;

    @Column(columnDefinition = "INT")
    private int itemSeq;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="itemHeaderId", name = "itemHeader")
    private ItemHeaders itemHeader;

    @Column(columnDefinition = "VARCHAR(200)", nullable=false)
    private String itemTitle;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable=false)
    private String itemContents;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String itemKeywords;

    @Column(columnDefinition = "INT")
    private int itemStatus;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "itemRegUuid")
    private Members itemRegUuid;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime itemRegDate;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(referencedColumnName="memUuid", name = "itemUpdaterUuid")
    private Members itemUpdaterUuid;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime itemUpdateDate;

    @OneToMany(mappedBy = "itemUuid", fetch = FetchType.EAGER)
    List<ItemHits> itemHits = new ArrayList<>();

    @OneToMany(mappedBy = "itemUuid", fetch = FetchType.EAGER)
    List<ItemLikes> itemLikes = new ArrayList<>();

    @OneToMany(mappedBy = "itemUuid", fetch = FetchType.EAGER)
    List<ItemComments> itemComments = new ArrayList<>();

    public BoardItems() {}
}
```
