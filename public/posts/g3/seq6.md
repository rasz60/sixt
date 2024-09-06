### 게시물 작성 기능 구현하기 (1/2)

불러올 게시물이 없는(?) 리스트를 완성했다. 이번엔 게시물 작성 기능을 만들어보자!
<br/><br/>

##### ① Repository

게시물 작성 시 말머리를 지정할 수 있게 하였고, 로그인한 계정의 권한별로 사용할 수 있는 말머리를 DB에서 가져오는 Repository를 생성했다.
<br/><br/>

/src/main/java/com/example/rmfr/board/repository/ItemHeadersRepository.java

```
package com.example.rmfr.board.repository;

import com.example.rmfr.board.entity.item.ItemHeaders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemHeadersRepository extends JpaRepository<ItemHeaders, String> {

    List<ItemHeaders> findByItemHeaderAuth(int auth);
}
```

<br/><br/>

##### ② Service

다음으로는 말머리 조회, 게시물 저장을 수행할 service 클래스를 작성하였다.
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

    public RestResults getBoardList(int itemStatus, int page, int limit);
    public RestResults getItemHeaders(int auth); // 말머리 조회
    public RestResults regItem(BoardItemsDto boardItemsDto, Members member); // 게시글 저장
}
```

/src/main/java/com/example/rmfr/board/service/impl/BoardItemsServiceImpl.java

```
package com.example.rmfr.board.service.impl;

import com.example.rmfr.board.dto.BoardItemsDto;
import com.example.rmfr.board.entity.BoardItems;
import com.example.rmfr.board.entity.item.ItemHeaders;
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
    private final ItemHeadersRepository itemHeadersRepository; // 추가

    .
    .
    .

    @Override
    public RestResults getItemHeaders(int auth) {
        RestResults rst = new RestResults();
        List<ItemHeaders> headers = new ArrayList<>();
        try {
            // 말머리 가져오기
            headers = itemHeadersRepository.findByItemHeaderAuth(auth);

            // RestResult 값 설정
            rst.setResultCode(200);
            rst.setResult("itemHeaders", headers);
        } catch (Exception e) {
            // 오류 시
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }


    @Override
    public RestResults regItem(BoardItemsDto boardItemsDto, Members member) {
        RestResults rst = new RestResults();

        try {
            // 작성/수정자 : 로그인 유저
            boardItemsDto.setItemRegUuid(member);
            boardItemsDto.setItemUpdaterUuid(member);

            // 말머리가 있을 때
            if (!"".equals(boardItemsDto.getItemHeaderId())) {
                Optional<ItemHeaders> optionalItemHeaders = itemHeadersRepository.findById(boardItemsDto.getItemHeaderId());
                optionalItemHeaders.ifPresent(boardItemsDto::setItemHeader);
            }

            // 글 번호 : 현재 저장된 게시글 전체 개수 + 1
            long seq = boardItemsRepository.count();
            boardItemsDto.setItemSeq((int) seq + 1);

            // 저장
            boardItemsRepository.save(BoardItems.of(boardItemsDto));

            // RestResult 값 설정
            rst.setResultCode(200);
        } catch(Exception e) {
            // 오류 시
            log.error(e.getMessage());
            rst.setResultCode(500);
        }

        return rst;
    }
}
```

<br/><br/>

##### ③ RestController

마지막으로 client의 호출을 받을 controller에 추가한 service 메서드를 호출할 수 있도록 추가 작성하였다.
<br/><br/>

/src/main/java/com/example/rmfr/board/controller/BoardRestController.java

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
    private final MemberService memberService; // 추가

    .
    .
    .

    @GetMapping("/rest/itemHeaders") // 게시물 저장
    public RestResults itemHeaders(Principal principal) {
        RestResults rst = new RestResults();
        int auth = 1;
        try {
            // 로그인이 되었을 경우
            if (principal != null) {
                // 회원 권한에 맞는 말머리 리스트 불러오기
                auth = memberService.getUserInfo(principal.getName()).getMemLevel();

                // RestResult 값 설정
                rst.setResultCode(200);
                rst.setResult("itemHeaders", boardItemsService.getItemHeaders(auth));
            } else {
                // 로그인 되지 않았을 경우
                rst.setResultCode(401);
            }
        } catch (Exception e) {
            // 오류 시
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }

    @PostMapping("/rest/board/save") // 게시글 저장
    @ResponseBody
    public RestResults saveItem(@RequestBody BoardItemsDto boardItemsDto, Principal principal) {
        RestResults rst = new RestResults();
        try {
            // 로그인 되었을 경우
            if ( principal != null ) {
                // 로그인된 회원 정보 조회
                Members member = memberService.findByMemId(principal.getName());

                // 게시물 저장
                rst = boardItemsService.regItem(boardItemsDto, member);
            }
            // 로그인 되지 않았을 경우
            else {
                rst.setResultCode(401);
            }
        } catch (Exception e) {
            // 오류 시
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }
}
```

이제 게시물 작성을 처리할 화면을 구성해보자.😎
