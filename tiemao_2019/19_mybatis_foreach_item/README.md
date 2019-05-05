

```

    private String id;

    private String code;
    // ID列表
    private List<String> idList;
    // code 列表
    private List<String> codeList;
    // 外部 code列表
    private List<String> codeExpList;

```




```
<!-- 这段代码有问题! -->
  <sql id="listByWhereConditionSQL" >
    <if test="idList != null" >
      AND id IN
      <foreach collection="idList" open="(" separator="," item="id" close=")">
        #{id , jdbcType=VARCHAR }
      </foreach>
    </if>
    <if test="codeList != null" >
      AND code IN
      <foreach collection="codeList" open="(" separator="," item="code" close=")">
        #{code , jdbcType=VARCHAR }
      </foreach>
    </if>
    <if test="id != null" >
      AND id =#{id}
    </if>
    <if test="code != null" >
      AND code =#{code}
    </if>
  </sql>
```