# cafeteria-backend-core

Cafeteria 백엔드에서 반복 사용되는 코어 부분입니다.

## 이게 무엇입니까

`cafeteria-server`와 `cafeteria-console-server`에서 사용되는 엔티티 정의와 TypeORM 설정을 하나로 모아 npm 모듈로 분리하였습니다.

## 왜 만들었나요 이런걸

`cafeteria-server`와 `cafeteria-console-server`, 그리고 `cafeteria-mobile`은 서로 다른 애플리케이션 룰을 가지지만, 모두 같은 **비즈니스 룰**을 공유합니다. 

이는 엔티티에 어느 정도 녹아들어 있는데, 따라서 세 개의 저장소에서 똑같은 필드를 가지는 `User` 엔티티가 세 번이나 반복됩니다. 또한 백엔드(`cafeteria-server`, `cafeteria-console-server`) 부분에서는 데이터베이스 접근 설정과 ORM 또한 겹칩니다.

모바일 앱은 그렇다 쳐도, 백엔드 부분은 두 개의 애플리케이션이 같은 엔티티와 같은 데이터베이스를 공유합니다. 이는 우발적 중복이 아니며, 엔티티에 변화가 생기면 두 애플리케이션에서 동시에 엔티티를 수정해야 합니다.

따라서 두 백엔드 애플리케이션에서 코드를 두 번 작성하고 관리할 필요가 없다 판단을 내려 `도메인의 코어 + DB 설정 부분`을 합쳐 별도의 저장소로 분리하였습니다.

## 설치

```bash
$ npm install @inu-cafateria/backend-core
```

## 알아두어야 할 것

> TypeORM 적응을 돕는 문단입니다. 익숙하시면 패스.

### Repository 안 씁니다.

> TypeORM 문서의 [Active Record vs Data Mapper](https://typeorm.io/#/active-record-data-mapper) 부분을 살펴보시면 좋습니다.

데이터의 열람과 편집을 repository에 위임하지 않고, 엔티티 클래스의 static 메소드에게 맡겼습니다. 이런 식입니다:

```ts
User.findOne(1); // id가 1인 User를 찾아옴
```

Repository 인터페이스 만들고 인스턴스 주입하고 관리할 시간에 로직 하나라도 더 짜는게 빠르다 싶어 이렇게 결정했습니다.

### TypeORM의 foreign key relation을 더 잘 활용하기 위한 필드 설계

사용자(`User`)는 질문(`Question`)을 할 수 있습니다. 한 사용자가 여러 개의 질문을 할 수 있기 때문에 이들은 일대다 관계를 형성합니다.

User와 Question 중 하나의 인스턴스만 가지고 있어도 서로 접근 가능합니다. 예를 들어, `User.questions`나 `Question.user`와 같이 사용 가능합니다.

이를 위해 `Question` 엔티티 정의에 아래와 같이 `User`로의 레퍼런스를 명시해 두었습니다:

```ts
class Question {
  // ...
  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn()
  user: User;
  // ...
}
```

다만 이렇게 하면 Question 중에서 userId가 1인 것들만 가져오는 것이 귀찮습니다. 그래서 아래와 같이 `userId` 필드 또한 만들어 주었습니다:

```ts
class Question {
  // ...
  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn()
  user: User;
  
  @Column()
  userId: number;
  // ...
}
```

이제 아래처럼 쓸 수 있습니다.

```ts
Question.findOne({userId: 1});
```

### Foreign key로 묶인 복잡한 엔티티 찾아올 때, 별도로 명시 안 해주면 묶인 애들 안 찾아와요.

User에는 `questions` 필드가 있습니다. 테이블 수준에서 실제 연관 정보는 Question 쪽에 foreign key로 존재합니다.

만약 User를 찾아올 때에, `questions` 필드를 채울 것을 지시하지 않으면, 그 필드는 없는 필드(`undefined`)가 됩니다.

그러니까 Question을 포함하여 User를 찾아오고 싶으면 이렇게:

```ts
User.findOne(userId, {
  relations: ['questions'],
});
```

그리고 Question 속의 `answer`까지 중첩으로 포함하여 찾아오고 싶으면 이렇게 하세요:

```ts
User.findOne(userId, {
relations: ['questions', 'questions.answer'],
});
```

> 중첩 relation에 관한 논의는 [여기에 많아요](https://github.com/typeorm/typeorm/issues/1270#issuecomment-348429760)
