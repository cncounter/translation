工具
===


### Trac ###

[点击这里访问Trac。](http://trac.common-lisp.net/)

我们为提出请求的项目运行Trac。 这是一个相当普通的安装, 位于文件系统的 `/project/<project>/trac` 目录下, 只有项目管理员才有写权限。 管理员可以按照文档使用 `trac-admin` 来添加里程碑、组件等。 它可以通过Web访问, 地址形如 http://trac.common-lisp.net/<project>

登录到你的Trac实例后, 你要做的第一件事就是进入 *设置(Settings)*, 添加你的电子邮件地址和姓名。 这样你的用户名才会出现在工单的“指派给(Assign-To)”下拉列表中。

### 权限 ###

每个拥有 common-lisp.net 账号的人都对应一个Trac用户名和密码, 它保存在 `$HOME/trac-info.txt` 中。 请在里面查看你的用户名和密码。

Trac的配置是: 匿名用户不能创建或修改wiki(但可以提交工单), 而通过身份验证的用户(也就是所有 common-lisp.net 用户)可以创建或修改wiki并提交工单。 如果你需要限制这些权限, 可以去 [clo-devel 邮件列表](http://mailman.common-lisp.net/cgi-bin/mailman/listinfo/clo-devel) 说明你的情况, 或者用 `trac-admin` 为你的项目修改权限。

### 通知 ###

通知会自动发送到 `<project>-ticket@common-lisp.net` 邮件列表, 并将 Reply-To 设置为 `<project>-devel@common-lisp.net` 列表。 如果你想改变这一点, 可以修改 `/project/<project>/trac/conf/trac.ini` 来满足你的需求。


原文链接地址: [http://common-lisp.net/tools/](http://common-lisp.net/tools/)
