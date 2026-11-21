# 从 Pi 上游同步更新

Zokila 保留 Pi 上游源码及提交历史。公开的个人仓库 `https://github.com/Eason2277/zokila.git` 使用 `origin`，Pi 官方仓库 `https://github.com/earendil-works/pi.git` 使用 `upstream`。仓库保留 Pi 的上游 GitHub Actions；启用 Zokila 自己的发布流程前，应逐项审查这些工作流。

## 常规更新

先确认工作区已保存当前开发成果，并检查远端：

```sh
git status --short
git remote -v
git fetch upstream
git log --oneline --left-right --cherry-pick main...upstream/main
```

在专门的集成分支合并上游，再审查冲突和变更：

```sh
git switch -c integrate/pi-YYYYMMDD
git merge upstream/main
```

只解决自己改过的文件中理解清楚的冲突；上游代码、依赖或安全边界发生变化时，先评估再合入主分支。合并后运行仓库规定的检查及 Zokila 对应的验证，再通过 PR 合入自己的 `main`。不要在有未保存改动的工作区直接 `git pull`，也不要强推。上述命令是工作流程示例，不代表本仓库已经完成一次同步。

## 维护边界

- Pi 的核心源码、许可和原始文档保留上游来源；Zokila 的产品代码尽量留在 `apps/` 下。
- 先评估 Pi SDK 能否满足需求，再决定是否修改 Pi core。减少对上游核心文件的改动可降低后续合并成本。
- 继承的 `.github/workflows` 属于 Pi 的发布/CI 流程，不等同于 Zokila 的发布流程。启用或改动这些工作流前逐项审查权限、触发条件和外部写入。
