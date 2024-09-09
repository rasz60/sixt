### 게시물 상세 조회 기능 구현하기 (1/2)

게시물을 작성했으니 이제 상세 페이지를 조회를 구현해보자.
<br/><br/>

##### ① Repository

/src/main/java/com/example/rmfr/board/repository/BoardItemsRepository.java

###### 글 번호(itemSeq)를 기준으로 게시물 정보를 불러온다.

```
package com.example.rmfr.board.repository;

import com.example.rmfr.board.entity.BoardItems;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface BoardItemsRepository extends JpaRepository<BoardItems, String>, JpaSpecificationExecutor<BoardItems> {

    Page<BoardItems> findByItemStatus(int itemStatus, PageRequest pageRequest);
    Optional<BoardItems> findByItemSeq(int seq); // 추가
}
```

/src/main/java/com/example/rmfr/board/repository/ItemLikesRepository.java

```
package com.example.rmfr.board.repository;

import com.example.rmfr.board.entity.BoardItems;
import com.example.rmfr.board.entity.item.ItemHits;
import com.example.rmfr.board.entity.item.ItemLikes;
import com.example.rmfr.member.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemLikesRepository extends JpaRepository<ItemLikes, Long> {

    Long countByItemUuid(String itemUuid); // 게시물의 좋아요 수
    Long countByItemUuidAndItemLikerUuid(String itemUuid, Members member); // 유저가 좋아요를 누른 게시물인지 확인
}
```

##### ② Service

다음으로는 게시글 정보를 불러올 service 단을 구현했다.
<br/><br/>

/src/main/java/com/example/rmfr/board/service/BoardItemsService.java

```
package com.example.rmfr.board.service;

import com.example.rmfr.board.dto.BoardItemsDto;
import com.example.rmfr.board.entity.item.ItemHeaders;
import com.example.rmfr.member.entity.Members;
import com.example.rmfr.result.RestResults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BoardItemsService {

    .
    .
    .

    public RestResults getBoardItem(int seq, Members member); // 게시글 조회하기 추가
}
```

/src/main/java/com/example/rmfr/board/service/impl/BoardItemsServiceImpl.java

```
package com.example.rmfr.board.service.impl;

import com.example.rmfr.board.dto.BoardItemsDto;
import com.example.rmfr.board.entity.BoardItems;
import com.example.rmfr.board.entity.item.ItemHeaders;
import com.example.rmfr.board.entity.item.ItemHits;
import com.example.rmfr.board.repository.*;
import com.example.rmfr.board.service.BoardItemsService;
import com.example.rmfr.member.entity.Members;
import com.example.rmfr.result.RestResults;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardItemsServiceImpl implements BoardItemsService {

    private final BoardItemsRepository boardItemsRepository;
    private final ItemHeadersRepository itemHeadersRepository;
    private final ItemHitsRepository itemHitsRepository; // 조회수 repository 추가
    private final ItemLikesRepository itemLikesRepository; // 좋아요 repository 추가

    .
    .
    .

    @Override
    public RestResults getBoardItem(int seq, Members member) {
        RestResults rst = new RestResults();
        try {
            Optional<BoardItems> optItem = boardItemsRepository.findByItemSeq(seq);

            if ( optItem.isPresent() ) {
                BoardItems item = optItem.get();
                BoardItemsDto dto = null;

                if (member != null)
                    item = hitUp(item, member); // 로그인 유저일 때 조회수 업

                if ( item != null )
                    dto = setDtos(item, member); // return dto 설정

                if ( dto != null )
                    rst = setRestResult(200, null, "item", dto); // RestResult 설정
            }

            if ( rst.getResult().get("item") == null )
                rst = setRestResult(400, "읽어들일 게시물", null, null); // 게시물 찾기 실패 시

        } catch(Exception e) {
            // 오류 시
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }

    public BoardItems hitUp(BoardItems boardItems, Members member) {
        try {
            // 조회한 게시물인지 체크
            int hitChk = itemHitsRepository.countByItemUuidAndItemHitMemUuid(boardItems, member).intValue();

            // 처음 조회 시 조회수 up
            if (hitChk == 0) {
                ItemHits hit = new ItemHits();
                hit.setItemUuid(boardItems);
                hit.setItemHitMemUuid(member);
                itemHitsRepository.save(hit);
                boardItems.setItemHits(itemHitsRepository.findAllByItemUuid(boardItems)); // 실시간 조회수 설정
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            boardItems = null;
        }
        return boardItems;
    }

    public BoardItemsDto setDtos(BoardItems item, Members member) {
        boolean chk = false;
        BoardItemsDto dto = null;
        try {
            dto = new BoardItemsDto(item); // DTO 생성

            // 로그인되어 있을 때
            if ( member != null ) {
                // 로그인된 유저가 등록자 본인이거나, 관리자 일 때
                chk = member.getMemUuid().equals(dto.getItemRegUuid().getMemUuid()) || member.getMemLevel() > 1;
                dto.setCAuth(true); // 댓글 권한, 회원이면 가능

                // 좋아요 여부
                Long likes = itemLikesRepository.countByItemUuidAndItemLikerUuid(item.getItemUuid(), member);
                dto.setLikeItem(likes > 0);
            }
            dto.setEAuth(chk); // 수정 권한
            dto.setDAuth(chk); // 삭제 권한

            dto.setItemLikesCnt(itemLikesRepository.countByItemUuid(item.getItemUuid()).intValue()); // 실시간 좋아요 수 설정
        } catch(Exception e) {
            log.error(e.getMessage());
            dto = null;
        }
        return dto;
    }

    public RestResults setRestResult(int code, String msg, String key, Object result) {
        RestResults rst = new RestResults();
        rst.setResultCode(code);
        if ( msg != null )
            rst.setResultMessage(msg, 0);
        if ( key != null )
            rst.setResult(key, result);
        return rst;
    }
}
```

<br/><br/>

##### ③ RestController

마지막으로 client의 호출을 받을 controller에 추가한 service 메서드를 호출할 수 있도록 추가 작성하였다.
<br/><br/>

```
package com.example.rmfr.board.controller;

import com.example.rmfr.board.dto.BoardItemsDto;
import com.example.rmfr.board.service.BoardItemsService;
import com.example.rmfr.member.entity.Members;
import com.example.rmfr.member.service.MemberService;
import com.example.rmfr.result.RestResults;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@RequiredArgsConstructor
@Slf4j
public class BoardRestController {

    private final BoardItemsService boardItemsService;
    private final MemberService memberService;

    .
    .
    .

    @GetMapping("/rest/item/{seq}")
    public RestResults getBoardItem(@PathVariable(value = "seq") int seq, Principal principal) {
        RestResults rst = new RestResults();
        Members member = null;
        try {
            if ( principal != null ) {
                member = memberService.findByMemId(principal.getName());
            }
            rst = boardItemsService.getBoardItem(seq, member);
        } catch (Exception e) {
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }
}
```

이제 게시물 상세 페이지를 보여줄 화면을 구성해보자.😎
