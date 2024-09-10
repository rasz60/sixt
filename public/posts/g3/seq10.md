### 게시물 수정/삭제 기능 구현하기 (1/2)

게시물을 작성하고 상세 페이지까지 구현을 완료하였다. 다음으로는 상세페이지에서 수정/삭제 버튼을 눌렀을 때의 동작을 구현해보자.
<br/><br/>

##### ① Service

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

    public RestResults updateItem(BoardItemsDto boardItemsDto, Members member); // 게시글 수정

    public RestResults delItem(BoardItemsDto boardItemsDto, Members member); // 게시글 삭제
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

    .
    .
    .

    @Override
    public RestResults updateItem(BoardItemsDto boardItemsDto, Members member) {
        RestResults rst = new RestResults();

        try {
            Optional<BoardItems> asItem = boardItemsRepository.findById(boardItemsDto.getItemUuid()); // 기존 게시물 정보 조회

            if ( asItem.isPresent() ) {
                BoardItems item = asItem.get();

                // 수정한 게시물 정보에 말머리가 있을 때
                if (boardItemsDto.getItemHeaderId() != null && !boardItemsDto.getItemHeaderId().isEmpty()) {
                    Optional<ItemHeaders> optionalItemHeaders = itemHeadersRepository.findById(boardItemsDto.getItemHeaderId());
                    optionalItemHeaders.ifPresent(boardItemsDto::setItemHeader);
                }

                // 수정자를 현재 로그인한 유저로 변경
                boardItemsDto.setItemUpdaterUuid(member);
                boardItemsDto.setItemUpdateDate(LocalDateTime.now());

                item.updateItems(boardItemsDto); // 기존 게시물 정보를 가진 객체 정보를 dto로 업데이트
                boardItemsRepository.save(item); // DB 저장

                rst.setResultCode(200);
            } else {
                // 게시물 찾을 수 없을 때
                rst = setRestResult(400, "수정할 게시물", null, null);
            }
        } catch (Exception e) {
            // 오류 시
            log.error(e.getMessage());
            rst.setResultCode(500);
        }

        return rst;
    }

    public RestResults delItem(BoardItemsDto boardItemsDto, Members member) {
        RestResults rst = new RestResults();
        try {
            BoardItems item = boardItemsRepository.findById(boardItemsDto.getItemUuid()).orElse(null); // 게시물 조회

            if ( item != null ) {
                item.setItemStatus(2); // 상태 값을 삭제(2)로 변경
                item.setItemUpdaterUuid(member); // 수정자를 로그인한 유저로 변경
                item.setItemUpdateDate(LocalDateTime.now());
                boardItemsRepository.save(item); // DB 저장
                rst.setResultCode(200);
            } else {
                // 게시물이 없을 때
                rst = setRestResult(400, "삭제할 게시물", null, null);
            }
        } catch(Exception e) {
            // 오류 시
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }

    .
    .
    .

}
```

<br/><br/>

##### ③ RestController

다음으로 client의 호출을 받을 controller에 추가한 service 메서드를 호출할 수 있도록 추가 작성하였다.<br/>
게시물 수정은 게시물 작성 구현 시에 만들었던 save에 분기 처리를 추가하였다.
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


    @PostMapping("/rest/board/save") // 게시글 저장
    @ResponseBody
    public RestResults saveItem(@RequestBody BoardItemsDto boardItemsDto, Principal principal) {
        RestResults rst = new RestResults();
        try {
            if ( principal != null ) {
                Members member = memberService.findByMemId(principal.getName());

                // 게시물 저장 : 분기 처리 추가, itemUuid가 없으면 작성, 있으면 수정
                rst = "".equals(boardItemsDto.getItemUuid()) ?
                        boardItemsService.regItem(boardItemsDto, member) :
                        boardItemsService.updateItem(boardItemsDto, member);
            }
            else {
                rst.setResultCode(401);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }

    .
    .
    .


    @PutMapping("/rest/delItem")
    @ResponseBody
    public RestResults delItem(@RequestBody BoardItemsDto boardItemsDto, Principal principal) {
        RestResults rst = new RestResults();
        Members member = null;
        try {
            // 로그인 되어있을 때
            if ( principal != null ) {
                member = memberService.findByMemId(principal.getName());
                rst = boardItemsService.delItem(boardItemsDto, member); // 게시물 삭제 호출
            } else {
                rst.setResultCode(401);
            }

        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return rst;
    }
}
```

이제 화면에서 게시물 수정과 삭제 처리할 수 있도록 구현해보자.😎
