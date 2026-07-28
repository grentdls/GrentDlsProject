# HUD多选单位显示模块

## 模块范围

本模块负责玩家框选或追加选择多个单位后，在 `SelectionPanel_Prefab` 内显示的多选头像栏。它只展示已选单位缩略头像、血量条、单位状态标记，并提供点击头像聚焦单个单位的入口。

## Prefab 结构

- 宿主 prefab：`Assets/Resources/UI/Prefabs/InGame/SelectionPanel_Prefab.prefab`
- 宿主节点：`SelectionPanel_Prefab/MultiPortraitBar`
- 条目 prefab：`Assets/Resources/UI/Prefabs/Components/SelectionMultiPortraitItem_Prefab.prefab`

`MultiPortraitBar` 子节点：

- `MultiPortraitContent`：头像滚动窗口，带 `ScrollRect`、`Mask`。
- `PortraitList`：动态头像条目挂点。
- `CreateGroupButton`：把当前选择保存为编队的入口。

`SelectionMultiPortraitItem_Prefab` 子节点：

- `Icon`：单位头像。
- `Health`：单位血量填充条。
- `Count`：状态/编队标记文本。

## 运行时规则

- `SelectionPanel.RefreshMultiPortraitBar()` 负责决定显隐和刷新数据。
- `SelectionPanel.CreateMultiPortraitBar()` 只绑定 `MultiPortraitBar` 内已有的 prefab 子节点。
- `SelectionPanel.CreateMultiPortraitView()` 只实例化 `SelectionMultiPortraitItem_Prefab`，并写入头像、血量、标记和点击事件。
- 运行时允许更新 `Icon.sprite`、`Health.fillAmount`、`Count.text`、按钮点击事件。
- 位置、尺寸、背景、滚动窗口大小、按钮图片必须在 prefab 中调整。

## 禁止事项

- 不允许恢复旧的 `new GameObject("MultiPortraitContent", Image, Mask, ScrollRect)` 可见创建逻辑。
- 不允许在代码中重新创建 `Icon`、`Health`、`Count` 的可见 UI；缺失时只允许最小占位并输出错误日志。
- 不允许把多选头像栏放到 HUD prefab 之外的临时 Canvas。

## 2026-05-16 �������
- `MultiPortraitBar` ����ǿ���� `MultiPortraitContent`��`PortraitList`��`CreateGroupButton` ������ prefab �̶��ڵ㣻ȱʧʱֻ��¼��������͸��ռλ����������ʱ��һ�׿ɼ���������ť��
- `SelectionMultiPortraitItem_Prefab` ����ǿ���� `Icon`��`Health`��`Count`������ֻд��̬ͼ�ꡢѪ���ͱ�ǣ����ٴ����µĿɼ� `Image/Text` �ӽڵ㡣
- ��ѡͷ����Ŀ�Ŀ������ȶ�ȡ prefab ��ǰ�ߴ磻ֻ����Ŀδ�������� layout ʱ������Ż��䵽Ĭ�Ϻ󱸳ߴ硣
