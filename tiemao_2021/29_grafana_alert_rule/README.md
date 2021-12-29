# Grafana Alert notifications

When an alert changes state, it sends out notifications. Each alert rule can have multiple notifications. In order to add a notification to an alert rule you first need to add and configure a `notification` channel (can be email, PagerDuty, or other integration).

This is done from the Notification channels page.

> Note: Alerting is only available in Grafana v4.0 and above.

# Grafana告警规则与通知

当告警规则的状态发生改变时，就会触发消息通知。
每个告警规则可以配置多个通知渠道。
如果要添加告警规则的通知，首先要配置好 `notification` 通道（比如 电子邮件、PagerDuty 或其他集成方式）。

这需要在Notification channel(通知渠道)页面完成。

> 注意：告警功能在 Grafana v4.0 及更高版本中可用。

## Add a notification channel

1. In the Grafana side bar, hover your cursor over the `Alerting` (bell) icon and then click `Notification channels`.
2. Click `Add channel`.
3. Fill out the fields or select options described below.

## 添加通知渠道

1. 在 Grafana 的侧边栏中，将光标悬停在`Alerting` (一个铃铛图标）上，然后选择 `Notification channels`。
2. 点击 `Add/New channel` 按钮。
3. 填写或者选择相应的表单输入项。
4. 输入完成后点击 `Save` 按钮。


## New notification channel fields

### Default (send on all alerts)

- `Name` -  Enter a name for this channel. It will be displayed when users add notifications to alert rules.
- `Type` -  Select the channel type. Refer to the [List of supported notifiers](#list-of-supported-notifiers) for details.
- `Default (send on all alerts)` -  When selected, this option sends a notification on this channel for all alert rules.
- `Include Image` -  See [Enable images in notifications](#enable-images-in-notifications-external-image-store) for details.
- `Disable Resolve Message` -  When selected, this option disables the resolve message [OK] that is sent when the alerting state returns to false.
- `Send reminders` -  When this option is checked additional notifications (reminders) will be sent for triggered alerts. You can specify how often reminders should be sent using number of seconds (s), minutes (m) or hours (h), for example `30s`, `3m`, `5m` or `1h`.

## 新建通知通道的字段说明

### (所有告警规则通用的)默认选项

- `Name` - 填写通道的名称。 为告警规则添加通知时，将用于展示。
- `Type` - 选择通道类型。 详细信息请参阅 [支持的通知程序列表](#list-of-supported-notifiers)。
- `Default (send on all alerts)` - 勾选此选项，让所有告警规则都自动发送通知到此通道。
- `Include Image` - 详情请参阅 [在通知中启用图像](#enable-images-in-notifications-external-image-store) 。
- `Disable Resolve Message` - 禁止在告警状态恢复为 false 时发送 `[OK]` 的消息。
- `Send reminders` - 如果此选项被选中, 触发告警时将发送额外的（提醒）通知。 可以配置发送频率, 比如 `30s`, `3m`, `5m` 或者 `1h`。

`Important:` Alert reminders are sent after rules are evaluated. Therefore a reminder can never be sent more frequently than a configured alert rule evaluation interval.

These examples show how often and when reminders are sent for a triggered alert.

> 重要提示： Alert reminders 会在评估规则后发送告警提醒。 因此，不要设置比告警规则评估周期更频繁的发送频率。

以下示例展示了已触发告警对应的提醒发送频率和时机。


| 告警规则评估间隔                  | 提醒发送的频率         | 在最后一次alert notification之后, 提醒发送的频率         |
| :----------------------------- | :------------------- | :-------------------------------------------------- |
| `30s`                          | `15s`                | ~30 seconds                                         |
| `1m`                           | `5m`                 | ~5 minutes                                          |
| `5m`                           | `15m`                | ~15 minutes                                         |
| `6m`                           | `20m`                | ~24 minutes                                         |
| `1h`                           | `15m`                | ~1 hour                                             |
| `1h`                           | `2h`                 | ~2 hours                                            |


<a name="list-of-supported-notifiers"></a>

## List of supported notifiers

## 通知程序支持列表

| Name                          | Type                      | Supports images    | Supports alert rule tags |
| :---------------------------- | :------------------------ | :----------------- | :----------------------- |
| [钉钉机器人](#dingdingdingtalk) | `dingding`                | 仅支持外链图片 | 否    |
| [Discord](#discord)   | `discord`                 | 支持                | 否    |
| [邮件通知](#email)     | `email`                   | 支持                | 否    |
| [谷歌环聊](#google-hangouts-chat) | `googlechat`   | 仅支持外链图片 | 否    |
| Hipchat               | `hipchat`                 | 仅支持外链图片 | 否    |
| [Kafka](#kafka)       | `kafka`                   | 仅支持外链图片 | 否    |
| Line                  | `line`                    | 仅支持外链图片 | 否    |
| Microsoft Teams       | `teams`                   | 仅支持外链图片 | 否    |
| [Opsgenie](#opsgenie) | `opsgenie`                | 仅支持外链图片 | 支持   |
| [Pagerduty](#pagerduty) | `pagerduty`             | 仅支持外链图片 | 支持   |
| Prometheus Alertmanager | `prometheus-alertmanager` | 仅支持外链图片 | 支持  |
| [Pushover](#pushover) | `pushover`                | 支持                | 否    |
| Sensu                 | `sensu`                   | 仅支持外链图片 | 否    |
| [Sensu Go](#sensu-go) | `sensugo`                 | 仅支持外链图片 | 否    |
| [Slack](#slack)       | `slack`                   | 支持                | 否    |
| Telegram              | `telegram`                | 支持                | 否    |
| Threema               | `threema`                 | 仅支持外链图片 | 否    |
| VictorOps             | `victorops`               | 仅支持外链图片 | 支持   |
| [Webhook](#webhook)   | `webhook`                 | 仅支持外链图片      | 支持  |

### Email

To enable email notifications you have to set up [SMTP settings](https://grafana.com/docs/grafana/latest/administration/configuration/#smtp) in the Grafana config. Email notifications will upload an image of the alert graph to an external image destination if available or fallback to attaching the image to the email. Be aware that if you use the `local` image storage email servers and clients might not be able to access the image.

> `Note:` Template variables are not supported in email alerts.

| Setting      | Description                                                  |
| :----------- | :----------------------------------------------------------- |
| Single email | Send a single email to all recipients. Disabled per default. |
| Addresses    | Email addresses to recipients. You can enter multiple email addresses using a “;” separator. |

### 电子邮件

要启用电子邮件通知，您必须在 Grafana 配置中设置 [SMTP 设置](https://grafana.com/docs/grafana/latest/administration/configuration/#smtp)。 电子邮件通知会将告警图的图像上传到外部图像目标（如果可用）或回退到将图像附加到电子邮件。 请注意，如果您使用“本地”图像存储，电子邮件服务器和客户端可能无法访问该图像。

> `注意：` 电子邮件告警不支持模板变量。

| 设置 | 说明 |
| :----------- | :------------------------------------------------- ---------- |
| 单个电子邮件 | 向所有收件人发送一封电子邮件。 默认禁用。 |
| 地址 | 收件人的电子邮件地址。 您可以使用“;”输入多个电子邮件地址 分隔器。 |


### Slack

[![Alerting Slack Notification](https://grafana.com/static/img/docs/v4/slack_notification.png)](https://grafana.com/static/img/docs/v4/slack_notification.png)

To set up Slack, you need to configure an incoming Slack webhook URL. You can follow [Sending messages using Incoming Webhooks](https://api.slack.com/incoming-webhooks) on how to do that. If you want to include screenshots of the firing alerts in the Slack messages you have to configure either the [external image destination](#external-image-store) in Grafana or a bot integration via Slack Apps. [Follow Slack’s guide to set up a bot integration](https://api.slack.com/bot-users) and use the token provided, which starts with “xoxb”.

### Slack 团队聊天

[![Alerting Slack Notification](https://grafana.com/static/img/docs/v4/slack_notification.png)](https://grafana.com/static/img/docs/v4/slack_notification.png)

要设置 Slack，您需要配置传入的 Slack webhook URL。 您可以按照 [使用传入 Webhooks 发送消息](https://api.slack.com/incoming-webhooks) 了解如何执行此操作。 如果您想在 Slack 消息中包含触发告警的屏幕截图，您必须配置 [外部图像目标](#external -image-store) 在 Grafana 中或通过 Slack Apps 进行机器人集成。 [按照 Slack 的指南设置机器人集成](https://api.slack.com/bot-users) 并使用提供的令牌，以“xoxb”开头。


| Setting         | Description                                                  |
| :-------------- | :----------------------------------------------------------- |
| Url             | Slack incoming webhook URL, or eventually the [chat.postMessage](https://api.slack.com/methods/chat.postMessage) Slack API endpoint. |
| Username        | Set the username for the bot’s message.                      |
| Recipient       | Allows you to override the Slack recipient. You must either provide a channel Slack ID, a user Slack ID, a username reference (@<user>, all lowercase, no whitespace), or a channel reference (#<channel>, all lowercase, no whitespace). If you use the `chat.postMessage` Slack API endpoint, this is required. |
| Icon emoji      | Provide an emoji to use as the icon for the bot’s message. Ex :smile: |
| Icon URL        | Provide a URL to an image to use as the icon for the bot’s message. |
| Mention Users   | Optionally mention one or more users in the Slack notification sent by Grafana. You have to refer to users, comma-separated, via their corresponding Slack IDs (which you can find by clicking the overflow button on each user’s Slack profile). |
| Mention Groups  | Optionally mention one or more groups in the Slack notification sent by Grafana. You have to refer to groups, comma-separated, via their corresponding Slack IDs (which you can get from each group’s Slack profile URL). |
| Mention Channel | Optionally mention either all channel members or just active ones. |
| Token           | If provided, Grafana will upload the generated image via Slack’s file.upload API method, not the external image destination. If you use the `chat.postMessage` Slack API endpoint, this is required. |

If you are using the token for a slack bot, then you have to invite the bot to the channel you want to send notifications and add the channel to the recipient field.

|设置 |说明 |
| :-------------- | :------------------------------------------------- ---------- |
|网址 | Slack 传入 webhook URL，或最终 [chat.postMessage](https://api.slack.com/methods/chat.postMessage) Slack API 端点。 |
|用户名 |设置机器人消息的用户名。 |
|收件人 |允许您覆盖 Slack 收件人。您必须提供通道 Slack ID、用户 Slack ID、用户名引用（@<user>，全小写，无空格）或通道引用（#<channel>，全小写，无空格）。如果您使用 `chat.postMessage` Slack API 端点，则这是必需的。 |
|图标表情符号 |提供一个表情符号用作机器人消息的图标。例如：微笑：|
|图标网址 |提供图像的 URL 以用作机器人消息的图标。 |
|提及用户 | （可选）在 Grafana 发送的 Slack 通知中提及一个或多个用户。您必须通过相应的 Slack ID（您可以通过单击每个用户的 Slack 个人资料上的溢出按钮找到）来引用用户，以逗号分隔。 |
|提及组 |可选择在 Grafana 发送的 Slack 通知中提及一个或多个组。您必须通过相应的 Slack ID（您可以从每个组的 Slack 配置文件 URL 获取）来引用以逗号分隔的组。 |
|提及通道 |可选择提及所有通道成员或仅提及活跃成员。 |
|代币 |如果提供，Grafana 将通过 Slack 的 file.upload API 方法上传生成的图像，而不是外部图像目的地。如果您使用 `chat.postMessage` Slack API 端点，则这是必需的。 |

如果您将令牌用于 slack 机器人，那么您必须邀请机器人加入您要发送通知的通道并将该通道添加到收件人字段。

### Opsgenie

To setup Opsgenie you will need an API Key and the Alert API Url. These can be obtained by configuring a new [Grafana Integration](https://docs.opsgenie.com/docs/grafana-integration).

| Setting                   | Description                                                  |
| :------------------------ | :----------------------------------------------------------- |
| Alert API URL             | The API URL for your Opsgenie instance. This will normally be either `https://api.opsgenie.com` or, for EU customers, `https://api.eu.opsgenie.com`. |
| API Key                   | The API Key as provided by Opsgenie for your configured Grafana integration. |
| Override priority         | Configures the alert priority using the `og_priority` tag. The `og_priority` tag must have one of the following values: `P1`, `P2`, `P3`, `P4`, or `P5`. Default is `False`. |
| Send notification tags as | Specify how you would like [Notification Tags](https://grafana.com/docs/grafana/latest/alerting/old-alerting/create-alerts/#notifications) delivered to Opsgenie. They can be delivered as `Tags`, `Extra Properties` or both. Default is Tags. See note below for more information. |

> `Note:` When notification tags are sent as `Tags` they are concatenated into a string with a `key:value` format. If you prefer to receive the notifications tags as key/values under Extra Properties in Opsgenie then change the `Send notification tags as` to either `Extra Properties` or `Tags & Extra Properties`.

### Opsgenie软件

要设置 Opsgenie，您需要一个 API 密钥和告警 API 网址。这些可以通过配置新的 [Grafana 集成](https://docs.opsgenie.com/docs/grafana-integration) 获得。

|设置 |说明 |
| :------------------------ | :------------------------------------------------- ---------- |
|告警 API 网址 | Opsgenie 实例的 API URL。这通常是“https://api.opsgenie.com”，或者对于欧盟客户来说是“https://api.eu.opsgenie.com”。 |
| API 密钥 | Opsgenie 为您配置的 Grafana 集成提供的 API 密钥。 |
|覆盖优先级 |使用 `og_priority` 标签配置告警优先级。 `og_priority` 标签必须具有以下值之一：`P1`、`P2`、`P3`、`P4` 或`P5`。默认为“假”。 |
|将通知标签发送为 |指定您希望将 [通知标签](https://grafana.com/docs/grafana/latest/alerting/old-alerting/create-alerts/#notifications) 传送到 Opsgenie 的方式。它们可以作为“标签”、“额外属性”或两者同时提供。默认为标签。有关更多信息，请参阅下面的注释。 |

> `注意：` 当通知标签作为 `Tags` 发送时，它们会被连接成一个带有 `key:value` 格式的字符串。如果您更喜欢在 Opsgenie 中的额外属性下将通知标签作为键/值接收，请将“发送通知标签为”更改为“额外属性”或“标签和额外属性”。


### PagerDuty

To set up PagerDuty, all you have to do is to provide an integration key.

| Setting                | Description                                                  |
| :--------------------- | :----------------------------------------------------------- |
| Integration Key        | Integration key for PagerDuty.                               |
| Severity               | Level for dynamic notifications, default is `critical` (1)   |
| Auto resolve incidents | Resolve incidents in PagerDuty once the alert goes back to ok |
| Message in details     | Removes the Alert message from the PD summary field and puts it into custom details instead (2) |

### PagerDuty软件

要设置 PagerDuty，您只需提供一个集成密钥。

| 设置 | 说明 |
| :--------------------- | :------------------------------------------------- ---------- |
| 集成密钥 | PagerDuty 的集成密钥。 |
| 严重性 | 动态通知级别，默认为`critical` (1) |
| 自动解决事件 | 一旦告警恢复正常，解决 PagerDuty 中的事件 |
| 留言详情 | 从 PD 摘要字段中删除告警消息并将其放入自定义详细信息中 (2) |

> `Note:` The tags `Severity`, `Class`, `Group`, `dedup_key`, and `Component` have special meaning in the [Pagerduty Common Event Format - PD-CEF](https://support.pagerduty.com/docs/pd-cef). If an alert panel defines these tag keys, then they are transposed to the root of the event sent to Pagerduty. This means they will be available within the Pagerduty UI and Filtering tools. A Severity tag set on an alert overrides the global Severity set on the notification channel if it’s a valid level.

> Using Message In Details will change the structure of the `custom_details` field in the PagerDuty Event. This might break custom event rules in your PagerDuty rules if you rely on the fields in `payload.custom_details`. Move any existing rules using `custom_details.myMetric` to `custom_details.queries.myMetric`. This behavior will become the default in a future version of Grafana.

> `Note:` The `dedup_key` tag overrides the Grafana-generated `dedup_key` with a custom key.

> `Note:` The `state` tag overrides the current alert state inside the `custom_details` payload.

> `Note:` Grafana uses the `Events API V2` integration. This can be configured for each service.

> `注意：`标签`Severity`、`Class`、`Group`、`dedup_key`和`Component`在[Pagerduty Common Event Format - PD-CEF](https://support.pagerduty .com/docs/pd-cef）。如果告警面板定义了这些标签键，那么它们将被转置到发送到 Pagerduty 的事件的根。这意味着它们将在 Pagerduty UI 和过滤工具中可用。如果是有效级别，则在告警上设置的严重性标记会覆盖在通知通道上设置的全局严重性。

> 在详细信息中使用消息将更改 PagerDuty 事件中 `custom_details` 字段的结构。如果您依赖 `payload.custom_details` 中的字段，这可能会破坏 PagerDuty 规则中的自定义事件规则。使用 `custom_details.myMetric` 将任何现有规则移动到 `custom_details.queries.myMetric`。此行为将成为 Grafana 未来版本中的默认设置。

> `注意：``dedup_key` 标签使用自定义键覆盖 Grafana 生成的 `dedup_key`。

> `注意：``state` 标签覆盖了 `custom_details` 负载内的当前告警状态。

> `注意：`Grafana 使用`Events API V2` 集成。这可以为每个服务配置。


### VictorOps

To configure VictorOps, provide the URL from the Grafana Integration and substitute `$routing_key` with a valid key.

> `Note:` The tag `Severity` has special meaning in the [VictorOps Incident Fields](https://help.victorops.com/knowledge-base/incident-fields-glossary/). If an alert panel defines this key, then it replaces the `message_type` in the root of the event sent to VictorOps.

### VictorOps软件

要配置 VictorOps，请提供 Grafana 集成中的 URL，并用有效密钥替换 `$routing_key`。

> `注意：`标签`严重性`在[VictorOps事件字段](https://help.victorops.com/knowledge-base/incident-fields-glossary/)中有特殊含义。 如果告警面板定义了这个键，那么它会替换发送到 VictorOps 的事件根中的“message_type”。


### Pushover

To set up Pushover, you must provide a user key and an API token. Refer to [What is Pushover and how do I use it](https://support.pushover.net/i7-what-is-pushover-and-how-do-i-use-it) for instructions on how to generate them.

| Setting        | Description                                                  |
| :------------- | :----------------------------------------------------------- |
| API Token      | Application token                                            |
| User key(s)    | A comma-separated list of user keys                          |
| Device(s)      | A comma-separated list of devices                            |
| Priority       | The priority alerting nottifications are sent                |
| OK priority    | The priority OK notifications are sent; if not set, then OK notifications are sent with the priority set for alerting notifications |
| Retry          | How often (in seconds) the Pushover servers send the same notification to the user. (minimum 30 seconds) |
| Expire         | How many seconds your notification will continue to be retried for (maximum 86400 seconds) |
| Alerting sound | The sound for alerting notifications                         |
| OK sound       | The sound for OK notifications                               |

### Pushover软件

要设置 Pushover，您必须提供用户密钥和 API 令牌。有关如何生成的说明，请参阅[什么是 Pushover 以及如何使用它](https://support.pushover.net/i7-what-is-pushover-and-how-do-i-use-it)他们。

|设置 |说明 |
| :------------- | :------------------------------------------------- ---------- |
| API 令牌 |应用令牌 |
|用户密钥 |逗号分隔的用户键列表 |
|设备 |逗号分隔的设备列表 |
|优先级 |发送优先告警通知 |
|确定优先 |发送优先OK通知；如果未设置，则发送 OK 通知，并为告警通知设置优先级 |
|重试 | Pushover 服务器向用户发送相同通知的频率（以秒为单位）。 （最少 30 秒） |
|过期 |您的通知将继续重试多少秒（最长 86400 秒）|
|告警声|提醒通知的声音|
|好声音| OK 通知的声音 |

### Webhook

The webhook notification is a simple way to send information about a state change over HTTP to a custom endpoint. Using this notification you could integrate Grafana into a system of your choosing.

Example json body:

### 网络钩子(Webhook)

Webhook 通知是一种通过 HTTP 向自定义URL发送有关状态变更信息的简单方法。 使用这种通知方式，可以将 Grafana 集成到自己选择的系统中。

> 比如在你自己的系统中进行短信通知/语音呼叫...

json body示例:

```json
{
  "dashboardId": 1,
  "evalMatches": [
    {
      "value": 1,
      "metric": "Count",
      "tags": {}
    }
  ],
  "imageUrl": "https://grafana.com/assets/img/blog/mixed_styles.png",
  "message": "Notification Message",
  "orgId": 1,
  "panelId": 2,
  "ruleId": 1,
  "ruleName": "Panel Title alert",
  "ruleUrl": "http://localhost:3000/d/hZ7BuVbWz/test-dashboard?fullscreen\u0026edit\u0026tab=alert\u0026panelId=2\u0026orgId=1",
  "state": "alerting",
  "tags": {
    "tag name": "tag value"
  },
  "title": "[Alerting] Panel Title alert"
}
```

JSON

- `state` - The possible values for alert state are: `ok`, `paused`, `alerting`, `pending`, `no_data`.

- `state` - 告警状态的值可能是：`ok`, `paused`, `alerting`, `pending`, `no_data`。

### DingDing/DingTalk

DingTalk supports the following “message type”: `text`, `link` and `markdown`. Only the `link` message type is supported. Refer to the [configuration instructions](https://developers.dingtalk.com/document/app/custom-robot-access) in Chinese language.

In DingTalk PC Client:

1. Click “more” icon on upper right of the panel.
2. Click “Robot Manage” item in the pop menu, there will be a new panel call “Robot Manage”.
3. In the “Robot Manage” panel, select “customized: customized robot with Webhook”.
4. In the next new panel named “robot detail”, click “Add” button.
5. In “Add Robot” panel, input a nickname for the robot and select a “message group” which the robot will join in. click “next”.
6. There will be a Webhook URL in the panel, looks like this: https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxxx. Copy this URL to the Grafana DingTalk setting page and then click “finish”.

### DingDing/DingTalk/钉钉

钉钉机器人本身支持的“消息类型”包括: `text`、`link` 和 `markdown`。
但Grafana 仅支持钉钉的 `link` 消息类型。

中文版本: [配置说明](https://developers.dingtalk.com/document/app/custom-robot-access)。

在钉钉的PC版客户端中:

1. 单击群聊面板右上角的 "群设置" 按钮。
2. 在弹出的菜单中点击 "智能群助手" 项, 会出现一个新的 “机器人管理” 面板。
3. 在“机器人管理”面板中，添加 "机器人", 选择 【自定义(通过Webhook接入自定义服务)】。
4. 在机器人预览面板中，单击 "添加" 按钮。
5. 在 “添加机器人” 面板中，输入机器人昵称，选择机器人要加入的 “消息群”，以及安全设置, 最后点击“完成”。
6. 面板中会展示一个Webhook URL，形如：`https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxxx`。 将此URL复制到Grafana的钉钉设置页面，然后单击“完成”。
7. 如果选择的是 “自定义关键字”, 则每条告警消息中都必须包含关键字才会被接受。
8. 如果选择的是 “加签” 方式，则需要配置签名token信息


### Discord

To set up Discord, you must create a Discord channel webhook. For instructions on how to create the channel, refer to [Intro to Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

| Setting                        | Description                                                  |
| :----------------------------- | :----------------------------------------------------------- |
| Webhook URL                    | Discord webhook URL.                                         |
| Message Content                | Mention a group using @ or a user using <@ID> when notifying in a channel. |
| Avatar URL                     | Optionally, provide a URL to an image to use as the avatar for the bot’s message. |
| Use Discord’s Webhook Username | Use the username configured in Discord’s webhook settings. Otherwise, the username will be ‘Grafana.’ |

Alternately, use the [Slack](#slack) notifier by appending `/slack` to a Discord webhook URL.

### Discord 软件

要设置 Discord，您必须创建一个 Discord 通道 webhook。有关如何创建通道的说明，请参阅 [Webhooks 简介](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)。

|设置 |说明 |
| :----------------------------- | :------------------------------------------------- ---------- |
|网络钩子网址 |不和谐网络钩子 URL。 |
|留言内容 |在通道中通知时使用 @ 提及组或使用 <@ID> 的用户。 |
|头像网址 |或者，提供图像的 URL 以用作机器人消息的头像。 |
|使用 Discord 的 Webhook 用户名 |使用在 Discord 的 webhook 设置中配置的用户名。否则，用户名将是“Grafana”。

或者，通过将 `/slack` 附加到 Discord webhook URL 来使用 [Slack](#slack) 通知程序。

### Kafka

Notifications can be sent to a Kafka topic from Grafana using the [Kafka REST Proxy](https://docs.confluent.io/1.0/kafka-rest/docs/index.html). There are a couple of configuration options which need to be set up in Grafana UI under Kafka Settings:

1. Kafka REST Proxy endpoint.
2. Kafka Topic.

Once these two properties are set, you can send the alerts to Kafka for further processing or throttling.

### Kafka消息

可以使用 [Kafka REST 代理](https://docs.confluent.io/1.0/kafka-rest/docs/index.html) 将通知从 Grafana 发送到 Kafka 主题。 有几个配置选项需要在 Grafana UI 中的 Kafka Settings 下进行设置：

1. Kafka REST Proxy endpoint.
2. Kafka Topic.

设置这两个属性后，您可以将告警发送到 Kafka 以进行进一步处理或限制。


### Google Hangouts Chat

Notifications can be sent by setting up an incoming webhook in Google Hangouts chat. For more information about configuring a webhook, refer to [webhooks](https://developers.google.com/hangouts/chat/how-tos/webhooks).

### 谷歌环聊聊天

可以通过在 Google Hangouts 聊天中设置传入的 webhook 来发送通知。 有关配置 webhook 的更多信息，请参阅 [webhooks](https://developers.google.com/hangouts/chat/how-tos/webhooks)。


### Prometheus Alertmanager

Alertmanager handles alerts sent by client applications such as Prometheus server or Grafana. It takes care of deduplicating, grouping, and routing them to the correct receiver. Grafana notifications can be sent to Alertmanager via a simple incoming webhook. Refer to the official [Prometheus Alertmanager documentation](https://prometheus.io/docs/alerting/alertmanager) for configuration information.

> `Caution:` In case of a high-availability setup, do not load balance traffic between Grafana and Alertmanagers to keep coherence between all your Alertmanager instances. Instead, point Grafana to a list of all Alertmanagers, by listing their URLs comma-separated in the notification channel configuration.


### Prometheus告警管理器

Alertmanager 处理客户端应用程序（例如 Prometheus 服务器或 Grafana）发送的告警。 它负责对它们进行重复数据删除、分组和路由到正确的接收器。 Grafana 通知可以通过一个简单的传入 webhook 发送到 Alertmanager。 配置信息参考官方【Prometheus Alertmanager文档】(https://prometheus.io/docs/alerting/alertmanager)。

> `注意：` 在高可用性设置的情况下，不要在 Grafana 和 Alertmanager 之间负载平衡流量，以保持所有 Alertmanager 实例之间的一致性。 相反，通过在通知通道配置中以逗号分隔列出它们的 URL，将 Grafana 指向所有告警管理器的列表。


### Sensu Go

Grafana alert notifications can be sent to [Sensu](https://grafana.com/docs/grafana/latest/alerting/old-alerting/notifications/(https://sensu.io)) Go as events via the API. This operation requires an API key. For information on creating this key, refer to [Sensu Go documentation](https://docs.sensu.io/sensu-go/latest/operations/control-access/use-apikeys/#api-key-authentication).

### Sensu Go

Grafana 告警通知可以通过 API 作为事件发送到 [Sensu](https://grafana.com/docs/grafana/latest/alerting/old-alerting/notifications/(https://sensu.io)) Go。 此操作需要 API 密钥。 有关创建此密钥的信息，请参阅 [Sensu Go 文档](https://docs.sensu.io/sensu-go/latest/operations/control-access/use-apikeys/#api-key-authentication)。

## Enable images in notifications

Grafana can render the panel associated with the alert rule as a PNG image and include that in the notification. Read more about the requirements and how to configure [image rendering](https://grafana.com/docs/grafana/latest/image-rendering/).

You must configure an [external image storage provider](https://grafana.com/docs/grafana/latest/administration/configuration/#external-image-storage) in order to receive images in alert notifications. If your notification channel requires that the image be publicly accessible (e.g. Slack, PagerDuty), configure a provider which uploads the image to a remote image store like Amazon S3, Webdav, Google Cloud Storage, or Azure Blob Storage. Otherwise, the local provider can be used to serve the image directly from Grafana.

Notification services which need public image access are marked as ‘external only’.


<a name="enable-images-in-notifications-external-image-store"></a>

## 在通知中启用图像

Grafana 可以将与告警规则关联的面板呈现为 PNG 图像，并将其包含在通知中。 阅读有关要求以及如何配置 [图像渲染](https://grafana.com/docs/grafana/latest/image-rendering/) 的更多信息。

您必须配置 [外部图像存储提供程序](https://grafana.com/docs/grafana/latest/administration/configuration/#external-image-storage) 才能在告警通知中接收图像。 如果您的通知渠道要求图像可公开访问（例如 Slack、PagerDuty），请配置将图像上传到远程图像存储（如 Amazon S3、Webdav、Google Cloud Storage 或 Azure Blob Storage）的提供商。 否则，可以使用本地提供程序直接从 Grafana 提供图像。

需要公共图像访问的通知服务被标记为“仅限外部”。



## Configure the link back to Grafana from alert notifications

All alert notifications contain a link back to the triggered alert in the Grafana instance. This URL is based on the [domain](https://grafana.com/docs/grafana/latest/administration/configuration/#domain) setting in Grafana.

## 配置从告警通知返回到 Grafana 的链接

所有告警通知都包含指向 Grafana 实例中触发告警的链接。 此 URL 基于 Grafana 中的 [域](https://grafana.com/docs/grafana/latest/administration/configuration/#domain) 设置。

## Notification templating

> `Note:` Alert notification templating is only available in Grafana v7.4 and above.

The alert notification template feature allows you to take the [label](https://grafana.com/docs/grafana/latest/basics/timeseries-dimensions/#labels) value from an alert query and [inject that into alert notifications](https://grafana.com/docs/grafana/latest/alerting/old-alerting/add-notification-template/).

## 通知模板

> 注意：告警通知模板仅在 Grafana v7.4 及更高版本中可用。

告警通知模板功能允许您从告警查询中获取 [label](https://grafana.com/docs/grafana/latest/basics/timeseries-dimensions/#labels) 值并[将其注入告警通知] （https://grafana.com/docs/grafana/latest/alerting/old-alerting/add-notification-template/）。


## 相关链接

- <https://grafana.com/docs/grafana/latest/alerting/old-alerting/notifications/>
