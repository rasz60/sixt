### 게시판 리스트 구현하기 (1/2)

이제 시작하는 단계라 불러올 수 있는 게시물은 없지만.. 우선 게시물을 리스트 형식으로 보여주는 로직과 화면을 구현해보았다.
<br/><br/>

##### ① Repository

제일 먼저 DB에서 데이터를 가져올 Repository를 작성했다.<br/>
itemStatus를 기준으로 임시저장/저장/삭제 된 게시물 리스트를 출력할 예정이므로, `findByItemStatus` 메서드를 만들었다.<br/>
그리고 Spring 에서 지원하는 Page List 객체로 받기 위해서 PageRequest 객체에 조건을 추가하여 Parameter로 보낸다.<br/>
PageRequest 설정에 대해서는 Service 단에서 한 번 더 자세히 확인해보자.
<br/><br/>

/src/main/java/com/example/rmfr/board/repository/BoardItemsRepository.java

```
package com.example.rmfr.board.repository;

import com.example.rmfr.board.entity.BoardItems;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardItemsRepository extends JpaRepository<BoardItems, String> {

    Page<BoardItems> findByItemStatus(int itemStatus, PageRequest pageRequest);

}
```

##### ② Service

다음으로 DB 조회한 게시물 리스트를 가공할 Service를 살펴보자.
<br/><br/>

/src/main/java/com/example/rmfr/board/service/BoardItemsService.java

```
package com.example.rmfr.board.service;

import com.example.rmfr.result.RestResults;

@Service
public interface BoardItemsService {

    public RestResults getBoardList(int itemStatus, int page, int limit);

}

```

<br/>

/src/main/java/com/example/rmfr/board/service/impl/BoardItemsServiceImpl.java<br/>

###### Spring에서 제공하는 PageRequest 클래스를 사용하여 Page에 맞는 게시물을 가져오도록 구현했다.

###### ⑴ itemStatus : 게시물 저장 상태, 0 - 임시저장 / 1 - 저장 / 2 - 삭제<br/>

###### ⑵ page : 현재 보려고 하는 페이지, 0부터 시작 ex > 1페이지 -> page = 0<br/>

###### ⑶ limit : 한 페이지에 들어가는 게시물의 최대 개수

```
package com.example.rmfr.board.service.impl;

import com.example.rmfr.board.dto.BoardItemsDto;
import com.example.rmfr.board.entity.BoardItems;
import com.example.rmfr.board.repository.*;
import com.example.rmfr.board.service.BoardItemsService;
import com.example.rmfr.result.RestResults;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardItemsServiceImpl implements BoardItemsService {

    private final BoardItemsRepository boardItemsRepository;

    @Override
    public RestResults getBoardList(int itemStatus, int page, int limit) {
        RestResults rst = new RestResults();
        Page<BoardItemsDto> boardItemsDtos = null;
        try {
            PageRequest pageRequest = PageRequest.of(page, // 현재 페이지
                                                     limit, // 페이지 당 게시물 최대 수
                                                     Sort.by("itemRegDate").descending() // 정렬 기준, 등록일 역순
                                                    );
            Page<BoardItems> tmp = boardItemsRepository.findByItemStatus(itemStatus, pageRequest); // 조회
            boardItemsDtos = tmp.map(BoardItemsDto::new); // DTO로 전환
            rst.setResultCode(200); // 응답 코드, 메시지 설정
            rst.setResult("boardList", boardItemsDtos); // 결과 값 설정
        } catch (Exception e) {
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }
}
```

<br/>

`RestResults` 클래스를 만들어서 RestAPI의 응답 자료형을 통일하였다. 작업하면서 추가되는 응답 코드나 메시지는 추가해나갈 예정이다.
<br/><br/>

/src/main/java/com/example/rmfr/result/RestResults.java

```
package com.example.rmfr.result;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Data
public class RestResults {

    private int resultCode; // 응답 코드
    private String resultMessage; // 응답 메시지
    private Map<String, Object> result; // 응답 결과 값

    // resultCode : 20X - OK
    private static int RSLT_200 = 200;
    private static String RSLT_200_MSG = "정상적으로 완료되었습니다.";

    // resultCode : 40X - NOT_FOUND
    private static int RSLT_400 = 400;
    private static String RSLT_400_MSG = "를 찾지 못했습니다.";
    private static int RSLT_401 = 401;
    private static String RSLT_401_MSG = "회원만 사용할 수 있는 기능입니다.";

    // resultCode : 50X - SYSTEM_ERROR
    private static int RSLT_500 = 500;
    private static String RSLT_500_MSG = "시스템 오류가 발생하였습니다.";

    public RestResults() {
        this.resultCode = 0;
        this.resultMessage = "";
        this.result  = new HashMap<>();
    }

    public void setResultCode(int code) { // ResultCode를 세팅하면 ResultMessage 자동 세팅
        this.resultCode = code;

        if ( code == 200 ) {
            this.resultMessage = RSLT_200_MSG;
        } else if ( code == 400 ) {
            this.resultMessage = RSLT_400_MSG;
        } else if ( code == 401 ) {
            this.resultMessage = RSLT_401_MSG;
        } else if ( code == 500 ) {
            this.resultMessage = RSLT_500_MSG;
        } else {
            this.resultMessage = RSLT_500_MSG;
        }
    }

    public void setResult(String key, Object val) {
        this.result.put(key, val);
    }

    public void setResultMessage(String msg, int type) { // ResultMessage 커스텀
        if ( type == 0 ) { // 기존 메시지 앞에 메시지 추가
            this.resultMessage = msg + this.resultMessage;
        } else if ( type == 1 ) { // 메시지 전체 변경
            this.resultMessage = msg;
        }
    }
}
```

<br/>

##### ③ RestController

마지막으로 BoardRestController를 만들고, 게시물을 불러올수 있는 API를 추가하였다.
<br/><br/>

/src/main/java/com/example/rmfr/board/controller/BoardRestController.java

```
package com.example.rmfr.board.controller;

import com.example.rmfr.board.service.BoardItemsService;
import com.example.rmfr.result.RestResults;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@Slf4j
public class BoardRestController {

    private final BoardItemsService boardItemsService;
    @GetMapping("/rest/boardList/{itemStatus}/{page}/{limit}")
    public RestResults getBoardList(@PathVariable("itemStatus") int itemStatus,
                                    @PathVariable("page") int page,
                                    @PathVariable("limit") int limit) {
        RestResults rst = new RestResults();
        try {
            rst = boardItemsService.getBoardList(itemStatus, page, limit);
        } catch (Exception e) {
            log.error(e.getMessage());
            rst.setResultCode(500);
        }
        return rst;
    }

}
```

이제 결과 값을 출력해줄 화면을 구성해보자.😎
