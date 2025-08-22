# 大语言模型-相关技术简介

[TOC]

## 1、 分类: 

在线: GPT, Gemini, GLM4, Claude, 豆包
开源: GPT-OSS, Gemma, Llama, Baichuan, QWen*, kimi, DeepSeek;


## 2、云服务产品:

豆包大模型: https://www.volcengine.com/

阿里云百炼: https://www.aliyun.com/product/bailian


视频识别: https://cloud.tencent.com/product/vm


## 3、 GPU出租

autoDL: https://www.autodl.com/home

Aliyun: https://www.aliyun.com/product/ecs/gpu

火山云: https://www.volcengine.com/pricing?product=ECS&tab=2

七牛云: https://www.qiniu.com/products/qvm#specs

鹄望云: https://www.huwangyun.cn/gpu-cloud-server

AWS: https://aws.amazon.com/cn/campaigns/aws-cloudserver-ps-3floor/#gpu-servers

Azure: https://azure.microsoft.com/zh-cn/pricing/details/virtual-machines/linux/#n-series


## 4、其他

知乎 - 如何鉴别AI生成的视频和音频文件？ 
https://www.zhihu.com/question/610020460/answer/3101954808
https://www.zhihu.com/question/610020460/answer/3102134901


```
用户 -------------- Agent --------- AI大模型
                     |
                     |
                     | -- (MCP) -- MCP Server(Tools/Res/prompt)
                     |
                Function Calling
```


## 5、技术方向

大模型: RAG/Agent(MCP)/微调(LoRA);

大模型部署与调用, 
Agent: 中介助手, MCP (Model Context Protocol), Tool , Function calling,

Embding,
微调(LoRA);
提示工程技术:  套提示词模板/语言引导+经验积累

可参考: 

> https://github.com/modelscope



## 6、 应用方向

自然语言编程, 
本地代码解释器,
用户意图识别,
Agent开发,
私有知识库,

System Prompt: 人设: 角色, 性格, 背景, 语气;
User Prompt: 用户问题, 用户提示词;



大模型微调: 

> https://www.bilibili.com/video/BV1YLE1zyEvX/






## 7、相关网站


- [Model社区](https://www.modelscope.cn/)
- [扣子空间: Coze-字节,AI工作助手- 创意生成: PPT, 网页, 表格](https://space.coze.cn/)
- [Trae-深度理解中文开发场景 - Trae智能代码生成平台](https://www.trae.cn/)
- [豆包](https://www.doubao.com/)
- [unsloth](https://github.com/unslothai/unsloth)
- [Hugging Face](https://huggingface.co/)
- [Wandb: Weights & Biases](https://wandb.ai/site)
- [Claude](https://claude.ai/login)



## 8、参考资料


- [10分钟讲清楚 Prompt, Agent, MCP 是什么](https://www.bilibili.com/video/BV1aeLqzUE6L/)
- [探索云计算与AI的世界 - 火山引擎开发者社区](https://developer.volcengine.com/articles)
- [MCP从理论到实战](https://developer.volcengine.com/articles/7533551311816818724#article_title)

