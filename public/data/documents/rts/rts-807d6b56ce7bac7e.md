# HUD编队显示模块

## 模块范围

本模块负责战斗 HUD 中的编队快捷栏、编队选择弹层和编队管理弹层。它用于显示 1-0 编队状态、绑定当前选择、选择已有编队、定位编队、重绑和清除。

## Prefab 结构

- 宿主 prefab：`Assets/Resources/UI/Prefabs/InGame/SelectionPanel_Prefab.prefab`
- 编队快捷栏节点：`SelectionPanel_Prefab/GroupShortcutBar`
- 编队选择弹层节点：`SelectionPanel_Prefab/GroupPickerPanel`
- 编队管理弹层节点：`SelectionPanel_Prefab/GroupManagePanel`
- 编队快捷条目 prefab：`Assets/Resources/UI/Prefabs/Components/SelectionGroupShortcutItem_Prefab.prefab`
- 共享面板 prefab：`Assets/Resources/UI/Prefabs/Components/SelectionGroupPanel_Prefab.prefab`

`GroupShortcutBar` 子节点：

- `GroupBindButton`：打开编队选择弹层。
- `GroupsHint`：快捷键提示文本。
- `GroupShortcutContent`：编队条目视口，带拖拽滚动组件。
- `GroupShortcutList`：动态编队条目挂点。
- `LeftHint` / `RightHint`：左右滚动提示。

`SelectionGroupShortcutItem_Prefab` 子节点：

- `Icon`：编队状态图标。
- `Number`：编队编号。
- `Count`：编队单位数量。
- `Status`：编队状态文本。

`GroupPickerPanel` 子节点：

- `GroupPicker_1` 到 `GroupPicker_10`：把当前选择绑定到指定编队。

`GroupManagePanel` 子节点：

- `LocateGroupButton`：定位编队。
- `RebindGroupButton`：用当前选择重绑编队。
- `ClearGroupButton`：清除编队。

## 运行时规则

- `SelectionPanel.RefreshGroupShortcutBar()` 负责显隐和刷新每个编队状态。
- `SelectionPanel.CreateGroupShortcutBar()` 只绑定 prefab 内已有的快捷栏、视口、列表和滚动提示。
- `SelectionPanel.CreateGroupShortcutView()` 只实例化 `SelectionGroupShortcutItem_Prefab`，并写入编号、数量、状态、颜色和点击/长按事件。
- `SelectionPanel.CreateGroupPickerPanel()` 和 `CreateGroupManagePanel()` 只绑定 prefab 内已有按钮并注册事件。
- 运行时允许修改条目颜色、编号、数量、状态文本和按钮事件。
- 所有静态位置、尺寸、背景、按钮图片、弹层布局必须在 prefab 中调整。

## 禁止事项

- 不允许恢复旧的 `GroupShortcutContent`、`GroupShortcutList`、滚动提示的可见代码生成。
- 不允许在代码里写死编队快捷栏、编队选择弹层、编队管理弹层的位置。
- 缺 prefab 子节点时只能创建非视觉占位并输出错误日志。

## 2026-05-16 �������
- `GroupShortcutBar` ����ǿ���� `GroupBindButton`��`GroupsHint`��`GroupShortcutContent`��`GroupShortcutList`��`LeftHint`��`RightHint` ��Щ prefab �̶��ڵ㣻ȱʧʱֻ��¼��������͸��ռλ����������ʱ��һ�׿ɼ��ɽṹ��
- `GroupPickerPanel` �� `GroupManagePanel` ��� `GroupPicker_1~10`��`LocateGroupButton`��`RebindGroupButton`��`ClearGroupButton` ����ֱ������ prefab������ֻ�󶨵���¼���״̬��
- `SelectionGroupShortcutItem_Prefab` ����ǿ���� `Icon`��`Number`��`Count`��`Status`�����벻�ٴ�����Щ�ɼ��ӽڵ㣬ֻд״̬���ݺͱ���ɫ��
- ��ӿ����Ŀ�Ŀ������ȶ�ȡ prefab ��ǰ�ߴ磻����ֻ����������к͹������ݿ���ˢ�£����ٰѹ̶���Ƭ�ߴ�д��ΪΨһ��Դ��
